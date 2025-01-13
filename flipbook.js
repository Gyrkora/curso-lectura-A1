export class Flipbook {

    constructor(flipbookSelector, progressBarSelector, pageCounterSelector) {
        this.flipbook = $(flipbookSelector);
        this.progressBar = $(progressBarSelector); // Selector para la barra de progreso
        this.pageCounter = $(pageCounterSelector); // Selector para el contador de páginas
        this.pagesCount = 0; // Default pages count, will be set during initialization

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
        this.loadPagesSequentially(basePath, this.pagesCount);

        this.setupArrowKeyNavigation();


        // Set up click handlers for navigation
        this.setupClickHandlers();

        // Set up the initial display and handle resize
        this.updateDisplay();
        $(window).resize(() => this.updateDisplay());

        // Set up progress updates
        this.setupProgressTracking();

    }

    async loadPagesSequentially(basePath, pagesCount) {
        for (let i = 1; i <= pagesCount; i++) {
            try {
                const path = `${basePath}/page${i}.html`; // Add `pages/` in the basePath
                const response = await fetch(path);



                if (!response.ok) {
                    throw new Error(`Error loading page ${i}: ${response.statusText}`);
                }

                const htmlContent = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');

                const bodyContent = doc.body.innerHTML;

                const pageElement = $(`<div class="page">${bodyContent}</div>`);
                this.flipbook.turn('addPage', pageElement, i);
            } catch (error) {
                console.error(`Error loading page ${i}:`, error);
            }
        }
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


        if (document.fullscreenElement) {

            if (width < 1200) {
                this.flipbook.turn('display', 'single');
                this.flipbook.turn('size', 600, 630)

            }


            this.flipbook.turn('size', 1200, height);


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
            // Default for very large screens
            this.flipbook.turn('display', 'double');
            this.flipbook.turn('size', 1200, 650);

            pages.forEach(page => {
                page.style.padding = ''; // Reset to default padding
                page.style.margin = ''; // Reset to default margins
                page.style.backgroundColor = ''; // Reset background color
                page.style.color = ''; // Reset text color
                page.style.transition = ''; // Remove transition
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
