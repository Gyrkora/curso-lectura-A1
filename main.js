import { Flipbook } from './flipbook.js';
import { toggleFullscreen, setupModalClose } from './scripts/functions.js';
import { adjustFontSize, toggleDarkMode } from './scripts/accesibility.js';

document.addEventListener("DOMContentLoaded", async function () {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const book = pathSegments[1];
    const chapter = pathSegments[2];

    if (!book || !chapter) {
        console.error("Invalid book or chapter path");
        return;
    }

    try {
        // 1. Fetch the updated configuration (now including pagesCount and bgPages)
        const configResponse = await fetch('/curso-lectura-A1/config.json');
        if (!configResponse.ok) {
            throw new Error("Failed to load configuration file.");
        }
        const config = await configResponse.json();

        // 2. Pull out both pagesCount and bgPages for this chapter
        const chapterConfig = config[book]?.[chapter];
        if (!chapterConfig) {
            throw new Error(`No config found for ${book}/${chapter}`);
        }
        const pagesCount = chapterConfig.pagesCount;
        const bgPages = chapterConfig.bgPages || [];

        // 3. Build paths
        const basePath = `${window.location.origin}/curso-lectura-A1/${book}/${chapter}/pages`;
        const vocabularyPath = `${window.location.origin}/curso-lectura-A1/api/vocabulary.json`;

        // 4. Instantiate Flipbook, passing in bgPages array
        const flipbook = new Flipbook(
            '#flipbook',
            '#progress-bar',
            '#page-counter',
            vocabularyPath,
            bgPages
        );

        // 5. Initialize with basePath and pagesCount
        flipbook.initialize(basePath, pagesCount);

        // Accessibility & Controls (unchanged)
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const fullscreenContainer = document.getElementById('fullscreen-container');
        const iframeElement = document.getElementById('myIframe');
        const toggleButton = document.getElementById('toggle-accessibility-btn');
        const controls = document.getElementById('accessibility-controls');

        document.getElementById('increase-font-btn').addEventListener('click', () => {
            flipbook.adjustFontSize(true);
        });
        document.getElementById('decrease-font-btn').addEventListener('click', () => {
            flipbook.adjustFontSize(false);
        });

        controls.classList.add('hidden');
        toggleButton.addEventListener('click', () => {
            controls.classList.toggle('hidden');
        });

        fullscreenBtn.addEventListener('click', () =>
            toggleFullscreen(fullscreenBtn, fullscreenContainer, iframeElement)
        );

        document.getElementById('dark-mode-btn').addEventListener('click', toggleDarkMode);

        const modalCloseButton = document.getElementById('close-modal');
        setupModalClose(modalCloseButton);
    } catch (error) {
        console.error("Error initializing Flipbook:", error);
    }
});


