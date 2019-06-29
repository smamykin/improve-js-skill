import tingle from 'tingle.js';
import getIDBPersonList from "./dbPersonList";

const dbPersonList = getIDBPersonList();

// add new person
(function () {
    const container = document.querySelector('.people_list_container'),
        addBtn = document.querySelector('.js-add_person');

    let addModal;

    init();

    function init() {
        refreshPeopleList();

        if (addBtn) {
            addBtn.addEventListener('click', showAddPersonModal)
        }

    }

    function onError(error) {
        console.error(error);
    }

    function renderPeople(people) {
        for (let person of people) {
            if (person.photo) {
                person.photo = window.URL.createObjectURL(person.photo);
            }
        }
        container.innerHTML = require('./../templates/peopleList.twig')({'people': people});
    }

    function refreshPeopleList() {
        dbPersonList
            .then((store) => store.getAll())
            .then(renderPeople)
            .catch(onError)
    }

    function onAddPersonSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        let form = e.target,
            name = form['person_name'].value,
            title = form['person_title'].value,
            quote = form['person_quote'].value,
            photo = form['person_photo'].files[0];

        if (!name) {
            return;
        }

        dbPersonList.then(function (store) {
            store.add({name, title, quote, photo});
            refreshPeopleList()
        }).catch(function (reason) {
            console.error(reason);
        });
    }

    function createAddForm() {
        const wrapper = document.createElement('div');
        const template = require('../templates/addPersonForm.twig');
        wrapper.innerHTML = template().trim();

        return wrapper.firstElementChild;
    }

     function createModal() {

        return new tingle.modal({
            footer: true,
            stickyFooter: false,
            closeMethods: ['overlay', 'button', 'escape'],
            closeLabel: "Close",
        });
    }

    function initAddFormModal(){

        const modal = createModal();
        const form = createAddForm();

        form.addEventListener('submit', onAddPersonSubmit);
        form.addEventListener('submit', function () {
            modal.close()
        });

        modal.setContent(form);
        return modal;
    }

    function showAddPersonModal() {
        addModal = addModal || initAddFormModal();
        addModal.open();
    }

})();
