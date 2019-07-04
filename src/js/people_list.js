import tingle from 'tingle.js';
import getIDBPersonList from "./dbPersonList";
import Loader from "./Loader";
import {getElementFromHtmlString} from "./tools";
import invite from "./Invitation";
import ContextMenuFactory from "./ContextMenu";


// add new person
(function () {

    let _addModal;//use getModal()

    const body = document.querySelector('body'),
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
            .then(initContextMenu)
            .catch((reason) => console.error(reason))
    }

    /**
     * Because in the db is been storing File Objects we should convert it to string with url
     *
     * @param people
     * @returns {*}
     */
    async function preparePhotoUrls(people) {
        for (let person of people) {
            if (!person.photo) continue;

            person.photo = window.URL.createObjectURL(person.photo);
        }

        return people;
    }

    async function renderPeople(people) {
        const container = document.querySelector('.people_list_container');

        container.innerHTML = require('./../templates/peopleList.twig')({'people': people});

        return Array.from(container.children);
    }

    async function initContextMenu(personCards) {
        personCards.forEach((element) => {
            element.addEventListener('contextmenu', onCardContextMenu);
        });

        return personCards;
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

    function onAddPersonSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        checkForm(event.target)
            .then(createPersonFromForm)
            .then(dbPersonList.add)
            .then(refreshPeopleList)
            .catch((reason) => {
                console.error(reason);
            });
    }

    async function checkForm(form){
        if (!form['person_name'].value){
            throw 'The field "name" should not be empty'
        }

        return form;
    }

    async function createPersonFromForm(form) {
        return {
            name: form['person_name'].value,
            title: form['person_title'].value,
            quote: form['person_quote'].value,
            photo: form['person_photo'].files[0]
        };
    }

    function onCardContextMenu(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const personId = +event.currentTarget.getAttribute('data-person_id');

        ContextMenuFactory
            .create()
            .setPosition(event.pageX, event.pageY)
            .on('click', onInvite.bind(null, personId), true)
            .addCloseEvents(['click', 'contextmenu'], body)
            .show();
    }

    function onInvite(personId, event) {
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

