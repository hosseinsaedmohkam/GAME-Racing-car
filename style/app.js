const score = document.querySelector('.score');
const startscreen = document.querySelector('.startscreen');
const gameArea = document.getElementById('gameArea');
const audio = document.getElementById('myAudio');

let player = {
    speed: 6,
    score: 0
};

let keys = {
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false
};

startscreen.addEventListener('click', start);
document.addEventListener('keydown', pressOn);
document.addEventListener('keyup', pressOf);

/* ===== حرکت خطوط جاده ===== */
function moveLines() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(item => {
        if (item.y >= 1500) {
            item.y -= 1500;
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

/* ===== برخورد ماشین‌ها ===== */
function isCollied(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right) ||
        audio.pause()
    );
}

/* ===== حرکت دشمن‌ها ===== */
function moveEnemy(car) {
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach(item => {
        if (isCollied(car, item)) {
            endGame();
        }
        if (item.y >= 1500) {
            item.y = -500;
            item.style.left = Math.floor(Math.random() * (window.innerWidth <= 480 ? 200 : 250)) + 'px';
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

/* ===== اجرای بازی ===== */
function playGame() {
    let car = document.querySelector('.car');
    const road = gameArea.getBoundingClientRect();
    moveLines();
    moveEnemy(car);

    if (player.start) {
        if (keys.ArrowUp && player.y > road.top + 10) { player.y -= player.speed; }
        if (keys.ArrowDown && player.y < (road.bottom - 110)) { player.y += player.speed; }
        if (keys.ArrowRight && player.x < (road.width - 75)) { player.x += player.speed; }
        if (keys.ArrowLeft && player.x > 6) { player.x -= player.speed; }

        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';

        window.requestAnimationFrame(playGame);

        player.score++;
        score.innerText = 'score : ' + player.score;
    }
}

/* ===== مدیریت کلیدها ===== */
function pressOn(e) { e.preventDefault(); keys[e.key] = true; }
function pressOf(e) { e.preventDefault(); keys[e.key] = false; }

/* ===== پایان بازی ===== */
function endGame() {
    player.start = false;
    score.innerHTML = 'Game over<br> your score was : ' + player.score;
    startscreen.classList.remove('hide');
}

/* ===== شروع بازی ===== */
function start() {
    if (audio) { audio.play(); audio.loop = true; }
    startscreen.classList.add('hide');
    gameArea.innerHTML = '';
    player.start = true;
    player.score = 0;
    window.requestAnimationFrame(playGame);

    const lineSpacing = 150;  

    let lineOffset = 195;   //// ستون اول
    let lineGap = 180;      ///// فاصله ستون دوم

    //////// بررسی موبایل
    const isMobile = window.innerWidth <= 480;
    if (isMobile) {
        lineOffset = gameArea.offsetWidth / 2 - 5; // ستون وسط
    }

    ///////// ایجاد خطوط
    for (let x = 0; x < 12; x++) {
        ///////// ستون اول
        let line1 = document.createElement('div');
        line1.classList.add('line');
        line1.y = x * lineSpacing;
        line1.style.top = (x * lineSpacing) + 'px';
        line1.style.left = lineOffset + 'px';
        gameArea.appendChild(line1);

        ///////// ستون دوم فقط روی دسکتاپ
        if (!isMobile) {
            let line2 = document.createElement('div');
            line2.classList.add('line');
            line2.y = x * lineSpacing;
            line2.style.top = (x * lineSpacing) + 'px';
            line2.style.left = (lineOffset + lineGap) + 'px';
            gameArea.appendChild(line2);
        }
    }

    /////////// ماشین بازیکن
    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);
    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    ///////// ماشین‌های دشمن/
    for (let x = 0; x < 5; x++) {
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = ((x + 1) * 600) * -1;
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.floor(Math.random() * (isMobile ? 200 : 250)) + 'px';
        gameArea.appendChild(enemy);
    }
}
