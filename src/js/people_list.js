import tingle from 'tingle.js';
import {openDB} from 'idb';

(function(){
    if (location.pathname !== '/people_list.html') {
        return;
    }

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
            let template = require('../templates/addPersonForm.twig');
            div.innerHTML = template();
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

