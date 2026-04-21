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

    // Teachable Machine Logic (File Upload Version)
    const URL_MODEL = "https://teachablemachine.withgoogle.com/models/zuBj0AxO0/";
    let model, labelContainer, maxPredictions;

    async function loadModel() {
        const modelURL = URL_MODEL + "model.json";
        const metadataURL = URL_MODEL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = '';
        for (let i = 0; i < maxPredictions; i++) {
            const div = document.createElement("div");
            div.className = "prediction-bar";
            labelContainer.appendChild(div);
        }
    }

    async function predict() {
        const image = document.getElementById('face-image');
        const prediction = await model.predict(image);
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

    const imageUpload = document.getElementById('image-upload');
    const faceImage = document.getElementById('face-image');
    const previewContainer = document.getElementById('image-preview-container');

    imageUpload.addEventListener('change', async (e) => {
        if (!model) await loadModel();
        
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                faceImage.src = event.target.result;
                previewContainer.style.display = 'block';
                faceImage.onload = async () => {
                    await predict();
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Initial model load to speed up first interaction
    loadModel();
});
