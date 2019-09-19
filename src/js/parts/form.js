export default function (options) {
    if (!options.formContainer) {
        throw 'form container not defined';
    }

    if (!options.hideClass) {
        throw 'hise class not defined';
    }

    function onClose() {
        options.formContainer.className = options.formContainer.className.replace('slideDown', options.hideClass);
        options.closeButton.removeEventListener('click', onClose);
    }

    function onShow() {
        options.formContainer.className = options.formContainer.className.replace(options.hideClass, 'slideDown');
        if (options.closeButton) {
            options.closeButton.addEventListener('click', onClose);
        }
    }

    if (!options.showHideButton) {
        throw 'show-hide button not defined';
    }

    options.showHideButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (options.formContainer.className.indexOf(options.hideClass) < 0) {
            e.currentTarget.style = '';
            onClose();
        } else {
            e.currentTarget.style = ' transform:rotate(180deg)';
            onShow();
        }
    });
}

