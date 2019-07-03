
import tingle from 'tingle.js';
import getIDBPersonList from "./dbPersonList";
import Loader from "./Loader";
import {getElementFromHtmlString, randomBool, sleep} from "./tools";


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


    function getListenerContextMenu(personId) {
        return (event) => {

            _contextMenu && _contextMenu.remove();

            event.preventDefault();
            event.stopImmediatePropagation();

            _contextMenu = createContextMenu();

            _contextMenu.style.top = event.pageY + 'px';
            _contextMenu.style.left = event.pageX + 'px';

            _contextMenu.addEventListener('click', (event) => {
                if (event.target.classList.contains('js-invite_btn')) {
                    event.stopPropagation();
                    const loader = new Loader(event.target, loaderHtml);

                    invitePerson(personId, loader);
                }
            });

            body.addEventListener('click', () => _contextMenu.remove());
            body.addEventListener('contextmenu', () => _contextMenu.remove());

            body.appendChild(_contextMenu);
        };
    }

    function contextMenuOnPersonCard() {

        container
            .querySelectorAll('.js-person_card')
            .forEach((element) => {
                const personId = +element.getAttribute('data-person_id');

                element.addEventListener('contextmenu', getListenerContextMenu(personId));
            });
    }

    function createContextMenu() {
        const html = require('./../templates/contextMenu.twig')();

        return getElementFromHtmlString(html);
    }

    function invitePerson(personId, loader) {

        loader.on();
        dbPersonList
            .get(personId)
            .then(checkRating)
            .then(checkNonInvited)
            .then(isTicketsAreAvailable)
            .then(commitInvitation)
            .then(()=>alert('success'))
            .catch(onInviteError)
            .finally(()=>{loader.off()});

        return false;
    }

    async function checkRating(person){
        await sleep();
        if (randomBool()){
            return person;
        }
        throw 'the person\'s rating is too low!';
    }
    async function checkNonInvited(person){
        await sleep();
        if (person.isInvited){
            throw 'the person is already invited!'
        }
        return person;
    }
    async function isTicketsAreAvailable(person){
        await sleep();
        if (randomBool()){
            return person;
        }
        throw 'tickets are over!';
    }

    async function commitInvitation(person){
        await sleep();
        return await dbPersonList.put({...person, 'isInvited':true})
            .catch(onInviteError)
    }

    function onInviteError(e) {
        alert(e);
    }
})();

