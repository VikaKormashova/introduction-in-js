document.getElementById('loadCSV').addEventListener('click', () => {
    const dataContainer = document.getElementById('dataContainer');
    const loadCSVButton = document.getElementById('loadCSV');

    if (dataContainer.style.display === "none") {
        loadCSV(); 
        loadCSVButton.textContent = "Скрыть таблицу"; 
    } else {
        hideBars(); 
        loadCSVButton.textContent = "Загрузить CSV"; 
    }
});

const loadCSV = () => {
    fetch('students.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Сетевой ответ не в порядке');
            }
            return response.text();
        })
        .then(data => {
            const parsedData = parseCSV(data);
            addBars(parsedData);
        })
        .catch(error => {
            console.error('Ошибка при загрузке CSV:', error);
        });
};

const parseCSV = (data) => {
    return data.split('\n').map(row => row.split(','));
};

const addBars = (data) => { 
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerHTML = ''; 
    dataContainer.style.display = "block"; 

    const header = data[0];
    const body = data.slice(1);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'header';
    header.forEach(col => {
        const div = document.createElement('div');
        div.className = 'cell';
        div.textContent = col;
        headerDiv.appendChild(div);
    });
    dataContainer.appendChild(headerDiv);

    body.forEach(row => {
        if (row.length > 1) { 
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            row.forEach(cell => {
                const div = document.createElement('div');
                div.className = 'cell';
                div.textContent = cell;
                rowDiv.appendChild(div);
            });
            dataContainer.appendChild(rowDiv);
        }
    });
};

const hideBars = () => { 
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.style.display = "none"; 
};