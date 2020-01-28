$(document).ready(function () {
    let buttonIndex = 1;
    let startButton = document.getElementById('startButton');

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
                startButton.classList.add('focused');
            break;
        }
    }

    document.addEventListener('keydown', function (evt) {
        if (evt.key === 'Enter') {
            pushButton();
        } else if(evt.key === 'SoftRight'){
            window.close();
        }
    })
    selectButton();
});