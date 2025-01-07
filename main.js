
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



});


