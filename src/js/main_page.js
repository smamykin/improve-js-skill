import Swiper from 'swiper';

(function () {
    if (location.pathname !== '/') {
        return;
    }

    //init swiper
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

    const header = document.querySelector('body > .header'),
        scrollContainer = document.querySelector('html');

    //hide header for cover picture
    (function (scrollContainer, header, showHideBoundary, hiddenClass) {
        const hideShowHeader = () => {
            const hasClass = 0 < header.className.indexOf(hiddenClass);
            let scrollTop = scrollContainer.scrollTop;

            if (!hasClass && showHideBoundary > scrollTop) {
                header.className += ` ${hiddenClass}`
            } else if (hasClass && showHideBoundary <= scrollTop) {
                header.className = header.className.replace(new RegExp(hiddenClass, 'g'), '');
            }
        };

        hideShowHeader();

        window.addEventListener('scroll', hideShowHeader);
    })(scrollContainer, header, 100, 'hidden');

    //scroll further from a cover picture
    (function (scrollContainer, header, scrollLink) {
        const onClickOnScrollLink = () => {

            let id = setInterval(function () {
                const end = scrollLink.offsetTop - header.offsetHeight;
                const start = scrollContainer.scrollTop;
                const pieceMax = 7;

                let dist = end - start;
                if (dist <= 0) {
                    clearInterval(id);
                    return;
                }
                let piece = (dist < pieceMax) ? dist : pieceMax;
                scrollContainer.scrollTop = start + piece;
            }, 0.01);

        };

        scrollLink.addEventListener('click', onClickOnScrollLink, false);

    })(scrollContainer, header, document.querySelector('.js-scroll-swiper-link'));

})();

