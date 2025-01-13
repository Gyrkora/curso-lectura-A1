// accessibility.js

export let currentFontSize = 16;
export let isDarkMode = false;


export function adjustFontSize(increase = true) {
    const pages = document.querySelectorAll('.page');

    // Adjust font size
    currentFontSize += increase ? 2 : -2;
    currentFontSize = Math.max(12, Math.min(currentFontSize, 32));
    pages.forEach(page => {
        const paragraphs = page.querySelectorAll('p'); // Target <p> elements
        paragraphs.forEach(paragraph => {
            paragraph.style.fontSize = `${currentFontSize}px`; // Set font size
            paragraph.style.lineHeight = `${currentFontSize * 1.5}px`; // Adjust line height proportionally
        });
    });
}

export function toggleDarkMode() {
    const body = document.body;
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        body.classList.add('dark-mode');

    } else {
        body.classList.remove('dark-mode');
    }
}
