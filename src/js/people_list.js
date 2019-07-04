import tingle from 'tingle.js';
import getIDBPersonList from "./dbPersonList";
import Loader from "./Loader";
import {getElementFromHtmlString} from "./tools";
import invite from "./Invitation";
import ContextMenuFactory from "./ContextMenu";


// add new person
(function () {

    let _addModal,//use getModal()
        _contextMenu; //only one context menu on the page in a moment


    const body = document.querySelector('body'),
        container = document.querySelector('.people_list_container'),
        addBtn = document.querySelector('.js-add_person'),
        dbPersonList = getIDBPersonList(),
        loaderHtml = '<div class="loader-inner ball-beat"><div></div><div></div><div></div></div>',
        getModal = () => {
            return _addModal || initAddFormModal()
        };

    //process
    refreshPeopleList();
    addBtn && addBtn.addEventListener('click', () => getModal().open());

    //process end

    /**
     * pull from  db people list and render it into the page
     */
    function refreshPeopleList() {
        dbPersonList.getAll()
            .then(preparePhotoUrls)
            .then(renderPeople)
            .then(contextMenuOnPersonCard)
            .catch((reason) => console.error(reason))
    }

    /**
     * Because in the db is been storing File Objects we should convert it to string with url
     *
     * @param people
     * @returns {*}
     */
    function preparePhotoUrls(people) {
        for (let person of people) {
            if (person.photo) {
                person.photo = window.URL.createObjectURL(person.photo);
            }
        }

        return people;
    }

    function renderPeople(people) {
        container.innerHTML = require('./../templates/peopleList.twig')({'people': people});

        return people;
    }

    function onAddPersonSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        let form = event.target,
            name = form['person_name'].value,
            title = form['person_title'].value,
            quote = form['person_quote'].value,
            photo = form['person_photo'].files[0];


        // form valid if we have a non-empty name field
        if (!name) {
            return;
        }

        dbPersonList.add({name, title, quote, photo})
            .then(refreshPeopleList)
            .catch((reason) => {
                console.error(reason);
            });
    }

    function createAddForm() {
        const html = require('./../templates/addPersonForm.twig')();
        return getElementFromHtmlString(html);
    }

    function createModal() {
        return new tingle.modal({
            footer: true,
            stickyFooter: false,
            closeMethods: ['overlay', 'button', 'escape'],
            closeLabel: "Close",
        });
    }

    function initAddFormModal() {
        const modal = createModal();
        const form = createAddForm();

        form.addEventListener('submit', onAddPersonSubmit);
        form.addEventListener('submit', () => {
            modal.close()
        });

        modal.setContent(form);

        return modal;
    }


    function addListenerContextMenu(element) {
        const personId = +element.getAttribute('data-person_id');
        element.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            ContextMenuFactory
                .create()
                .setPosition(event.pageX, event.pageY)
                .on('click', onInvite.bind(null, personId, loaderHtml))
                .addCloseEvents(['click', 'contextmenu'], body)
                .show();
        });
    }

    function contextMenuOnPersonCard() {
        container.querySelectorAll('.js-person_card')
            .forEach(addListenerContextMenu);
    }

    function onInvite(personId, loaderHtml, event) {
        if (!event.target.classList.contains('js-invite_btn')) {
            return;
        }

        event.stopPropagation();

        const loader = new Loader(event.target, loaderHtml);
        loader.on();

        invite(personId)
            .then(() => alert('success'))
            .catch((e) => alert(e))
            .finally(() => loader.off());
    }
})();

