let sound; // Переменная для звукового файла
let isInitialized = false; // Состояние инициализации
let isLoaded = false; // Состояние загрузки звука
let fft; // Объект FFT для анализа частот
let amplitude; // Объект Amplitude для получения уровня амплитуды
let cols = 100; // Увеличиваем количество столбцов до 100
let barColors = []; // Массив цветов столбцов
let amplitudes = []; // Массив амплитуд для рисования волн
let speedSlider; // Ползунок для изменения скорости воспроизведения
let angleSlider; // Ползунок для угла направления
let noiseStep = 0.01; // Шаг для шума
let progress = 0; // Прогресс для изменения положения шума

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

    // Инициализация цветов столбцов с разными оттенками красного
    for (let i = 0; i < cols; i++) {
        let redValue = map(i, 0, cols, 0, 255); // Генерация оттенка красного
        barColors[i] = color(redValue, 0, 0); // Устанавливаем цвет
    }

    // Инициализация массива амплитуд
    for (let i = 0; i < width; i++) {
        amplitudes.push(0);
    }

    // Создание ползунков
    speedSlider = createSlider(0.5, 2, 1, 0.1); // Ползунок скорости
    speedSlider.position(10, height + 10); // Позиция ползунка скорости
    let speedLabel = createDiv('Speed:');
    speedLabel.position(10, height + 30); // Позиция текста

    // Обработчик события для speedSlider
    speedSlider.input(() => {
        console.log('Speed changed to:', speedSlider.value());
    });


    angleSlider = createSlider(0, TWO_PI, Math.PI / 4, 0.01); // Ползунок для угла
    angleSlider.position(200, height + 10); // Позиция ползунка угла
    let angleLabel = createDiv('Stroke Angle (radians):');
    angleLabel.position(200, height + 30); // Позиция текста

      // Обработчик события для angleSlider
      angleSlider.input(() => {
        console.log('Angle changed to:', angleSlider.value());
    });

    // Создание кнопки Play/Pause
    playPauseButton = createButton('Play/Pause');
    playPauseButton.position(600, height + 10);
    playPauseButton.size(120, 40); 

    // Обработчик события для Play/Pause
    playPauseButton.mousePressed(togglePlayPause);
    
    // Обработчики для нажатия и наведения
    playPauseButton.mouseOver(() => {
        playPauseButton.style('background-color', 'lightgray');
    });
    playPauseButton.mouseOut(() => {
        playPauseButton.style('background-color', '');
    });
}

function togglePlayPause() {
    if (sound.isPlaying()) {
        sound.pause();
    } else {
        sound.play();
    }
}



function draw() {
    if (sound.isPlaying()) {
        sound.rate(speedSlider.value()); // Установка скорости воспроизведения
        
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
            let y = map(amplitudes[i], 0, 0.5, height / 2 - 100, 0); // Высота волн
            vertex(map(i, 0, amplitudes.length, 0, width), y);
        }
        endShape();

        // Рисуем треугольники
        drawTriangles(bassEnergy);

        // Рисуем линию шума
        noiseLine(bassEnergy);
        
    } else {
        background(0); // Задний фон черный, когда звук не играет
        fill(255);
       
    }
}

function drawTriangles(bassEnergy) {
    let triangleHeightBig = map(bassEnergy, 0, 255, 0, 200); // Высота больших треугольников
    
    fill(255, 182, 193); // Цвет для больших треугольников
    triangle(width / 3, height / 2 - triangleHeightBig / 2, width / 3 - 40, height / 2 + triangleHeightBig / 2, width / 3 + 40, height / 2 + triangleHeightBig / 2);
    triangle(2 * width / 3, height / 2 - triangleHeightBig / 2, 2 * width / 3 - 40, height / 2 + triangleHeightBig / 2, 2 * width / 3 + 40, height / 2 + triangleHeightBig / 2);

}

// Функция для рисования линии шума
function noiseLine(energy) {
    push();
    translate(width / 2, height / 2);
    let noiseScale = 0.01; // Масштаб для шума
    let lineLength = 300; // Длина линии

    noFill();
    stroke(250, 180, 190);
    strokeWeight(4);
    beginShape();
    for (let i = 0; i < 100; i++) {
        let x = map(noise(i * noiseStep + progress), 0, 1, -lineLength / 2, lineLength / 2);
        let y = map(noise(i * noiseStep + progress + 200), 0, 1, -lineLength / 2, lineLength / 2);
        vertex(x, y);
    }
    endShape();
    if (energy > 20) {
        progress += 0.05; // Увеличиваем прогресс для анимации
    }
    pop();
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



