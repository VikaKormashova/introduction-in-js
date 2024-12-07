let sound; // Переменная для звукового файла
let isInitialised = false; // Состояние инициализации
let isLoaded = false; // Состояние загрузки звука
let fft; // Объект FFT для анализа частот
let cols = 10; // Увеличиваем количество столбцов до 10
let barColors = []; // Массив цветов столбцов

function preload() {
    soundFormats('mp3', 'wav'); // Поддерживаемые форматы звука
    sound = loadSound('assets/segway_loop.mp3', () => {
        console.log("Sound is loaded!"); // Успешная загрузка звука
        isLoaded = true; // Устанавливаем флаг загрузки
    });
    sound.setVolume(0.2); // Установка громкости
}

function setup() {
    createCanvas(1024, 1024); // Создание канваса
    fft = new p5.FFT(); // Инициализация FFT

    // Инициализируем цвета столбцов
    for (let i = 0; i < cols; i++) {
        barColors[i] = color(255, 0, 0); // Изначально красные
    }
}

function draw() {
    if (sound.isPlaying()) {
        // Получаем уровень энергии басовых частот
        let bassEnergy = fft.getEnergy("bass");
        // Масштабируем цвет фона в зависимости от уровня энергии
        let bgColor = map(bassEnergy, 0, 255, 0, 255);
        
        // Устанавливаем цвет фона в зависимости от энергии
        background(bgColor, 0, 0); // Меняем цвет фона (оттенок красного)

        fill(255); // Устанавливаем цвет текста
        textSize(32);
        textAlign(CENTER);
        text("Press on any bar!", width / 2, 40); // Текст для нажатия на столбцы

        let freqs = fft.analyze(); // Анализ частот
        let barWidth = width / cols; // Ширина столбцов

        // Визуализация столбцов
        for (let i = 0; i < cols; i++) {
            let avg = 0; // Средняя амплитуда
            let count = 0; // Счетчик

            for (let j = i * Math.floor(freqs.length / cols); j < (i + 1) * Math.floor(freqs.length / cols); j++) {
                if (j < freqs.length) {
                    avg += freqs[j]; // Суммируем амплитуды
                    count++; // Увеличиваем счетчик
                }
            }

            if (count > 0) {
                avg /= count; // Находим среднее значение
                let h = map(avg, 0, 255, 0, height); // Масштабируем высоту столбца
                let currentColor = barColors[i]; // Получаем текущий цвет столбца

                fill(currentColor); // Задаем цвет столбца
                rect(i * barWidth, height - h, barWidth - 2, h); // Рисуем столбец
            }
        }

        // Рисуем треугольники в центре холста
        let triangleHeightBig = map(bassEnergy, 0, 255, 0, 200); // Высота больших треугольников
        let triangleHeightSmall = map(bassEnergy, 0, 255, 0, 100); // Высота малого треугольника

        // Устанавливаем цвет  розового
        fill(255, 182, 193); // Цвет для больших треугольников (неяркий розовый)
        
        // Левый большой треугольник
        triangle(width / 3, height / 2 - triangleHeightBig / 2, width / 3 - 40, height / 2 + triangleHeightBig / 2, width / 3 + 40, height / 2 + triangleHeightBig / 2);
        
        // Правый большой треугольник
        triangle(2 * width / 3, height / 2 - triangleHeightBig / 2, 2 * width / 3 - 40, height / 2 + triangleHeightBig / 2, 2 * width / 3 + 40, height / 2 + triangleHeightBig / 2);
        
        fill(255, 182, 193); // Цвет для маленького треугольника (неяркий розовый)
        // Маленький треугольник посередине
        triangle(width / 2, height / 2 - triangleHeightSmall / 2, width / 2 - 20, height / 2 + triangleHeightSmall / 2, width / 2 + 20, height / 2 + triangleHeightSmall / 2);
    } else {
        background(0); // Задний фон черный, когда звук не играет
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text("Press any key to play sound", width / 2, height / 2); // Текст для запуска звука
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true; // Установка флага инициализации
        if (isLoaded) {
            sound.loop(); // Запуск звука
        }
    } else {
        if (key === ' ') {
            if (sound.isPaused()) {
                sound.play(); // Продолжить проигрывание
            } else {
                sound.pause(); // Пауза
            }
        }
    }
}

function mousePressed() {
    let barWidth = width / cols; // Ширина столбцов
    let index = Math.floor(mouseX / barWidth); // Определяем индекс столбца по координате мыши

    if (index >= 0 && index < cols) {
        if (mouseButton === LEFT) {
            // Меняем цвет столбца при нажатии левой кнопки мыши
            barColors[index] = color(random(255), 0, 0); // Устанавливаем случайный оттенок красного
        } else if (mouseButton === RIGHT) {
            // Меняем цвет столбца при нажатии правой кнопки мыши
            barColors[index] = color(0, random(255), 0); // Устанавливаем случайный оттенок зеленого
        }
    }
}
