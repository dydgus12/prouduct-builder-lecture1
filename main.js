document.addEventListener('DOMContentLoaded', () => {
    // 로또 로직
    const numbersContainer = document.getElementById('numbers');
    const generateButton = document.getElementById('generate');

    if (numbersContainer && generateButton) {
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
    }
});
