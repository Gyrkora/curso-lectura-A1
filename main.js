import { Flipbook } from './flipbook.js';
import { toggleFullscreen, setupModalClose } from './scripts/functions.js';
import { adjustFontSize, toggleDarkMode } from './scripts/accesibility.js';

document.addEventListener('DOMContentLoaded', async () => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const book = pathSegments[1];
    const chapter = pathSegments[2];

    if (!book || !chapter) {
        console.error('Invalid book or chapter path');
        return;
    }

    try {
        // Fetch updated configuration including pagesCount and bgImages
        const configResponse = await fetch('/curso-lectura-A1/config.json');
        if (!configResponse.ok) {
            throw new Error('Failed to load configuration file.');
        }
        const config = await configResponse.json();

        // Extract pagesCount and bgImages for this chapter
        const chapterConfig = config[book]?.[chapter];
        if (!chapterConfig) {
            throw new Error(`No config found for ${book}/${chapter}`);
        }
        const pagesCount = chapterConfig.pagesCount;
        const bgImages = chapterConfig.bgImages || {};

        // Build resource paths
        const basePath = `${window.location.origin}/curso-lectura-A1/${book}/${chapter}/pages`;
        const vocabularyPath = `${window.location.origin}/curso-lectura-A1/${book}/${chapter}/vocabulary.json`;

        // Instantiate Flipbook with bgImages map
        const flipbook = new Flipbook(
            '#flipbook',
            '#progress-bar',
            '#page-counter',
            vocabularyPath,
            bgImages
        );

        // Initialize flipbook
        flipbook.initialize(basePath, pagesCount);

        // Accessibility & Controls
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
        console.error('Error initializing Flipbook:', error);
    }
});
