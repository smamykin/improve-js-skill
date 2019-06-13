import Swiper from 'swiper';

//swiper
new Swiper('.swiper-container', {
    speed: 600,
    parallax: true,
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay:{
        delay: 10000,
        disableOnInteraction: false,
    }
});

//hide header for cover picture
const showHideBoundary = 100;
const header = document.querySelector('.header');
const hideHeader = (header, scrolledContainer) => {
    if (showHideBoundary > scrolledContainer.scrollTop) {
        header.style.top = '-100px';
    }
};
const showHeader = (header, scrolledContainer) => {
    if (showHideBoundary < scrolledContainer.scrollTop) {
        header.style.top = '0px';
    }
};
const hideShowHeader = (header, scrolledContainer) => {
    hideHeader(header, scrolledContainer);
    showHeader(header, scrolledContainer);
};

const body = document.querySelector('body');

hideShowHeader(header, body);

const onScroll = (event) => {
    let header = document.querySelector('.header');
    hideShowHeader(header, event.target);
};

body.addEventListener('scroll', onScroll);


//scroll further from a cover picture
const scrollLink = document.querySelector('.js-scroll-swiper-link');
const onClickOnScrollLink = () => {
    let id = setInterval(function(){
        const end  = scrollLink.offsetTop - header.offsetHeight;
        const start = body.scrollTop;
        const pieceMax = 7;
        let dist = end - start;
        if (dist <= 0) {
            clearInterval(id);
            return;
        }
        let piece = (dist < pieceMax) ? dist : pieceMax;
        body.scrollTop = start + piece;
    },0.01);

};
scrollLink.addEventListener('click', onClickOnScrollLink,false);
