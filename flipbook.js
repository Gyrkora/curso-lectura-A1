class Flipbook {

    constructor(flipbookSelector, progressBarSelector, pageCounterSelector) {
        this.flipbook = $(flipbookSelector);
        this.progressBar = $(progressBarSelector); // Selector para la barra de progreso
        this.pageCounter = $(pageCounterSelector); // Selector para el contador de páginas
        this.pagesCount = 17; // Default number of pages; can be modified dynamically
    }

    initialize() {
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
        this.loadPagesSequentially();

        // Set up click handlers for navigation
        this.setupClickHandlers();

        // Set up the initial display and handle resize
        this.updateDisplay();
        $(window).resize(() => this.updateDisplay());

        // Set up progress updates
        this.setupProgressTracking();

    }

    async loadPagesSequentially() {
        for (let i = 1; i <= this.pagesCount; i++) {
            try {
                const response = await fetch(`pages/page${i}.html`);
                if (!response.ok) {
                    throw new Error(`Error al cargar la página ${i}`);
                }
                const htmlContent = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                const bodyContent = doc.body.innerHTML;

                const pageElement = $(`<div class="page">${bodyContent}</div>`);
                this.flipbook.turn('addPage', pageElement, i);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
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

        if (document.fullscreenElement) {
            // En modo fullscreen, ajusta al 100% del tamaño de la pantalla
            this.flipbook.turn('size', width, height);
        } else if (width < 375) {
            this.flipbook.turn('display', 'single');
            this.flipbook.turn('size', 300, 800);
        } else if (width < 400) {
            this.flipbook.turn('display', 'single');
            this.flipbook.turn('size', 350, 800);
        } else if (width < 620) {
            this.flipbook.turn('display', 'single');
            this.flipbook.turn('size', 400, 650);
        } else if (width < 900) {
            this.flipbook.turn('display', 'single');
            this.flipbook.turn('size', 600, 650);
        } else if (width < 1200) {
            this.flipbook.turn('display', 'double');
            this.flipbook.turn('size', 1000, 630); //630
        }
        else {
            this.flipbook.turn('display', 'double');
            this.flipbook.turn('size', 1200, 650);
        }
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
        const isDouble = this.flipbook.turn('display') === 'double';
        let totalTurns = this.pagesCount; // Total pages count

        // In double mode, reduce the totalTurns by 1 because the last page is shared
        if (isDouble) {
            totalTurns = Math.ceil(this.pagesCount / 2.3);
        }

        let progress;

        // Adjust progress calculation based on display mode
        if (isDouble) {
            progress = ((Math.ceil(currentPage / 2)) / totalTurns) * 100; // Count pages in pairs
        } else {
            progress = ((currentPage - 1) / (this.pagesCount - 1)) * 100;
        }

        console.log(`Total Pages: ${this.pagesCount}`);
        console.log(`Current Page: ${currentPage}`);
        console.log(`Calculated Progress: ${progress}%`);

        // Update progress bar and page counter
        this.progressBar.css('width', `${progress}%`);
        this.pageCounter.text(`Página ${currentPage} / ${this.pagesCount}`);
    }







}

