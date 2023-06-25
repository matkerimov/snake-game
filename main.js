let scoreBlock; // отабражение очков
let score = 0; // очки

const config = { // настройки игры
    step: 0,
    maxStep: 6,
    // для пропуска игрового цикла
    sizeCell: 16, // размер ячейки
    sizeBerry: 16 / 4 // размер ягоды
}

const snake = {
    x: 160,
    y: 160,
    // координаты
    dx: config.sizeCell,
    dy: 0,
    // скорость по вертикали и горизонтали
    tails: [], // массив ячеек под контролем змейки
    maxTails: 3 // колличество ячеек
}

let berry = { // координаты ягоды
    x: 0,
    y: 0
}

// игровой цикл

let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count");
drawScore(); // пустая f для рандомных значений у ягоды

let gameLoopId = null; // Идентификатор игрового цикла

// Добавляем обработчики для кнопок "Старт" и "Стоп"
const startButton = document.querySelector(".start-button");
const stopButton = document.querySelector(".stop-button");

startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", stopGame);

function startGame() {
    if (gameLoopId === null) {
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function stopGame() {
    if (gameLoopId !== null) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
}

function gameLoop() { //
    // f
    gameLoopId = requestAnimationFrame(gameLoop) // бесконечное вызвание gameLoop
    // Проверка если значение из config step меньше чем maxStep то пропускем дальнейшую работу функции
    if (++config.step < config.maxStep) {
        return; // Засчет этого условия мы можем контролировать скорость отрисовки на экране
    }
    config.step = 0;
    // Так же необходимо очищять каждый кадр canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // И заново отрисовывать все эелементы
    drawBerry(); // ягоду
    drawSnake(); // змейку
}

requestAnimationFrame(gameLoop);


function drawSnake() { // отображение змейки
    // Внутри меняем координаты согласно скорости
    snake.x += snake.dx;
    snake.y += snake.dy;

    collisionBorder();
    // unshift добавляет в начало массива объект с х и у координатами
    snake.tails.unshift({x: snake.x, y: snake.y})

    // если колличество дочеринх елементов у змейки больше чем разрешено то мы удаляем последний эелемент
    if (snake.tails.length > snake.maxTails) {
        snake.tails.pop();
    }

    snake.tails.forEach(function (el, index) { // методом forEach перебираем все дочерние элементы у змейки и отрисовываем их  // И проверяем их на соприкосновение друг с другом и с ягодкой
        if (index === 0) { // красим тело в ярко красный
            context.fillStyle = "#FA0556";
        } else {
            context.fillStyle = "#A00034"; // тело в тусклый
        }
        context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

        // проверяем координаты ягоды и змейки
        if (el.x === berry.x && el.y === berry.y) { // если они совпадают то
            snake.maxTails++; // увеличиваем хвост
            incScore(); // увеличиваем очки
            randomPositionBerry(); // и создаем новую ягоду
        }

        // Так же проверяем на соприкасновения змейки с хвостом
        for (let i = index + 1; i < snake.tails.length; i++) {
            // если координаты совпали то запускаем игру заново
            if (el.x === snake.tails[i].x && el.y === snake.tails[i].y) {
                refreshGame();

            }
        }
    })
}

function collisionBorder() {
    // проверка координат змейки
    // если они выходят за границы canvas то меняем координаты
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
}

// конец игры
function refreshGame() { // прописываем обновление всех значений
    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tails = [];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();


}


// Добавление ягоды
function drawBerry() {
    context.beginPath();
    context.fillStyle = "#A00034" // назначаем нужный цвет
    // рисуем окружность на основе коордирнат от ягоды
    context.arc(berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBerry, 0, 2 * Math.PI)
    context.fill()
}


// f для назначения координат от ягоды
function randomPositionBerry() {
    // в f рандома передаем 0 и колличество ячеек
    // колличество ячеек - получаем за счет деления ширины на размер ячейки
    // так же необходимо полученный результат умножить на на размер ячейки
berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
berry.y = getRandomInt(0, canvas.height  / config.sizeCell) * config.sizeCell;


}



// functions для обработки очков

function incScore() { // f увеличивает текущее значение на 1
    score++;
    drawScore();
}

function drawScore() { // f отображает текущее значение на странице
    scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) { // f принимает диапазон чисел и возвращяет рандомное значение в заданном диапазоне
    return Math.floor(Math.random() * (max - min) + min)

}

// -----

// f управление
document.addEventListener("keydown", function (e) {
    if (e.code === "KeyW" || e.key === "ArrowUp") {
        snake.dy = -config.sizeCell; // меняем значение движения с положительного на отрицательный и на оборот
        snake.dx = 0; // обнуляем движение в зависимости от клавиш которые нажали
    } else if (e.code === "KeyA" || e.key === "ArrowLeft") {
        snake.dx = -config.sizeCell;
        snake.dy = 0;
    } else if (e.code === "KeyS" || e.key === "ArrowDown") {
        snake.dy = config.sizeCell;
        snake.dx = 0;
    } else if (e.code === "KeyD" || e.key === "ArrowRight") {
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
});