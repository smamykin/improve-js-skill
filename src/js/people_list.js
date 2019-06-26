import tingle from 'tingle.js';
import getIDBPersonList from "./dbPersonList";

(function () {

    const addBtn = document.querySelector('.js-add_person');
    if (!addBtn) {
        return;
    }

    const onAddPersonSubmit = function (e) {
        e.preventDefault();
        e.stopPropagation();

        let form = e.target,
            name = form['person_name'].value,
            title = form['person_title'].value,
            quote = form['person_quote'].value;

        if (!name) {
            return;
        }

        const dbPersonList = getIDBPersonList();

        dbPersonList.then(function (store) {
            store.add({name, title, quote});
        }).catch(function (reason) {
            console.error(reason);
        });
    };

    const createAddForm = function () {
        const wrapper = document.createElement('div');
        const template = require('../templates/addPersonForm.twig');
        wrapper.innerHTML = template().trim();

        return wrapper.firstElementChild;
    };

    const createModal = function(){
        return new tingle.modal({
            footer: true,
            stickyFooter: false,
            closeMethods: ['overlay', 'button', 'escape'],
            closeLabel: "Close",
        });
    };

    const initAddFormModal = function () {

        const modal = createModal();
        const form = createAddForm();

        form.addEventListener('submit', onAddPersonSubmit);
        form.addEventListener('submit', function () {
            modal.close()
        });

        modal.setContent(form);
        return modal;
    };
    
    let addModal;
    const showAddPersonModal = function () {
        addModal = addModal || initAddFormModal();
        addModal.open();
    };

    addBtn.addEventListener('click', showAddPersonModal)
})();

