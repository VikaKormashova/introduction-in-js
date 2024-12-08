let sound; // Переменная для звукового файла
let isInitialised = false; // Состояние инициализации
let isLoaded = false; // Состояние загрузки звука
let fft; // Объект FFT для анализа частот
let amplitude; // Объект Amplitude для получения уровня амплитуды
let cols = 100; // Увеличиваем количество столбцов до 100
let barColors = []; // Массив цветов столбцов
let amplitudes = []; // Массив амплитуд для рисования волн

function preload() {
    soundFormats('mp3', 'wav'); // Поддерживаемые форматы звука
    sound = loadSound('assets/Journey(chosic.com).mp3', () => {
        console.log("Sound is loaded!"); // Успешная загрузка звука
        isLoaded = true; // Устанавливаем флаг загрузки
    });
    sound.setVolume(0.2); // Установка громкости
}

function setup() {
    createCanvas(1024, 1024); // Создание канваса
    fft = new p5.FFT(); // Инициализация FFT
    amplitude = new p5.Amplitude(); // Инициализация амплитуды

    // Инициализируем цвета столбцов с разными оттенками красного
    for (let i = 0; i < cols; i++) {
        let redValue = map(i, 0, cols, 0, 255); // Генерация оттенка красного
        barColors[i] = color(redValue, 0, 0); // Устанавливаем цвет
    }

    // Инициализация массива амплитуд
    for (let i = 0; i < width; i++) {
        amplitudes.push(0);
    }
}


function draw() {
    if (sound.isPlaying()) {
        let bassEnergy = fft.getEnergy("bass"); // Получаем уровень энергии басовых частот
        let bgColor = map(bassEnergy, 0, 255, 0, 255);
        background(bgColor, 0, 0); // Устанавливаем цвет фона в зависимости от энергии

        fill(255); // Устанавливаем цвет текста
        textSize(32);
        textAlign(CENTER);
        

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

        // Визуализация волн
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift(); // Удаляем старые значения

        // Рисование волн
        stroke(255, 255, 255); // Белый цвет для волн
        strokeWeight(2);
        noFill();
        beginShape();
        for (let i = 0; i < amplitudes.length; i++) {
            let y = map(amplitudes[i], 0, 0.5, height / 2, 0);
            vertex(map(i, 0, amplitudes.length, 0, width), y);
        }
        endShape();

        // Рисуем треугольники в центре холста
        let triangleHeightBig = map(bassEnergy, 0, 255, 0, 200); // Высота больших треугольников
        let triangleHeightSmall = map(bassEnergy, 0, 255, 0, 100); // Высота малого треугольника

        fill(255, 182, 193); // Цвет для больших треугольников
        triangle(width / 3, height / 2 - triangleHeightBig / 2, width / 3 - 40, height / 2 + triangleHeightBig / 2, width / 3 + 40, height / 2 + triangleHeightBig / 2);
        triangle(2 * width / 3, height / 2 - triangleHeightBig / 2, 2 * width / 3 - 40, height / 2 + triangleHeightBig / 2, 2 * width / 3 + 40, height / 2 + triangleHeightBig / 2);
        
        fill(255, 182, 193); // Цвет для маленького треугольника
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
    if (isLoaded) {
        if (sound.isPlaying()) {
            sound.pause(); // Пауза, если звук играет
        } else {
            sound.loop(); // Продолжить воспроизведение, если звук не играет
        }
    }
}

