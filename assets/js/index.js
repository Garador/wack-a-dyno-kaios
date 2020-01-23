$(document).ready(function () {
    let dinoOriginal = document.querySelector('.dino--original');
    let fieldEl = document.querySelector('.field');
    let scoreEl = document.querySelector('.score');
    let highestScorelement = document.querySelector('.highest-score');
    let startEl = document.querySelector('#softkey');
    let timeEl = document.querySelector('.time');
    let dinosFrag = document.createDocumentFragment();
    let max = 7;
    let dinos = [];
    let dinosSVGs = [];
    let score = 0;
    let isTouch = true;
    let isRunning = false;
    let time = 60;
    let timer = null;

    function shake() {
        fieldEl.classList.add('shake');

        fieldEl.addEventListener('animationend', () => {
            fieldEl.classList.remove('shake');
        });
    }

    function setTimer() {
        time = 60;
        timeEl.innerText = time;

        timer = setInterval(function () {
            time = time - 1;
            timeEl.innerText = time;

            if (time <= 0) {
                gameOver();
            }
        }, 1000);
    }

    function start() {
        if (isRunning) return;
        for (let i = 0; i < dinos.length; i++) {
            let dinoSVG = dinos[i].querySelector('#Dino');
            dinoSVG.style.transform = 'translateY(80%)';
            dinoSVG.style.animation = 'peeking 5.5s infinite';
            dinoSVG.querySelector('#DeadEyes').style.display = 'none';
            dinoSVG.querySelector('#Tongue').style.display = 'none';
            dinoSVG.querySelector('#AngryEyebrows').style.display = 'none';
            dinoSVG.style.animationDelay = (1000 + (i * 700)) + Math.floor((Math.random() * 4000)) + 'ms'
        }

        if (!isRunning) {
            setTimer();
            score = 0;
            scoreEl.innerText = score;
            isRunning = true;
        }
        hideLatestScore();
    }

    function gameOver() {
        clearInterval(timer);
        isRunning = false;
        //startEl.classList.remove('hide');
        for (let i = 0; i < dinos.length; i++) {
            let dinoSVG = dinos[i].querySelector('#Dino');
            dinoSVG.style.transform = 'translateY(80%)';
            dinoSVG.style.animation = 'slowly-peeking 10s infinite';
            dinoSVG.style.animationDelay = (Math.random() * 5000) + 'ms';
        }
        showLatestScore(score);
    }

    function init() {

        function animate(dino, dinoSVG) {
            const dir = [1, -1][Math.floor(Math.random() * 2)];
            const showHorn = (Math.random() * 10) > 5;
            const isGentleman = (Math.random() * 10) > 9;

            dino.querySelector('svg').style.transform = `scaleX(${dir})`;

            dinoSVG.querySelector('#DeadEyes').style.display = 'none';
            dinoSVG.querySelector('#Tongue').style.display = 'none';
            dinoSVG.querySelector('#AngryEyebrows').style.display = 'none';
            dinoSVG.querySelector('#Eyes').style.display = 'block';
            dinoSVG.querySelector('#TopHat').style.display = 'none';
            dinoSVG.querySelector('#Monocle').style.display = 'none';

            if (showHorn) {
                dinoSVG.querySelector('#Horn').style.display = 'block';
            } else {
                dinoSVG.querySelector('#Horn').style.display = 'none';
            }

            if (isGentleman) {
                dinoSVG.querySelector('#TopHat').style.display = 'block';
                dinoSVG.querySelector('#Monocle').style.display = 'block';
                dinoSVG.querySelector('#Horn').style.display = 'none';
            }
        }

        function setAnimation(dino, dinoSVG) {
            const dir = [1, -1][Math.floor(Math.random() * 2)];
            const showHorn = (Math.random() * 10) > 5;
            const isGentleman = (Math.random() * 10) > 9;

            dino.querySelector('svg').style.transform = `scaleX(${dir})`;

            dinoSVG.style.animation = 'slowly-peeking 10s infinite';
            dinoSVG.style.animationDelay = (Math.random() * 5000) + 'ms';


            dinoSVG.querySelector('#DeadEyes').style.display = 'none';
            dinoSVG.querySelector('#Tongue').style.display = 'none';
            dinoSVG.querySelector('#AngryEyebrows').style.display = 'none';
            dinoSVG.querySelector('#TopHat').style.display = 'none';
            dinoSVG.querySelector('#Monocle').style.display = 'none';

            if (showHorn) {
                dinoSVG.querySelector('#Horn').style.display = 'block';
            } else {
                dinoSVG.querySelector('#Horn').style.display = 'none';
            }

            if (isGentleman) {
                dinoSVG.querySelector('#TopHat').style.display = 'block';
                dinoSVG.querySelector('#Monocle').style.display = 'block';
                dinoSVG.querySelector('#Horn').style.display = 'none';
            }
        }

        function canWhackDino(dino = document.querySelector("#55")) {
            dino.dinoA = dino.getBoundingClientRect();
            dino.holeA = dino.querySelector("ellipse#Hole").getBoundingClientRect();

            const matchA = dino.querySelector("g").getBoundingClientRect(); //The current location for the dino clickable
            const dinoA = dino.dinoA;
            const holeA = dino.holeA;
            const canWhack = (dinoA.top >= (matchA.top - holeA.height * 1.20));


            console.log(JSON.stringify({
                matchA: {
                    top: matchA.top,
                    bottom: matchA.bottom,
                    width: matchA.width,
                    height: matchA.height,
                    x: matchA.x,
                    y: matchA.y,
                }, dinoA: {
                    top: dinoA.top,
                    bottom: dinoA.bottom,
                    width: dinoA.width,
                    height: dinoA.height,
                    x: dinoA.x,
                    y: dinoA.y,
                }, holeA: {
                    top: holeA.top,
                    bottom: holeA.bottom,
                    width: holeA.width,
                    height: holeA.height,
                    x: holeA.x,
                    y: holeA.y,
                }, canWhack
            }));
            return canWhack;
        }

        for (let i = 0; i < max; i++) {
            let dino = dinoOriginal.cloneNode(true);
            let dinoSVG = dino.querySelector('#Dino');
            setAnimation(dino, dinoSVG);
            dino.addEventListener('animationiteration', function (ev) {
                animate(dino, dinoSVG);
            });
            function whack(ev) {
                const canWhack = canWhackDino(dino);
                if (isRunning) {

                    //If the dinosaur is out enough from the hole
                    //Wether we'll penalize the player for hitting too soon
                    const penalize = false;

                    if (!canWhack && !penalize) {
                        return;
                    }
                    let pointsEl = dino.querySelector('.points');

                    if (dinoSVG.querySelector('#Horn').style.display === 'none') {
                        score = score + 60;
                        dinoSVG.querySelector('#DeadEyes').style.display = 'block';
                        dinoSVG.querySelector('#Tongue').style.display = 'block';
                        dinoSVG.querySelector('#Eyes').style.display = 'none';

                        pointsEl.innerText = '60';
                        //If can't wack, penalize the player
                        //with -20 points
                    } else if (!canWhack) {
                        score = score - 20;

                        score = Math.max(0, score);
                        pointsEl.innerText = '-20';
                        pointsEl.classList.add('points--red');

                        shake();
                    }
                    else {
                        score = score - 20;
                        score = Math.max(0, score);
                        dinoSVG.querySelector('#AngryEyebrows').style.display = 'block';

                        pointsEl.innerText = '-20';
                        pointsEl.classList.add('points--red');

                        shake();
                    }

                    pointsEl.classList.add('fadeUp');
                    pointsEl.addEventListener('animationend', () => {
                        pointsEl.classList.remove('fadeUp');
                        pointsEl.classList.remove('points--red');
                    });

                    scoreEl.innerText = score;
                }
            }

            if (isTouch) {
                dinoSVG.addEventListener('touchend', whack);
            } else {
                dinoSVG.addEventListener('click', whack);
            }
            dinosFrag.appendChild(dino);
            dinos.push(dino);
            dinosSVGs.push(dinoSVG);
        }

        fieldEl.appendChild(dinosFrag);
        dinoOriginal.remove();
        //For web elements only
        //startEl.addEventListener('click', start);
        loadStoredScore();
    }

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

    /**
     * @description Loads and sets-up the display for the score
     */
    function loadStoredScore() {
        getStoredScore()
            .then((score) => {
                console.log({ score });
                highestScorelement.innerText = score;
            }).catch((err) => {
                console.log("Error retrieving the score", err);
            })
    }

    $(document).ready(function () {
        isTouch = document.querySelector('html').classList.contains('touch');
        try {
            init();
        } catch (e) {
            window.alert("Error initializing!");
            console.log({ e });
        }
    });

    let _isShowing = false;
    function showLatestScore(latestScore = 0) {
        if (_isShowing) return;
        _isShowing = true;
        getStoredScore()
            .then((storedScore) => {
                const _isNewHighScore = (score > storedScore);
                let _panelElement = document.querySelector('.final-score-show');
                if (!_panelElement.classList.contains('shown')) {
                    _panelElement.classList.add('shown');
                    _panelElement.querySelector('.score-number').innerHTML = latestScore;
                }
                if (_isNewHighScore) {
                    _panelElement.querySelector('.congrats-new-record').classList.add('shown');
                    return updateStoredScore(score);
                }
            })
            .then((result) => {
                console.log("Updated score? ", { result });
                return loadStoredScore();
            })
            .then(() => {
                console.log("Shown loaded score...");
            })
            .catch((err) => {
                console.log({ err });
                _isShowing = false;
            });
    }

    function hideLatestScore() {
        _isShowing = false;
        let _panelElement = document.querySelector('.final-score-show.shown');
        if (!_panelElement) return;
        _panelElement.classList.remove('shown');
        _panelElement.querySelector('.congrats-new-record').classList.remove('shown');
    }

    $(".final-score-show").click(function (event) {
        hideLatestScore();
    });

    $("#softkey > #center").click(function (event) {
        start();
    });

    document.addEventListener('keydown', function (evt) {
        if (evt.key === 'SoftLeft') {

        } else if (evt.key === 'SoftRight') {

        } else if (evt.key === 'Enter') {
            start();
        } else {
            /**3
:   2
1     3
    5
7      9
    8
             */
            let _dinoSVG = null;
            let _dinoMapping = {
                '1': 0,
                '2': 1,
                '3': 2,
                '5': 4,
                '7': 3,
                '9': 5,
                '8': 6
            };
            if (!isNaN(_dinoMapping[evt.key])) {
                _dinoSVG = dinosSVGs[_dinoMapping[evt.key]];
            }
            if (_dinoSVG) {
                //console.log({_dinoSVG});
                var event = document.createEvent("SVGEvents");
                event.initEvent("click", true, true);
                _dinoSVG.dispatchEvent(event);
            } else {
                console.log("Didn't map");
            }
        }
    })
});