import getIDBPersonList from "./dbPersonList";
import {randomBool, sleep} from "./tools";

function invite(personId) {
    return getPersonById(personId)
        .then(checkRating)
        .then(checkNonInvited)
        .then(isTicketsAreAvailable)
        .then(commitInvitation)
}

async function getPersonById(personId) {
    const person = getIDBPersonList().get(personId);
    if (!person) {
        throw `person with id = ${personId} is not found!`;
    }
    return person;
}

async function checkRating(person) {
    await sleep();
    if (randomBool()) {
        return person;
    }
    throw 'the person\'s rating is too low!';
}

async function checkNonInvited(person) {
    await sleep();
    if (person.isInvited) {
        throw 'the person is already invited!'
    }
    return person;
}

async function isTicketsAreAvailable(person) {
    await sleep();
    if (randomBool()) {
        return person;
    }
    throw 'tickets are over!';
}


async function commitInvitation(person) {
    await sleep();
    return getIDBPersonList().put({...person, 'isInvited': true})
}

export default invite;
