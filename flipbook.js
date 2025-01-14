export class Flipbook {

    constructor(flipbookSelector, progressBarSelector, pageCounterSelector, vocabularyPath) {
        this.flipbook = $(flipbookSelector);
        this.progressBar = $(progressBarSelector); // Selector para la barra de progreso
        this.pageCounter = $(pageCounterSelector); // Selector para el contador de páginas
        this.pagesCount = 0; // Default pages count, will be set during initialization
        this.currentFontSize = 16; // Default font size
        this.vocabularyPath = vocabularyPath; // Save vocabularyPath for later use
    }

    initialize(basePath, pagesCount) {
        this.pagesCount = pagesCount; // Set the pages count dynamically

        this.flipbook.turn({
            width: 400,
            height: 600,
            autoCenter: true,
            display: 'single',
            duration: 600,
            gradients: true,
            elevation: 50,
            pages: this.pagesCount,
        });

        // Load pages after initializing
        this.loadPagesSequentially(basePath, this.pagesCount, this.vocabularyPath); // Pass it here

        this.setupArrowKeyNavigation();
        this.setupClickHandlers();
        this.updateDisplay();
        $(window).resize(() => this.updateDisplay());
        this.setupProgressTracking();

        // Ensure font size is applied after flipping
        this.flipbook.on('turned', () => this.applyFontSizeToAllPages());



    }


    async loadPagesSequentially(basePath, pagesCount, vocabularyPath) {
        for (let i = 1; i <= pagesCount; i++) {
            try {
                const path = `${basePath}/page${i}.html`;
                const response = await fetch(path);

                if (!response.ok) {
                    throw new Error(`Error loading page ${i}: ${response.statusText}`);
                }


                let htmlContent = await response.text();
                htmlContent = await this.highlightWordsInPage(htmlContent, vocabularyPath); // Pass vocabularyPath here
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                const bodyContent = doc.body.innerHTML;

                const pageElement = $(`<div class="page">${bodyContent}</div>`);
                this.applyFontSize(pageElement);
                this.flipbook.turn('addPage', pageElement, i);

                this.initializeTooltips(pageElement);

            } catch (error) {
                console.error(`Error loading page ${i}:`, error);
            }
        }
    }



    initializeTooltips(pageElement) {
        const highlightedWords = pageElement.find('.highlighted-word');

        highlightedWords.each((_, element) => {
            tippy(element, {
                allowHTML: true,
                content: element.getAttribute('data-tippy-content'), // Use HTML for tooltip
                theme: 'light',
                animation: 'scale',
                arrow: true,
                interactive: true, // Enable interaction with buttons
                onShow(instance) {
                    const tooltipContent = instance.popper.querySelector(".tooltip-content");
                    const buttons = tooltipContent.querySelectorAll(".translate-btn");

                    buttons.forEach((button) => {
                        button.addEventListener("click", (e) => {
                            e.stopPropagation(); // Prevent click from bubbling up

                            e.stopPropagation(); // Prevent event bubbling

                            const lang = button.getAttribute("data-lang");
                            const word = button.getAttribute("data-word");


                            // Get the translation JSON from the new data attribute
                            const translationData = JSON.parse(
                                element.getAttribute("data-translation-data")
                            );

                            // Fetch the translation for the selected language
                            const translation = translationData.translations[lang];

                            // Update the tooltip text dynamically
                            const tooltipText = tooltipContent.querySelector(".tooltip-text");
                            if (tooltipText) {
                                tooltipText.textContent = translation;
                            }


                        });


                    });
                },
            });
        });
    }







    async highlightWordsInPage(content, vocabularyPath) {
        try {
            const response = await fetch(vocabularyPath);
            if (!response.ok) {
                throw new Error(`Failed to load vocabulary JSON: ${response.statusText}`);
            }

            const vocabulary = await response.json();

            Object.keys(vocabulary).forEach((word) => {
                const data = vocabulary[word];
                const tooltipHTML = `
                    <div class="tooltip-content">
                        <p class="tooltip-text">${data.default}</p>
                        <div class="tooltip-buttons">
                            <button class="translate-btn" data-lang="en" data-word="${word}">English</button>
                            <button class="translate-btn" data-lang="zh" data-word="${word}">Chinese</button>
                            <button class="translate-btn" data-lang="es" data-word="${word}">Spanish</button>
                        </div>
                    </div>
                `;

                // Store translations separately in a new data attribute
                const translationData = JSON.stringify({
                    default: data.default,
                    translations: data.translations,
                });

                const tooltipSpan = `<span class="highlighted-word" data-tippy-content='${tooltipHTML}' data-translation-data='${translationData}'>${word}</span>`;
                const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
                content = content.replace(wordRegex, tooltipSpan);
            });

            return content;
        } catch (error) {
            console.error("Error highlighting words:", error);
            return content;
        }
    }




    // async highlightWordsInPage(content, vocabularyPath) {
    //     console.log("Highlighting words with vocabulary path:", vocabularyPath); // Debug log
    //     try {
    //         const response = await fetch(vocabularyPath);
    //         if (!response.ok) {
    //             throw new Error(`Failed to load vocabulary JSON: ${response.statusText}`);
    //         }

    //         const vocabulary = await response.json();
    //         Object.keys(vocabulary).forEach((word) => {
    //             const tooltipSpan = `<span class="highlighted-word" data-tippy-content="${vocabulary[word]}">${word}</span>`;
    //             const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
    //             content = content.replace(wordRegex, tooltipSpan);
    //         });

    //         return content;
    //     } catch (error) {
    //         console.error("Error highlighting words:", error);
    //         return content;
    //     }
    // }



    applyFontSize(pageElement) {
        const paragraphs = pageElement.find('p'); // Target <p> elements
        paragraphs.each((_, paragraph) => {
            $(paragraph).css({
                fontSize: `${this.currentFontSize}px`,
                lineHeight: `${this.currentFontSize * 1.5}px`,
            });
        });
    }

    applyFontSizeToAllPages() {
        // Apply font size to all current pages
        this.flipbook.find('.page').each((_, page) => {
            this.applyFontSize($(page));
        });
    }

    adjustFontSize(increase = true) {
        this.currentFontSize += increase ? 2 : -2;
        this.currentFontSize = Math.max(12, Math.min(this.currentFontSize, 32)); // Clamp font size
        this.applyFontSizeToAllPages(); // Ensure font size is applied to all current pages
    }




    setupArrowKeyNavigation() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                // Flip to the previous page
                this.flipbook.turn('previous');
            } else if (event.key === 'ArrowRight') {
                // Flip to the next page
                this.flipbook.turn('next');
            }
        });
    }

    setupClickHandlers() {
        // Cambiar de página solo si se hace clic en la parte inferior de la página
        this.flipbook.on('click', (e) => {
            const flipbookOffset = this.flipbook.offset();
            const clickPositionX = e.pageX - flipbookOffset.left;
            const clickPositionY = e.pageY - flipbookOffset.top;

            const flipbookHeight = this.flipbook.height();
            const flipbookWidth = this.flipbook.width();

            // Definir un área en la parte inferior para cambiar de página (por ejemplo, el 25% inferior)
            const bottomThreshold = flipbookHeight * 0.90;

            if (clickPositionY >= bottomThreshold) {
                if (clickPositionX < flipbookWidth / 2) {
                    this.flipbook.turn('previous'); // Ir a la página anterior
                } else {
                    this.flipbook.turn('next'); // Ir a la página siguiente
                }
            }
        });

        // Pronunciar la palabra al hacer clic en párrafos y encabezados, y resaltarla
        this.flipbook.on('click', 'p, h1, h2, h3, h4, h5, h6', (e) => {
            // Prevenir que el clic en una palabra también cause el cambio de página
            e.stopPropagation();

            // Obtener la palabra que se ha clickeado
            const selectedWord = window.getSelection().toString().trim();
            if (selectedWord) {
                this.highlightAndSpeakWord(selectedWord);
            }
        });
    }

    highlightAndSpeakWord(word) {
        // Resaltar la palabra seleccionada temporalmente
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        const span = document.createElement('span');
        span.style.backgroundColor = 'yellow'; // Color de resaltado temporal
        span.style.transition = 'background-color 0.5s ease'; // Para un desvanecimiento suave
        span.appendChild(range.extractContents());
        range.insertNode(span);

        // Pronunciar la palabra
        this.speakWord(word);

        // Restaurar el color original después de un pequeño retraso
        setTimeout(() => {
            span.style.backgroundColor = 'yellow';
        }, 1000); // Resaltar durante 1 segundo
    }

    speakWord(word) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'es-MX'; // Cambiar el idioma a español de México
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('La API de síntesis de voz no está soportada en este navegador.');
        }
    }


    updateDisplay() {
        const width = $(window).width();
        const height = $(window).height();



        const pages = document.querySelectorAll('.page'); // Select all pages


        if (width >= 768 && width <= 1024 && window.matchMedia("(orientation: portrait)").matches) {
            // iPad vertical mode
            this.flipbook.turn('display', 'single');
            this.flipbook.turn('size', width * 0.9, height * 0.8); // Adjust size dynamically
        } else if (document.fullscreenElement) {
            if (width < 1200) {
                this.flipbook.turn('display', 'single');
            } else this.flipbook.turn('size', 1200, height);

        } else if (width < 375) {
            // Extra small screens
            this.flipbook.turn('display', 'single');
            this.flipbook.turn('size', 300, 800);
        } else if (width < 400) {
            // Small screens
            this.flipbook.turn('display', 'single');
            this.flipbook.turn('size', 350, 800);
        } else if (width < 620) {
            // Medium screens
            this.flipbook.turn('display', 'single');
            this.flipbook.turn('size', 400, 650);
        } else if (width < 900) {
            // Large screens
            this.flipbook.turn('display', 'single');
            this.flipbook.turn('size', 600, 650);
        } else if (width < 1200) {
            // Extra large screens
            this.flipbook.turn('display', 'double');
            this.flipbook.turn('size', 1000, 630);

        } else {
            this.flipbook.turn('display', 'double');
            this.flipbook.turn('size', 1200, 650);

            pages.forEach(page => {
                page.style.padding = '';
                page.style.margin = '';
                page.style.backgroundColor = '';
                page.style.color = '';
                page.style.transition = '';
            });

        }


        // Ensure the Flipbook layout is updated
        this.flipbook.turn('resize');
    }



    setupProgressTracking() {
        this.flipbook.on('turning', (event, currentPage) => {
            this.updateProgress(currentPage);



        });

        this.flipbook.on('turned', (event, currentPage) => {
            this.updateProgress(currentPage);

        });


    }

    updateProgress(currentPage) {
        const progress = (currentPage / this.pagesCount) * 100;
        this.progressBar.css('width', `${progress}%`);
        this.pageCounter.text(`Página ${currentPage} / ${this.pagesCount}`);
    }









}
