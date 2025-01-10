
import { Flipbook } from './flipbook.js';
import { toggleFullscreen, setupModalClose } from './scripts/functions.js';

document.addEventListener("DOMContentLoaded", async function () {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const book = pathSegments[1]; // Adjust if the URL includes a prefix like `/curso-lectura-A1/`
    const chapter = pathSegments[2];

    if (!book || !chapter) {
        console.error("Invalid book or chapter path");
        return;
    }

    try {
        // Fetch the configuration file
        const configResponse = await fetch('/curso-lectura-A1/config.json');
        if (!configResponse.ok) {
            throw new Error("Failed to load configuration file.");
        }
        const config = await configResponse.json();

        // Get the page count for the current book and chapter
        const pagesCount = config[book]?.[chapter];
        if (!pagesCount) {
            throw new Error(`No page count found for ${book}/${chapter}`);
        }

        const basePath = `${window.location.origin}/curso-lectura-A1/${book}/${chapter}/pages`;
        console.log('Dynamic Base Path:', basePath);

        const flipbook = new Flipbook('#flipbook', '#progress-bar', '#page-counter');
        flipbook.initialize(basePath, pagesCount);

        // Set up fullscreen functionality
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const fullscreenContainer = document.getElementById('fullscreen-container');
        const iframeElement = document.getElementById('myIframe');
        fullscreenBtn.addEventListener('click', () => toggleFullscreen(fullscreenBtn, fullscreenContainer, iframeElement));

        // Set up modal close functionality
        const modalCloseButton = document.getElementById('close-modal');
        setupModalClose(modalCloseButton);
    } catch (error) {
        console.error("Error initializing Flipbook:", error);
    }
});

