import Swiper from 'swiper';
import tingle from 'tingle.js';
import {openDB} from 'idb';


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

    async function getIDBPersonList(){
        const dbName = 'app';
        const personListStoreName = 'person_list';
        const version = 1;
        const dbPromise = openDB(dbName, version, {
            upgrade(db, oldVersion, newVersion, transaction) {
                debugger;
                for (let i = oldVersion; i < newVersion; ++i){
                    switch (oldVersion){
                        case 0:
                            db.createObjectStore(personListStoreName,{autoIncrement:true});
                        break;
                    }
                }
            },
            blocked() {},
            blocking() {}
        });

        return {
            async get(key) {
                return (await dbPromise).get(personListStoreName, key);
            },
            async add(val) {
                return (await dbPromise).add(personListStoreName, val);
            },
            async put(key, val) {
                return (await dbPromise).put(personListStoreName, val, key);
            },
            async delete(key) {
                return (await dbPromise).delete(personListStoreName, key);
            },
            async clear() {
                return (await dbPromise).clear(personListStoreName);
            }
        };
    }

    const onAddPerson = function(e){
        e.preventDefault();
        e.stopPropagation();

        let form = e.target,
            name = form['person_name'].value,
            title= form['person_title'].value,
            quote= form['person_quote'].value;

        if (!name){
            return;
        }

        const dbPersonList = getIDBPersonList();

        dbPersonList.then(function(store){
            store.add({ name, title, quote });
        }).catch(function(reason){
            console.error(reason);
        });
    };

    let addModal;
    const showAddPersonModal = function() {

        function initAddFormModal() {
            let modal = new tingle.modal({
                footer: true,
                stickyFooter: false,
                closeMethods: ['overlay', 'button', 'escape'],
                closeLabel: "Close",
            });

            let div = document.createElement('div');
            div.innerHTML = require('./templates/addPersonForm.twig').default;
            let form = div.querySelector('form');
            form.addEventListener('submit', onAddPerson);
            form.addEventListener('submit', function(){
                modal.close()
            });
            modal.setContent(div);
            return modal;
        }

        addModal = addModal || initAddFormModal();
        addModal.open();
    };

    addBtn.addEventListener('click',showAddPersonModal)
})();


