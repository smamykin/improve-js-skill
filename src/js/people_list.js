import getIDBPersonList from "./dbPersonList";
import Loader from "./Loader";
import invite from "./Invitation";
import ContextMenuFactory from "./ContextMenu";
import createAddFormModal from "./AddFormModal";
import {fromEvent, from} from "rxjs";
import {debounceTime, filter, map, mergeAll, mergeMap, scan} from "rxjs/operators";

let _addModal;//use getModal()

const selectors ={
        addBtn: '.js-add_person',
        container: '.people_list_container',
        search: '.js-search_container input[type="search"]'
    },
    addBtn = document.querySelector(selectors.addBtn),
    search = document.querySelector(selectors.search),
    loaderHtml = '<div class="loader-inner ball-beat"><div></div><div></div><div></div></div>',
    getModal = () => {
        _addModal = _addModal || createAddFormModal(onAddPersonSubmit);
        return _addModal;
    };

//process
refreshPeopleList();
addBtn && addBtn.addEventListener('click', () => getModal().open());


fromEvent(search,'input')
    .pipe(debounceTime(2000))
    .pipe( map(event => {return event.target["value"];}))
    .pipe(
        mergeMap((str) => {
            return from(getIDBPersonList().getAll())
            .pipe(mergeAll())
            .pipe(filter((person)=> (new RegExp(str)).test(person.name)))
            .pipe(scan((acc, val)=> {
                acc.push(val);
                return acc;
            },[]))
        }),
    )
    .subscribe((peopleList) => {
        console.dir(peopleList);
        preparePhotoUrls(peopleList)
            .then(renderPeople)
            .then(initContextMenu)
    },(e)=> console.error(e));

/**
 * pull from  db people list and render it into the page
 */
function refreshPeopleList() {
    getIDBPersonList().getAll()
        .then(preparePhotoUrls)
        .then(renderPeople)
        .then(initContextMenu)
        .catch((reason) => console.error(reason))
}

/**
 * Because in the db is been storing File Objects we should convert it to string with url
 *
 * @param people
 * @returns {*}
 */
async function preparePhotoUrls(people) {
    for (let person of people) {
        if (!person.photo) continue;

        person.photo = window.URL.createObjectURL(person.photo);
    }
    console.log(people);
    return people;
}

async function renderPeople(people) {
    const container = document.querySelector(selectors.container);
    console.log(people);
    container.innerHTML = require('./../templates/peopleList.twig')({'people': people});
    console.log(container.children);
    console.log(container);
    return Array.from(container.children);
}

async function initContextMenu(personCards) {
    personCards.forEach((element) => {
        element.addEventListener('contextmenu', onCardContextMenu);
    });

    return personCards;
}

function onAddPersonSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    checkForm(event.target)
        .then(createPersonFromForm)
        .then(getIDBPersonList().add)
        .then(refreshPeopleList)
        .catch((reason) => {
            console.error(reason);
        });
}

async function checkForm(form) {
    if (!form['person_name'].value) {
        throw 'The field "name" should not be empty'
    }

    return form;
}

async function createPersonFromForm(form) {
    return {
        name: form['person_name'].value,
        title: form['person_title'].value,
        quote: form['person_quote'].value,
        photo: form['person_photo'].files[0]
    };
}

function onCardContextMenu(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const personId = +event.currentTarget.getAttribute('data-person_id'),
        body = document.querySelector('body');

    ContextMenuFactory
        .create()
        .setPosition(event.pageX, event.pageY)
        .on('click', onInvite.bind(null, personId), true)
        .addCloseEvents(['click', 'contextmenu'], body)
        .show();
}

function onInvite(personId, event) {
    if (!event.target.classList.contains('js-invite_btn')) {
        return;
    }

    event.stopPropagation();

    const loader = new Loader(event.target, loaderHtml);

    loader.on();
    invite(personId)
        .then(() => alert('success'))
        .catch((e) => alert(e))
        .finally(() => loader.off());
}

