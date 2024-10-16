






$(document).ready(function () {
    // Inicializar el flipbook con Turn.js
    $('#flipbook').turn({
        width: 400,
        height: 600,
        autoCenter: true,
        display: 'single',
        duration: 600,
        gradients: true,
        elevation: 50,
        pages: 19,
    });

    // Función para cargar una página HTML externa y extraer su contenido del <body>S
    function loadPage(pageNumber) {
        fetch(`pages/page${pageNumber}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar la página ${pageNumber}`);
                }
                return response.text(); // Convertir respuesta a texto
            })
            .then(htmlContent => {
                const parser = new DOMParser(); // Crear un parser HTML
                const doc = parser.parseFromString(htmlContent, 'text/html'); // Parsear el HTML
                const bodyContent = doc.body.innerHTML; // Extraer el contenido del <body>

                const pageElement = $(`<div class="page">${bodyContent}</div>`); // Crear el elemento jQuery
                $('#flipbook').turn('addPage', pageElement, pageNumber); // Agregar la página
            })
            .catch(error => console.error(`Error: ${error.message}`));
    }

    // Cargar las páginas dinámicamente
    for (let i = 1; i <= 19; i++) {
        loadPage(i); // Cargar las páginas 1 y 2
    }

    // Control de clics para navegar entre páginas
    $('#flipbook').on('click', function (e) {
        const flipbookOffset = $(this).offset();
        const clickPosition = e.pageX - flipbookOffset.left;

        if (clickPosition < $(this).width() / 2) {
            $('#flipbook').turn('previous'); // Ir a la página anterior
        } else {
            $('#flipbook').turn('next'); // Ir a la siguiente página
        }
    });

    // Ajustar la visualización según el tamaño de pantalla
    function updateDisplay() {
        const width = $(window).width();
        if (width < 375) {
            $('#flipbook').turn('display', 'single');
            $('#flipbook').turn('size', 300, 600);
        } else if (width < 400) {
            $('#flipbook').turn('display', 'single');
            $('#flipbook').turn('size', 350, 600);
        } else if (width < 900) {
            $('#flipbook').turn('display', 'single');
            $('#flipbook').turn('size', 400, 600);
        } else {
            $('#flipbook').turn('display', 'double');
            $('#flipbook').turn('size', 800, 600);
        }
    }

    // Ejecutar al cargar la página y al redimensionar la ventana
    updateDisplay();
    $(window).resize(updateDisplay);
});
