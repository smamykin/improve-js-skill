import tingle from 'tingle.js';
import getIDBPersonList from "./dbPersonList";


// add new person
(function () {
    let _addModal; //use getModal()
    const container = document.querySelector('.people_list_container'),
        addBtn = document.querySelector('.js-add_person'),
        dbPersonList = getIDBPersonList(),
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
        dbPersonList
            .then((store) => store.getAll())
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

        dbPersonList
            .then((store) => {
                store.add({name, title, quote, photo});
            })
            .then(refreshPeopleList)
            .catch((reason) => {
                console.error(reason);
            });
    }

    function createAddForm() {
        const html = require('./../templates/addPersonForm.twig')();
        return getElementFromTemplate(html);
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

    /**
     * @todo refactor this function
     */
    function contextMenuOnPersonCard() {

        let contextMenu;// only one element in the moment on the page
        const body = document.querySelector('body');

        container
            .querySelectorAll('.js-person_card')
            .forEach((element) => {
                const personId = element.getAttribute('data-person_id');
                element.addEventListener('contextmenu', (event) => {

                    contextMenu && contextMenu.remove();

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    contextMenu = createContextMenu();

                    contextMenu.style.top = event.clientY + 'px';
                    contextMenu.style.left = event.clientX + 'px';

                    contextMenu.addEventListener('click', (event) => {
                        if (event.target.classList.contains('js-invite_btn')) {
                            event.stopPropagation();

                            invitePerson(personId);
                        }
                    });

                    body.addEventListener('click', () => contextMenu.remove());
                    body.addEventListener('contextmenu', () => contextMenu.remove());

                    body.appendChild(contextMenu);
                });
            });
    }

    function createContextMenu() {
        const html = require('./../templates/contextMenu.twig')();

        return getElementFromTemplate(html);
    }

    function getElementFromTemplate(html) {
        const wrapper = document.createElement('div');

        wrapper.innerHTML = html.trim();

        return wrapper.firstChild;
    }

    function invitePerson() {
        return false;
    }
})();
