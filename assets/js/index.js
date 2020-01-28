$(document).ready(function () {
    let buttonIndex = 1;
    let startButton = document.getElementById('startButton');
    let helpButton = document.getElementById('helpButton');
    let scoreItem = document.getElementById('score-number');

    function pushButton(){
        switch(buttonIndex){
            case 1:
                //start
                window.location = "./game.html"
            break;
            case 0:
                //help
                window.location = "./help.html"
            break;
        }
    }

    function selectButton(buttonIndex=1){
        switch(buttonIndex){
            case 1:
                if(helpButton.classList.contains('focused')){
                    helpButton.classList.remove('focused');
                }
                startButton.classList.add('focused');
            break;
            case 0:
                    if(startButton.classList.contains('focused')){
                        startButton.classList.remove('focused');
                    }
                    helpButton.classList.add('focused');
            break;
        }
    }

    document.addEventListener('keydown', function (evt) {
        if (evt.key === 'ArrowUp') {
            if(buttonIndex==0){
                buttonIndex++;
            }else{
                buttonIndex = 0;
            }
            selectButton(buttonIndex);
        } else if (evt.key === 'ArrowDown') {
            if(buttonIndex==1){
                buttonIndex--;
            }else{
                buttonIndex = 1;
            }
            selectButton(buttonIndex);
        } else if (evt.key === 'Enter') {
            pushButton();
        } else if(evt.key === 'SoftRight'){
            window.close();
        }
    })

    function setScore(score){
        scoreItem.innerHTML = score;
    }

    function loadTheScore(){
        getStoredScore()
        .then((data)=>{
            setScore(data);
        })
        .catch((err)=>{
            console.log({err});
        })
    }
    selectButton();
    loadTheScore();
});