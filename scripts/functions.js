import { h5ps_cap1 } from "../api/internal-h5ps.js";



function openSmallWindow(siteKey) {
    const url = h5ps_cap1[siteKey];
    if (url) {
        window.open(url, "_blank", "width=650,height=700");
    } else {
        console.error(`URL for "${siteKey}" not found.`);
    }

}




// Function to dynamically load and render Markdown content
async function loadMarkdown(chapter, language) {
    const markdownPath = `../../traducciones/${chapter}/${chapter}-${language}.md`; // Adjust path to match your structure

    try {
        const response = await fetch(markdownPath);
        if (!response.ok) {
            throw new Error(`Markdown file not found at: ${markdownPath}`);
        }

        const markdown = await response.text();

        // Convert Markdown to HTML
        const converter = new showdown.Converter();
        const htmlContent = converter.makeHtml(markdown);

        // Update modal content
        const modalTitle = document.getElementById("modal-title");
        const modalContent = document.getElementById("modal-content");

        if (modalTitle && modalContent) {
            modalTitle.textContent = `Translation - ${chapter} (${language})`;
            modalContent.innerHTML = htmlContent;

            // Show the modal
            const modal = document.getElementById("interpretation-modal");
            if (modal) {
                modal.style.display = "flex";
            }
        }
    } catch (error) {
        console.error("Error loading Markdown:", error);
    }
}

// Event delegation to handle dynamically rendered buttons
document.addEventListener("click", async (event) => {
    const target = event.target;

    // Open the modal and load the markdown content
    if (target && target.id === "translation-btn") {
        const chapter = target.getAttribute("data-chapter");
        const language = target.getAttribute("data-language");

        if (chapter && language) {
            await loadMarkdown(chapter, language);

            // Show the modal
            const modal = document.getElementById("interpretation-modal");
            if (modal) {
                modal.style.display = "flex";

                // Add close logic only if not already added
                if (!modal.getAttribute("data-listeners")) {
                    setupModalCloseListeners(modal);
                    modal.setAttribute("data-listeners", "true"); // Flag to prevent duplicate listeners
                }
            } else {
                console.error("Modal element not found.");
            }
        } else {
            console.error("Chapter or language data attributes are missing.");
        }
    }
});

// Function to set up modal close logic
function setupModalCloseListeners(modal) {
    const closeModalBtn = document.getElementById("close-interpretation-modal");

    // Function to close the modal
    function closeModal() {
        if (modal) {
            modal.style.display = "none";
        }
    }

    // Close modal when clicking the close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    } else {
        console.error("Close button element not found.");
    }

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}



jQuery.event.special.touchstart = {
    setup: function (_, ns, handle) {
        this.addEventListener('touchstart', handle, { passive: true });
    }
};

jQuery.event.special.touchmove = {
    setup: function (_, ns, handle) {
        this.addEventListener('touchmove', handle, { passive: true });
    }
};


export function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

/**
 * Displays a modal with a message and link for mobile devices.
 */
export function showMobileModal() {
    const modal = document.getElementById('mobile-modal');
    modal.style.display = 'flex';
}



export function toggleFullscreen(fullscreenBtn, fullscreenContainer, iframeElement, flipbookInstance) {
    if (isMobileDevice()) {
        // Show the mobile modal if the user is on a mobile device
        showMobileModal();
        return; // Prevent further fullscreen logic
    }

    const target = iframeElement || fullscreenContainer;


    if (!document.fullscreenElement) {

        // Enter fullscreen
        if (target.requestFullscreen) {
            target.requestFullscreen();
        } else if (target.webkitRequestFullscreen) {
            target.webkitRequestFullscreen(); // Safari
        } else if (target.msRequestFullscreen) {
            target.msRequestFullscreen(); // IE11
        }

        target.classList.add('is-fullscreen');
        fullscreenBtn.textContent = "Salir de Pantalla Completa";
    } else {
        // Exit fullscreen
        document.exitFullscreen()
            .then(() => {
                fullscreenBtn.textContent = "Pantalla Completa";
                target.classList.remove('is-fullscreen'); // Remove the fullscreen class
            })

            .catch((err) => console.error("Error al salir de pantalla completa:", err));


    }

    // Add event listener to handle ESC or any fullscreen exit
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.textContent = "Pantalla Completa";
            target.classList.remove('is-fullscreen');




        } else {
            fullscreenBtn.textContent = "Salir de Pantalla Completa";

        }
    });
}




/**
 * Sets up modal close logic.
 */
export function setupModalClose(modalCloseButton) {
    modalCloseButton.addEventListener('click', () => {
        const modal = document.getElementById('mobile-modal');
        modal.style.display = 'none';
    });
}




window.openSmallWindow = openSmallWindow;

