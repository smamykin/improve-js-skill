//main styles
import '../style/main.scss';

import form from './parts/form.js';

form({
    formContainer: document.querySelector('.js-form_container'),
    closeButton: document.querySelector('.js-form_close'),
    showHideButton: document.querySelector('.js-show_hide_trigger'),
    hideClass:'is_hidden',
    showClass:'slideDown'
});
