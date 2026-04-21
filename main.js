document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateToggleText(savedTheme);

    function updateToggleText(theme) {
        themeToggle.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleText(newTheme);
    });

    // Lotto Logic
    const numbersContainer = document.getElementById('numbers');
    const generateButton = document.getElementById('generate');

    function generateNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function displayNumbers(numbers) {
        numbersContainer.innerHTML = '';
        numbers.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.className = 'number';
            numberElement.textContent = number;
            numbersContainer.appendChild(numberElement);
        });
    }

    generateButton.addEventListener('click', () => {
        displayNumbers(generateNumbers());
    });
    displayNumbers(generateNumbers());

    // Teachable Machine Logic
    const URL = "https://teachablemachine.withgoogle.com/models/zuBj0AxO0/";
    let model, webcam, labelContainer, maxPredictions;

    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(200, 200, flip);
        await webcam.setup();
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            const div = document.createElement("div");
            div.className = "prediction-bar";
            labelContainer.appendChild(div);
        }
    }

    async function loop() {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const className = prediction[i].className;
            const probability = (prediction[i].probability * 100).toFixed(0);
            
            labelContainer.childNodes[i].innerHTML = `
                <div class="label-wrapper">
                    <span>${className}</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${probability}%"></div>
                    </div>
                    <span>${probability}%</span>
                </div>
            `;
        }
    }

    const startButton = document.getElementById('start-test');
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        init();
    });
});
