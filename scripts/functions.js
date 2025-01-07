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
    const markdownPath = `traducciones/${chapter}/${chapter}-${language}.md`; // Adjust path to match your structure

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










// // Function to dynamically load and render Markdown content
// async function loadMarkdown(chapter, language) {
//     // Construct the path assuming resources are in the root directory
//     const markdownPath = `traducciones/${chapter}/${chapter}-${language}.md`;

//     try {
//         const response = await fetch(markdownPath);
//         if (!response.ok) {
//             throw new Error(`Markdown file not found at: ${markdownPath}`);
//         }
//         const markdown = await response.text();

//         // Convert Markdown to HTML
//         const converter = new showdown.Converter();
//         const htmlContent = converter.makeHtml(markdown);

//         // Update modal content
//         const modalTitle = document.getElementById("modal-title");
//         const modalContent = document.getElementById("modal-content");

//         if (modalTitle && modalContent) {
//             modalTitle.textContent = `Translation - ${chapter} (${language})`;
//             modalContent.innerHTML = htmlContent;

//             // Show the modal
//             const modal = document.getElementById("interpretation-modal");
//             if (modal) {
//                 modal.style.display = "flex";
//             }
//         }
//     } catch (error) {
//         console.error("Error loading Markdown:", error);
//     }
// }

// // Event listener to attach dynamically
// document.addEventListener("click", (event) => {
//     const translationBtn = document.getElementById("translation-btn");



//     if (event.target && event.target.id === "translation-btn") {
//         translationBtn.addEventListener("click", async () => {
//             const chapter = "cap1"; // Replace with dynamic chapter ID if needed
//             const language = "en"; // Replace with dynamic language if needed
//             await loadMarkdown(chapter, language);
//         });
//     }

//     // Close modal logic
//     const modal = document.getElementById("interpretation-modal");
//     const closeModalBtn = document.getElementById("close-interpretation-modal");

//     if (closeModalBtn) {
//         closeModalBtn.addEventListener("click", () => {
//             if (modal) {
//                 modal.style.display = "none";
//             }
//         });
//     }



//     // Close modal when clicking outside the content
//     window.addEventListener("click", (event) => {
//         if (event.target === modal) {
//             modal.style.display = "none";
//         }
//     });
// });


// // document.addEventListener("click", (event) => {
// //     if (event.target && event.target.id === "translation-btn") {
// //         console.log("Button clicked!");
// //         alert("Button works with event delegation!");
// //     }
// // });



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






window.openSmallWindow = openSmallWindow;

