const field = document.querySelector('.game-field');
const gameBtn = document.querySelector('.game-button');
const game_score = document.querySelector('.game-score');
const game_timer = document.querySelector('.game-timer');

const fieldRect = field.getBoundingClientRect();
const carrot_size = 80;
const carrot_count = 20;
const bug_count = 20;
const game_duration_sec = 20;
const popUp = document.querySelector('.pop-up')
const popUpMessage = document.querySelector('.pop-up-message')
const popUpRedo = document.querySelector('.pop-up-redo')

const carrotSound = new Audio('../sound/carrot_pull.mp3')
const bugSound = new Audio('../sound/bug_pull.mp3')
const bgSound = new Audio('../sound/bg.mp3')
const alertSound = new Audio('../sound/alert.wav')
const winSound = new Audio('../sound/game_win.mp3')


let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick)

gameBtn.addEventListener('click', () => {
    if(started) {
        stopGame();
    }
    else {
        startGame();
    }
})

popUpRedo.addEventListener('click', () => {
    score = 0;
    startGame();
    hidePopUp();
})

function startGame() {
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(alertSound);
    playSound(bgSound);
}

function stopGame(){
    started = false;
    stopGameTimer();
    hideStartButton();
    showPopUpWithText('Try Again?');
    stopSound(bgSound);
}

function finishGame(win) {
    started = false;
    if(win) {
        playSound(winSound);
    }
    else {
        playSound(bugSound);
    }
    stopGameTimer();
    stopSound(bgSound);
    hideStartButton();
    showPopUpWithText(win? 'YOU WON' : 'YOU LOST');
}



function showStopButton() {
    const icon = gameBtn.querySelector('.fas')
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility = 'visible'
}

function hideStartButton() {
    gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
    game_timer.style.visibility = 'visible';
    game_score.style.visibility = 'visible';
}

function startGameTimer() {
    let remainingTimeSec = game_duration_sec;
    updateTimerText(remainingTimeSec);

    timer = setInterval(() => {
        if(remainingTimeSec <= 0) {
            clearInterval(timer);
            finishGame(carrot_count === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000)
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    game_timer.innerText = `${minutes}:${seconds}`;
}

function showPopUpWithText(text) {
    popUpMessage.innerText = text;
    popUp.classList.remove('pop-up-hide')
}

function hidePopUp() {
    popUp.classList.add('pop-up-hide');
}


function initGame() {
    field.innerHTML = '';
    game_score.innerText = carrot_count;
    addItem('carrot', carrot_count, '../img/carrot.png')
    addItem('bug', bug_count, '../img/bug.png')
}

function onFieldClick(event) {
    if(!started) {
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')) {
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score === carrot_count) {
            finishGame(true);
        }
    }
    else if(target.matches('.bug')) {
        finishGame(false);
    }
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound){
    sound.pause();
}

function updateScoreBoard() {
    game_score.innerText = carrot_count - score;
}

function addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - carrot_size;
    const y2 = fieldRect.height - carrot_size;
    for (let i = 0; i < count; i++) {
        const item = document.createElement('img')
        item.setAttribute('class', className)
        item.setAttribute('src', imgPath)
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}