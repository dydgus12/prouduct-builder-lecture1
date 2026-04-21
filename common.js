document.addEventListener('DOMContentLoaded', () => {
    // 테마 토글 로직 (공통)
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggle) {
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
    }
});
