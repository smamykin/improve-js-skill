//main styles
import '../style/main.scss';

import form from './parts/form.js';
import nav from './parts/navigation';

form({
    formContainer: document.querySelector('.js-form_container'),
    closeButton: document.querySelector('.js-form_close'),
    showHideButton: document.querySelector('.js-show_hide_trigger'),
    hideClass:'is_hidden',
    showClass:'slideDown',
    form: document.querySelector('.js-form_container form'),
    errorClass: 'is_error'
});

nav({
    header: document.querySelector('.js-header_container'),
    links: document.querySelectorAll('.nav .nav__link'),
    activeClass: 'nav__link--active'
});
