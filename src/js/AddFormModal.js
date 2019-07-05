import tingle from 'tingle.js';
import {getElementFromHtmlString} from "./tools";

export default function createAddFormModal(onSubmit) {
    const modal = createModal();
    const form = createAddForm();

    form.addEventListener('submit', onSubmit);
    form.addEventListener('submit', () => {
        modal.close()
    });

    modal.setContent(form);

    return modal;
}

function createModal() {
    return new tingle.modal({
        footer: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
    });
}

function createAddForm() {
    return getElementFromHtmlString(require('./../templates/addPersonForm.twig')());
}

