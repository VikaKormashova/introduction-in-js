// Получаем кнопки
const colorButton1 = document.getElementById("colorButton1");
const colorButton2 = document.getElementById("colorButton2");
const colorButton3 = document.getElementById("colorButton3");
const colorButton4 = document.getElementById("colorButton4");
const randomButton = document.getElementById("randomButton");
const opacitySlider = document.getElementById("opacitySlider");

// Изначальные цвета
const initialColors = {
    box1: "#cccccc",
    box2: "#cccccc",
    box3: "#cccccc",
    box4: "#cccccc"
};

// Устанавливаем первоначальные цвета
function resetBoxes() {
    const boxes = document.querySelectorAll('.color-box');
    boxes.forEach((box, index) => {
        box.style.background = initialColors[`box${index + 1}`];
        box.textContent = "";
    });
}

// Добавляем обработчики событий для изменения цвета
colorButton1.addEventListener("click", function() {
    const box1 = document.getElementById("box1");
    box1.style.background = "#FFD700"; // Желтый цвет
    box1.textContent = "Солнечный желтый"; // Добавление текста
});

colorButton2.addEventListener("click", function() {
    const box2 = document.getElementById("box2");
    box2.style.background = "#1E90FF"; // Синий цвет
    box2.textContent = "Морской синий"; // Добавление текста
});

colorButton3.addEventListener("click", function() {
    const box3 = document.getElementById("box3");
    box3.style.background = "#32CD32"; // Зеленый цвет
    box3.textContent = "Травяной зеленый"; // Добавление текста
});

colorButton4.addEventListener("click", function() {
    const box4 = document.getElementById("box4");
    box4.style.background = "#FF69B4"; // Розовый цвет
    box4.textContent = "Коралловый розовый"; // Добавление текста
});

// Событие для случайных сообщений
const messages = [
    "Прикольно!",
    "Всем удачи на сессии))",
    "JavaScript — это весело!))",
];

randomButton.addEventListener("click", function() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    alert(messages[randomIndex]);
});

// Изменение прозрачности квадратов с помощью ползунка
opacitySlider.addEventListener("input", function() {
    const opacityValue = this.value;
    const boxes = document.querySelectorAll('.color-box');
    boxes.forEach(box => {
        const currentColor = box.style.backgroundColor;
        
        // Проверка, заполнен ли цветом
        if (currentColor !== "" && currentColor !== "rgb(204, 204, 204)") { // Проверяем, что квадрат цветной
            // Убираем белый цвет и добавляем прозрачность
            const rgb = currentColor.match(/\d+/g).map(Number); // Извлекаем RGB
            const transparentColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacityValue})`;
            box.style.backgroundColor = transparentColor; 
        }
    });
});
