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
        if(isRunning) return;
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
        function animate(dino, dinoSVG){
            //We choose a random direction
            let dir = [1, -1][Math.floor(Math.random() * 2)];
            //We randomly choose to show the horn or not
            let showHorn = (Math.random() * 10) > 5;
            //We randomly choose if it's a gentleman or nor
            let isGentleman = (Math.random() * 10) > 9;

            //We set the transform style to scaleX
            dino.querySelector('svg').style.transform = `scaleX(${dir})`;

            //We set the style animation for the template
            dinoSVG.style.animation = 'slowly-peeking 10s infinite';
            
            //We set a random animation delay between 0 and 5 seconds
            dinoSVG.style.animationDelay = (Math.random() * 5000) + 'ms';


            dinoSVG.querySelector('#DeadEyes').style.display = 'none';      //We hide the eyes
            dinoSVG.querySelector('#Tongue').style.display = 'none';        //We hide the tongue
            dinoSVG.querySelector('#AngryEyebrows').style.display = 'none'; //We hide the eyebrowns
            dinoSVG.querySelector('#TopHat').style.display = 'none';        //We hide the tophat
            dinoSVG.querySelector('#Monocle').style.display = 'none';       //We hide the monocle

            if (showHorn) {
                dinoSVG.querySelector('#Horn').style.display = 'block';     //If should show horn, display it
            } else {
                dinoSVG.querySelector('#Horn').style.display = 'none';      //Else, hide it
            }

            if (isGentleman) {                                              //If it's a gentleman
                dinoSVG.querySelector('#TopHat').style.display = 'block';   //+We show the top-hat
                dinoSVG.querySelector('#Monocle').style.display = 'block';  //+We show the monocle
                dinoSVG.querySelector('#Horn').style.display = 'none';      //+We show the horn
            }
        }

        let TRs = [document.querySelector('#field-placeholder-tr')];
        TRs = [];
        let currentTrIndex = 0;
        let originalTrPLaceholder = document.querySelector('#field-placeholder-tr');
        for (let i = 0; i < max; i++) {
            if(i % 3 == 0){
                TRs.push(originalTrPLaceholder.cloneNode());
                currentTrIndex = (i/3);
            }
            
            //We clone the original TD
            let dino = dinoOriginal.cloneNode(true);
            //We get the SVG inside the cloned TD
            let dinoSVG = dino.querySelector('#Dino');
            
            animate(dino, dinoSVG); //We animate initially
            
            dino.addEventListener('animationiteration', function (ev) {
                animate(dino, dinoSVG); //Everytime the animation loops to start, we animate again
            });

            //Whack the dino
            function whack(ev) {

                if(!dino.dinoA){    //The bounding box area for the dino
                    dino.dinoA = dino.getBoundingClientRect();
                }
                if(!dino.holeA){    //The area for the gole
                    dino.holeA = dino.querySelector("ellipse#Hole").getBoundingClientRect();
                }
                const matchA = dino.querySelector("g").getBoundingClientRect(); //The current location for the dino clickable
                const dinoA = dino.dinoA;
                const holeA = dino.holeA;

                //If the dinosaur is out enough from the hole
                const canWhack = (dinoA.top >= (matchA.top - holeA.height*1.20));

                if (isRunning) {
                    //Wether we'll penalize the player for hitting too soon
                    const penalize = false;

                    if(!canWhack && !penalize){ //If can't wack and can't penalize
                        return;
                    }
                    let pointsEl = dino.querySelector('.points');   //We select the point element inside the dino

                    if (dinoSVG.querySelector('#Horn').style.display === 'none') {  //If the horn is hidden
                        score = score + 60;                                         //+augment the score to +30
                        dinoSVG.querySelector('#DeadEyes').style.display = 'block'; //+Show dead eyes
                        dinoSVG.querySelector('#Tongue').style.display = 'block';   //+Show tonge
                        dinoSVG.querySelector('#Eyes').style.display = 'none';      //+hide eyes

                        pointsEl.innerText = '60';                                  //+Set the points inner text with 60
                    } else if(!canWhack){                                           //If we can't penalize the player
                        score = score - 20;                                         //Reduce score by 20

                        score = Math.max(0, score);                                 //Set the max. score
                        pointsEl.innerText = '-20';                                 //Set the score text
                        pointsEl.classList.add('points--red');                      //Set the points to red

                        shake();
                    }
                    else{                                                                   
                        score = score - 20;                                             //Reduce score by 20
                        score = Math.max(0, score);                                     //Set the max. score
                        dinoSVG.querySelector('#AngryEyebrows').style.display = 'block';//Show angry eyes
                        pointsEl.innerText = '-20';                                     //Set the score text
                        pointsEl.classList.add('points--red');                          //Set the points to red

                        shake();                                                        //Shake
                    }

                    pointsEl.classList.add('fadeUp');                                   //Fade the element
                    pointsEl.addEventListener('animationend', () => {                   //When animation fadeUp has ended
                        pointsEl.classList.remove('fadeUp');                            //Remove class fadeUp
                        pointsEl.classList.remove('points--red');                       //Remove red text, if any
                    });

                    scoreEl.innerText = score;                                          //Set the inner text score to the new score
                }
            }
            
            if (isTouch) {                                                              //If device is touch
                dinoSVG.addEventListener('touchend', whack);                            //+Set the touch-end event to whack
            } else {                                                                    //Else
                dinoSVG.addEventListener('click', whack);                               //+Set the click event to whack
            }
            TRs[currentTrIndex].appendChild(dino);
            //dinosFrag.appendChild(dino);                                                //We append the dino to the dinosFrag
            dinos.push(dino);                                                           //We push the dinos into the dino array
            dinosSVGs.push(dinoSVG);                                                    //We push the dino SVG into the dino SVG array
        }

        for(let element of TRs){
            fieldEl.parentNode.appendChild(element);
        }
        //fieldEl.appendChild(dinosFrag);                                                 //We attach the fragment to the field element
        dinoOriginal.parentNode.remove();                                                          //We remove the dino-original fragment
        loadStoredScore();                                                           //We load the score
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

    $(document).ready(function(){
        isTouch = document.querySelector('html').classList.contains('touch');
        try{
            init();
        }catch(e){
            window.alert("Error initializing!");
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

    document.addEventListener('keydown', function(evt){
        if(evt.key === 'SoftLeft'){
    
        }else if(evt.key === 'SoftRight'){
    
        }else if(evt.key === 'Enter'){
            start();
        }else{
            //window.alert(`Entered a new key! ${evt.key}`);
            /**3
:   2
1     3
    5
7      9
    8
             */
            let _dinoSVG = null;
            let _dinoMapping = {
                '1':0,
                '2':1,
                '3':2,
                '5':4,
                '7':3,
                '9':5,
                '8':6
            };
            if(!isNaN(_dinoMapping[evt.key])){
                _dinoSVG = dinosSVGs[_dinoMapping[evt.key]];
            }
            if(_dinoSVG){
                //console.log({_dinoSVG});
                var event = document.createEvent("SVGEvents");
                event.initEvent("click",true,true);
                _dinoSVG.dispatchEvent(event);
            }else{
                console.log("Didn't map");
            }
        }
    })
});