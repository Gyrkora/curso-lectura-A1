// $(document).ready(function () {
//     const myFlipbook = new Flipbook('#flipbook');
//     const fullscreenBtn = document.getElementById('fullscreen-btn');
//     const fullscreenContainer = document.getElementById('fullscreen-container');

//     // Fullscreen button logic
//     fullscreenBtn.addEventListener('click', () => {
//         if (!document.fullscreenElement) {
//             fullscreenContainer.requestFullscreen()
//                 .then(() => {
//                     fullscreenBtn.textContent = "Salir de Pantalla Completa";
//                 })
//                 .catch(err => console.error("Error al entrar en pantalla completa:", err));
//         } else {
//             document.exitFullscreen()
//                 .then(() => {
//                     fullscreenBtn.textContent = "Pantalla Completa";
//                 })
//                 .catch(err => console.error("Error al salir de pantalla completa:", err));
//         }
//     });


//     function isMobileDevice() {
//         return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
//     }

//     // Botón para activar fullscreen
//     const iframeElement = document.getElementById('myIframe'); // Asegúrate de que el ID coincida

//     fullscreenBtn.addEventListener('click', () => {
//         if (!isMobileDevice()) {
//             // Procede con fullscreen si no es un dispositivo móvil
//             if (iframeElement.requestFullscreen) {
//                 iframeElement.requestFullscreen();
//             } else if (iframeElement.webkitRequestFullscreen) { /* Safari */
//                 iframeElement.webkitRequestFullscreen();
//             } else if (iframeElement.msRequestFullscreen) { /* IE11 */
//                 iframeElement.msRequestFullscreen();
//             }
//         } else {
//             // Muestra un mensaje si es un dispositivo móvil
//             alert("El modo de pantalla completa no está soportado en dispositivos móviles. Lee el libro en el siguiente link: https://gyrkora.github.io/curso-lectura-A1/.");
//         }
//     });




//     // Initialize the flipbook
//     myFlipbook.initialize();
// });


// $(document).ready(function () {
//     const myFlipbook = new Flipbook('#flipbook');
//     const fullscreenBtn = document.getElementById('fullscreen-btn');
//     const fullscreenContainer = document.getElementById('fullscreen-container');
//     const iframeElement = document.getElementById('myIframe');

//     /**
//      * Detects if the user is on a mobile device.
//      * @returns {boolean} True if mobile device is detected, false otherwise.
//      */
//     function isMobileDevice() {
//         return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
//     }

//     /**
//      * Toggles fullscreen mode for the container or iframe.
//      */
//     function toggleFullscreen() {
//         if (isMobileDevice()) {
//             alert("El modo de pantalla completa no está soportado en dispositivos móviles. Lee el libro en el siguiente link: https://gyrkora.github.io/curso-lectura-A1/.");
//             return;
//         }

//         if (!document.fullscreenElement) {
//             // Attempt fullscreen for the container
//             const target = iframeElement || fullscreenContainer;

//             if (target.requestFullscreen) {
//                 target.requestFullscreen();
//             } else if (target.webkitRequestFullscreen) { /* Safari */
//                 target.webkitRequestFullscreen();
//             } else if (target.msRequestFullscreen) { /* IE11 */
//                 target.msRequestFullscreen();
//             }

//             fullscreenBtn.textContent = "Salir de Pantalla Completa";
//         } else {
//             // Exit fullscreen
//             document.exitFullscreen()
//                 .then(() => fullscreenBtn.textContent = "Pantalla Completa")
//                 .catch(err => console.error("Error al salir de pantalla completa:", err));
//         }
//     }

//     // Event listener for fullscreen button
//     fullscreenBtn.addEventListener('click', toggleFullscreen);

//     // Initialize the flipbook
//     myFlipbook.initialize();
// });



$(document).ready(function () {
    const myFlipbook = new Flipbook('#flipbook', '#progress-bar', '#page-counter');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const fullscreenContainer = document.getElementById('fullscreen-container');
    const iframeElement = document.getElementById('myIframe');

    /**
     * Detects if the user is on a mobile device.
     * @returns {boolean} True if mobile device is detected, false otherwise.
     */
    function isMobileDevice() {
        return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    }

    /**
     * Displays a modal with a message and link for mobile devices.
     */
    function showMobileModal() {
        const modal = document.getElementById('mobile-modal');
        modal.style.display = 'flex';
    }

    /**
     * Toggles fullscreen mode for the container or iframe.
     */
    function toggleFullscreen() {
        if (isMobileDevice()) {
            showMobileModal(); // Show modal for mobile users
            return;
        }

        if (!document.fullscreenElement) {
            const target = iframeElement || fullscreenContainer;

            if (target.requestFullscreen) {
                target.requestFullscreen();
            } else if (target.webkitRequestFullscreen) { /* Safari */
                target.webkitRequestFullscreen();
            } else if (target.msRequestFullscreen) { /* IE11 */
                target.msRequestFullscreen();
            }

            fullscreenBtn.textContent = "Salir de Pantalla Completa";
        } else {
            document.exitFullscreen()
                .then(() => fullscreenBtn.textContent = "Pantalla Completa")
                .catch(err => console.error("Error al salir de pantalla completa:", err));
        }
    }

    // Close modal logic
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('mobile-modal').style.display = 'none';
    });

    // Event listener for fullscreen button
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Initialize the flipbook
    myFlipbook.initialize();
    console.log(jQuery.fn.jquery);

});
