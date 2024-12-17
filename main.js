// // $(document).ready(function () {
// //     // Create a new instance of the Flipbook class
// //     const myFlipbook = new Flipbook('#flipbook');

// //     // Select the fullscreen button
// //     const fullscreenBtn = document.getElementById('fullscreen-btn');

// //     // Fullscreen button logic
// //     fullscreenBtn.addEventListener('click', () => {
// //         if (!document.fullscreenElement) {
// //             document.documentElement.requestFullscreen(); // Enter fullscreen
// //             fullscreenBtn.textContent = "Salir de Pantalla Completa";
// //         } else {
// //             document.exitFullscreen(); // Exit fullscreen
// //             fullscreenBtn.textContent = "Pantalla Completa";
// //         }
// //     });

// //     // Handle fullscreen changes
// //     document.addEventListener('fullscreenchange', () => {
// //         if (document.fullscreenElement) {
// //             // If in fullscreen, update flipbook size to fit screen
// //             const width = window.innerWidth;
// //             const height = window.innerHeight;
// //             $('#flipbook').turn('size', width, height);
// //         } else {
// //             // If exiting fullscreen, call the updateDisplay method
// //             myFlipbook.updateDisplay(); // Use the Flipbook instance
// //         }
// //     });

// //     // Initialize the flipbook
// //     myFlipbook.initialize();
// // });

// $(document).ready(function () {
//     // Create a new instance of the Flipbook class
//     const myFlipbook = new Flipbook('#flipbook');

//     // Select the fullscreen button and the container
//     const fullscreenBtn = document.getElementById('fullscreen-btn');
//     const fullscreenContainer = document.getElementById('fullscreen-container'); // Use a wrapper container

//     // Fullscreen button logic
//     fullscreenBtn.addEventListener('click', () => {
//         if (!document.fullscreenElement) {
//             // Enter fullscreen mode for the container
//             fullscreenContainer.requestFullscreen()
//                 .then(() => {
//                     fullscreenBtn.textContent = "Salir de Pantalla Completa";
//                 })
//                 .catch(err => console.error("Error al entrar en pantalla completa:", err));
//         } else {
//             // Exit fullscreen mode
//             document.exitFullscreen()
//                 .then(() => {
//                     fullscreenBtn.textContent = "Pantalla Completa";
//                 })
//                 .catch(err => console.error("Error al salir de pantalla completa:", err));
//         }
//     });

//     // Handle fullscreen changes
//     document.addEventListener('fullscreenchange', () => {
//         if (document.fullscreenElement === fullscreenContainer) {
//             // Adjust the flipbook size to fit the fullscreen container
//             const width = window.innerWidth;
//             const height = window.innerHeight - 15; // Subtract progress bar height
//             $('#flipbook').turn('size', width, height);
//         } else {
//             // Restore the flipbook dimensions
//             myFlipbook.updateDisplay();
//         }
//     });

//     // Initialize the flipbook
//     myFlipbook.initialize();
// });


$(document).ready(function () {
    const myFlipbook = new Flipbook('#flipbook');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const fullscreenContainer = document.getElementById('fullscreen-container');

    // Fullscreen button logic
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            fullscreenContainer.requestFullscreen()
                .then(() => {
                    fullscreenBtn.textContent = "Salir de Pantalla Completa";
                })
                .catch(err => console.error("Error al entrar en pantalla completa:", err));
        } else {
            document.exitFullscreen()
                .then(() => {
                    fullscreenBtn.textContent = "Pantalla Completa";
                })
                .catch(err => console.error("Error al salir de pantalla completa:", err));
        }
    });

    // Handle fullscreen changes
    // document.addEventListener('fullscreenchange', () => {
    //     if (document.fullscreenElement === fullscreenContainer) {
    //         // Adjust flipbook size dynamically
    //         const width = window.innerWidth;
    //         const height = window.innerHeight - 15; // Subtract progress bar height
    //         $('#flipbook').turn('size', width, height);
    //     } else {
    //         myFlipbook.updateDisplay();
    //     }
    // });

    // Initialize the flipbook
    myFlipbook.initialize();
});
