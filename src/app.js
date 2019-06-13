import Swiper from 'swiper';

new Swiper('.swiper-container', {
    speed: 600,
    parallax: true,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay:{
        delay: 10000,
        disableOnInteraction: false,
    }
});
const showHideBoundary = 100;
let header = document.querySelector('.header');
const hideHeader = (header) => {
    if (showHideBoundary > window.scrollY) {
        header.style.top = '-100px';
    }
};
const showHeader = (header) => {
    if (showHideBoundary < window.scrollY) {
        header.style.top = '0px';
    }
};
const hideShowHeader = (header) => {
    hideHeader(header);
    showHeader(header);
};

hideShowHeader(header);

const onScroll = () => {
    let header = document.querySelector('.header');
    hideShowHeader(header);
};

document.addEventListener('scroll', onScroll);
