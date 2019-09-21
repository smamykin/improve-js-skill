export default function (options) {
    if (!options.formContainer) {
        throw 'form container not defined';
    }

    if (!options.hideClass) {
        throw 'hise class not defined';
    }

    if (!options.showHideButton) {
        throw 'show-hide button not defined';
    }

    options.showHideButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (options.formContainer.className.indexOf(options.hideClass) < 0) {
            onClose();
        } else {
            onShow();
        }
    });

    document.addEventListener('keyup', onEscapeKeyup);

    function onClose() {
        options.showHideButton.style = '';
        options.formContainer.className = options.formContainer.className.replace(options.showClass, options.hideClass);
        options.closeButton.removeEventListener('click', onClose);
    }

    function onShow() {
        options.showHideButton.style = ' transform:rotate(180deg)';
        options.formContainer.className = options.formContainer.className.replace(options.hideClass, options.showClass);
        if (options.closeButton) {
            options.closeButton.addEventListener('click', onClose);
        }
    }
    function onEscapeKeyup(event){
        if (options.formContainer.className.indexOf(options.hideClass) >= 0){
            return;
        }

        let charCode = (typeof event.which === "number") ? event.which : event.keyCode;

        if (charCode === 27){
            onClose();
        }
    }
}

