import Swiper from 'swiper';
import tingle from 'tingle.js';

//swiper
new Swiper('.swiper-container', {
    speed: 600,
    parallax: true,
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 10000,
        disableOnInteraction: false,
    }
});

(function () {
    const header = document.querySelector('body > .header'),
        body = document.querySelector('body');

    if (! header.hasAttribute('data-is_hide')) {
        return;
    }

    //hide header for cover picture
    (function (body, header, showHideBoundary, hiddenClass) {
        const hideShowHeader = () => {
            const hasClass = 0 < header.className.indexOf(hiddenClass);
            let scrollTop = body.scrollTop;

            if (!hasClass && showHideBoundary > scrollTop) {
                header.className += ` ${hiddenClass}`
            } else if (hasClass && showHideBoundary <= scrollTop) {
                header.className = header.className.replace(new RegExp(hiddenClass, 'g'), '');
            }
        };

        hideShowHeader();

        body.addEventListener('scroll', hideShowHeader);
    })(body, header, 100, 'hidden');

    (function (body, header, scrollLink) {
        //scroll further from a cover picture
        const onClickOnScrollLink = () => {

            let id = setInterval(function () {
                const end = scrollLink.offsetTop - header.offsetHeight;
                const start = body.scrollTop;
                const pieceMax = 7;

                let dist = end - start;
                if (dist <= 0) {
                    clearInterval(id);
                    return;
                }
                let piece = (dist < pieceMax) ? dist : pieceMax;
                body.scrollTop = start + piece;
            }, 0.01);

        };
        scrollLink.addEventListener('click', onClickOnScrollLink, false);
    })(body, header, document.querySelector('.js-scroll-swiper-link'));
})();

(function(){

    const addBtn = document.querySelector('.js-add_person');
    if (!addBtn){
        return;
    }
    let addModal;
    const onAddPerson = function(e){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        let form = e.target;
        console.log([form.person_name, form.person_title, form.person_quote]);
    };

    const showAddPersonModal = function() {

        function getModal() {
            let modal = new tingle.modal({
                footer: true,
                stickyFooter: false,
                closeMethods: ['overlay', 'button', 'escape'],
                closeLabel: "Close",
                // cssClass: ['custom-class-1', 'custom-class-2'],
                onOpen: function () {
                    console.log('modal open');
                },
                onClose: function () {
                    console.log('modal closed');
                },
                beforeClose: function () {
                    // here's goes some logic
                    // e.g. save content before closing the modal
                    return true; // close the modal
                    // return false; // nothing happens
                }
            });
            let div = document.createElement('div');
            div.innerHTML = require('./templates/addPersonForm.twig').default;
            let form = div.querySelector('form');
            form.addEventListener('submit', onAddPerson);
            modal.setContent(div);
            return modal;
        }

        addModal = addModal || getModal();
        addModal.open();
    };

    addBtn.addEventListener('click',showAddPersonModal)
})();


