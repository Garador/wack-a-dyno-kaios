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
    const originalTime = 60;
    let time = originalTime+0;
    let timer = null;
    let gameOverStatus = [{
        text: "Better luck next time!",
        imageId: "stunned-dino"
    }, {
        text: "Congratulations! New high score!",
        imageId: "winning-dino"
    }];

    function shake() {
        fieldEl.classList.add('shake');
        fieldEl.addEventListener('animationend', () => {
            fieldEl.classList.remove('shake');
        });
    }

    function setTimer() {
        //time = 60;
        timeEl.innerText = time;

        timer = setInterval(function () {
            time = time - 1;
            timeEl.innerText = time;

            if (time <= 0) {
                gameOver();
            }
        }, 1000);
    }

    function hideSoftKeys(){
        if(!document.getElementById('softkey').classList.contains('hide')){
            document.getElementById('softkey').classList.add('hide');
        }
        if(!document.getElementById('softkey').classList.contains('no-display')){
            document.getElementById('softkey').classList.add('no-display');
        }
    }

    function showSoftKeys(){
        if(document.getElementById('softkey').classList.contains('hide')){
            document.getElementById('softkey').classList.remove('hide');
        }
        if(document.getElementById('softkey').classList.contains('no-display')){
            document.getElementById('softkey').classList.remove('no-display');
        }
    }

    function start() {
        if (isRunning) return;
        time = originalTime+0;
        hideSoftKeys();
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
        showSoftKeys();
        getStoredScore()
            .then((oldScore) => {
                let _gameOverIndex = 1;
                if (oldScore < score) {
                    _gameOverIndex = 0;
                }
                document.querySelectorAll('result-dino').forEach((element) => {
                    element.classList.add('no-display');
                });
                document.getElementById(gameOverStatus[_gameOverIndex].imageId).classList.remove('no-display');
                console.log("gameOverStatus[_gameOverIndex].text: ", gameOverStatus[_gameOverIndex].text);
                document.querySelector('.congrats-new-record').innerHTML = gameOverStatus[_gameOverIndex].text;
                showLatestScore(score);
            })
            .catch((err) => {
                showLatestScore(score);
            });
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
            if (!dino.holeA) {
                dino.holeA = dino.querySelector("ellipse#Hole").getBoundingClientRect();
            }
            return (document.elementFromPoint(dino.holeA.x, dino.holeA.y - 30).id === 'Rectangle');
        }

        for (let i = 0; i < max; i++) {
            let dino = dinoOriginal.cloneNode(true);
            let dinoSVG = dino.querySelector('#Dino');
            setAnimation(dino, dinoSVG);
            dino.addEventListener('animationiteration', function (ev) {
                animate(dino, dinoSVG);
            });
            function whack(ev) {
                if (isRunning) {
                    const canWhack = canWhackDino(dino);
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
                    //_panelElement.querySelector('.congrats-new-record').classList.add('shown');
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
        setTimeout(()=>{
            if(!isRunning){
                window.location = "/";
            }
        }, 100);
    }

    $(".final-score-show").click(function (event) {
        hideLatestScore();
    });

    $("#softkey > #center").click(function (event) {
        start();
    });

    document.addEventListener('keydown', function (evt) {
        if (evt.key === 'Enter') {
            if(!isRunning){
                start();    
            }
        } else {
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
    });
    setTimeout(() => {
        start();
    }, 500);
});