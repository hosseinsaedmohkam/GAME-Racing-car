

const score = document.querySelector('.score');
const startscreen = document.querySelector('.startscreen');
const gameArea = document.getElementById('gameArea');
const audio = document.getElementById('myAudio')

let player = {
    speed: 6,
    score: 0

};

let keys = {
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false
}

startscreen.addEventListener('click', start);
document.addEventListener('keydown', pressOn);
document.addEventListener('keyup', pressOf);
/* ///////////// حرکت خطوط (خط‌های جاده) ////////////*/
function moveLines() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function (item) {
        if (item.y >= 1500) {
            item.y -= 1500;
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    })

}
////////////////////  برخورد و تصادف خودرو ها باهم////////////////////////////
function isCollied(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right) ||
        audio.pause()
    )

}

/*/////////// حرکت دشمن‌ها ////////////// */
function moveEnemy(car) {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(function (item) {
        if (isCollied(car, item)) {
            endGame();

        }
        if (item.y >= 1500) {
            item.y = -500;
            item.style.left = Math.floor(Math.random() * 250) + 'px';
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    })

}



/////////////محل و حرکت خودرو ها  و جاده/ و تعریف کلید های بازی/////////

function playGame() {

    let car = document.querySelector('.car');
    const road = gameArea.getBoundingClientRect();
    moveLines();
    moveEnemy(car);


    ////////حرکت خودرو بر حسب کلیدها////////////////
    if (player.start) {
        if (keys.ArrowUp && player.y > road.top + 10) { player.y -= player.speed; }
        if (keys.ArrowDown && player.y < (road.bottom - 110)) { player.y += player.speed; }
        if (keys.ArrowRight && player.x < (road.width - 75)) { player.x += player.speed; }
        if (keys.ArrowLeft && player.x > 6) { player.x -= player.speed; }

        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';
        window.requestAnimationFrame(playGame);
        //////////////امتیاز////////////
        player.score++;
        score.innerText = 'score : ' + player.score;
    }
}
/* ////////// مدیریت کلیدها ///////////// */
function pressOn(e) {
    e.preventDefault();
    keys[e.key] = true;
    // console.log('on', e.key);
}

function pressOf(e) {
    e.preventDefault();
    keys[e.key] = false;
    // console.log('off', e.key);
}
/////////////////پایان بازی ////////////////////////////

function endGame() {
    player.start = false
    score.innerHTML = 'Game over<br> your score was : ' + player.score;
    startscreen.classList.remove('hide');
}


//////////////اجزای مختلف بازی در هنگام شروع بازی////////////
function start() {
    if (audio) {
        audio.play();
        audio.loop = true;
    }

    startscreen.classList.add('hide');
    // gameArea.classList.remove('hide');


    gameArea.innerHTML = '';
    player.start = true;
    player.score = 0;
    window.requestAnimationFrame(playGame);

    ////////////////////خطوط جاده////////////////
    for (let x = 0; x < 12; x++) {
        let div = document.createElement('div');
        div.classList.add('line');
        div.y = x * 150;
        div.style.top = (x * 150) + 'px'
        gameArea.appendChild(div)
    }
    /////////ماشین بازیکن///////////////////
    let car = document.createElement('div');
    // car.innerText = 'car';
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);


    player.x = car.offsetLeft
    player.y = car.offsetTop

    ///////////////خودرو های مقابل(دشمن)////////////
    for (let x = 0; x < 5; x++) {
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = ((x + 1) * 600) * -1;
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.floor(Math.random() * 250) + 'px';

        gameArea.appendChild(enemy);
    }


}




