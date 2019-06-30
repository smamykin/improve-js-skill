import {openDB} from 'idb';

export default function getIDBPersonList() {
    const dbName = 'app';
    const personListStoreName = 'person_list';
    const version = 1;
    const dbPromise = openDB(dbName, version, {
        upgrade(db, oldVersion, newVersion, transaction) {
            debugger;
            for (let i = oldVersion; i < newVersion; ++i) {
                switch (oldVersion) {
                    case 0:
                        db.createObjectStore(personListStoreName, {
                            keyPath:'id',
                            autoIncrement: true
                        });
                        break;
                }
            }
        },
        blocked() {
        },
        blocking() {
        }
    });

    return {
        async get(key) {
            return (await dbPromise).get(personListStoreName, key);
        },
        async add(val) {
            return (await dbPromise).add(personListStoreName, val);
        },
        async put(val) {
            return (await dbPromise).put(personListStoreName, val);
        },
        async delete(key) {
            return (await dbPromise).delete(personListStoreName, key);
        },
        async clear() {
            return (await dbPromise).clear(personListStoreName);
        },
        async getAll() {
            let cursor = await (await dbPromise).transaction(personListStoreName).store.openCursor(),
                container = [];

            while (cursor) {
                container.push(cursor.value);


                cursor = await cursor.continue();
            }

            return container;
        }
    };
}