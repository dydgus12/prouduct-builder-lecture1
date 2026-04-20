document.addEventListener('DOMContentLoaded', () => {
    const numbersContainer = document.getElementById('numbers');
    const generateButton = document.getElementById('generate');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateToggleText(savedTheme);

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

    function updateToggleText(theme) {
        themeToggle.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
    }

    generateButton.addEventListener('click', () => {
        const newNumbers = generateNumbers();
        displayNumbers(newNumbers);
    });

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleText(newTheme);
    });

    // Initial generation
    displayNumbers(generateNumbers());
});
