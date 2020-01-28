function getDatabase() {
    const _db = new Dexie("main");
    _db.version(1).stores({
        score: 'score,&id'
    });
    _db.open();
    return _db;
}

function getScoreStore() {
    return getDatabase()
        .score;
}

function getStoredScore() {
    return new Promise((accept, reject) => {
        getScoreStore()
            .get({
                id: 'main'
            })
            .then((data) => {
                accept(data ? data.score : 0);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function removeScore() {
    return new Promise((accept, reject) => {
        getScoreStore()
            .where('id')
            .anyOf('main')
            .delete()
            .then((data) => {
                accept(data ? data.score : 0);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

function updateStoredScore(score = 0) {
    return new Promise((accept, reject) => {
        window._score = getDatabase().score;
        removeScore()
            .then(() => {
                getScoreStore()
                    .put({ score, id: 'main' })
                    .then((updated) => {
                        if (!updated) {
                            return reject("DID NOT UPDATE...");
                        }
                        return accept();
                    })
                    .catch((err) => {
                        console.log("Error putting score: ", { err });
                        reject(err);
                    });
            })
            .catch((err) => {
                console.log("Error removing score: ", { err });
                reject(err);
            });
    })
}