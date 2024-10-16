$(document).ready(function () {
    // Initialize the flipbook with Turn.js
    $('#flipbook').turn({
        width: 400,
        height: 600,
        autoCenter: true,
        display: 'single',
        duration: 600,
        gradients: true,
        elevation: 50,
    });

    // Function to load an external HTML page and wrap each word in a span
    function loadPage(pageNumber) {
        console.log(`Loading page ${pageNumber}`); // Debug log to verify page loading
        fetch(`pages/page${pageNumber}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error loading page ${pageNumber}`);
                }
                return response.text(); // Convert response to text
            })
            .then(htmlContent => {
                console.log(`Page ${pageNumber} loaded successfully`);
                const parser = new DOMParser(); // Create an HTML parser
                const doc = parser.parseFromString(htmlContent, 'text/html'); // Parse the HTML
                const bodyContent = doc.body; // Extract the <body> content as an element

                // Recursively wrap each word in a <span> tag
                wrapWordsInElement(bodyContent);

                const pageElement = $(`<div class="page">${bodyContent.innerHTML}</div>`); // Create the jQuery element
                $('#flipbook').turn('addPage', pageElement, pageNumber); // Add the page to the flipbook

                // Add event listener for word pronunciation AFTER the page has been added
                pageElement.find('.word').on('click', function () {
                    pronounceWord($(this).text());
                });
            })
            .catch(error => console.error(`Error: ${error.message}`));
    }

    // Function to wrap words in a given DOM element, avoiding HTML tags
    function wrapWordsInElement(element) {
        // Loop through child nodes
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                // If it's a text node, split it into words and wrap each word
                const words = node.textContent.trim().split(/\s+/);
                const fragment = document.createDocumentFragment();

                words.forEach((word, index) => {
                    if (word.length > 0) {
                        const span = document.createElement('span');
                        span.className = 'word';
                        span.textContent = word;

                        fragment.appendChild(span);

                        // Add a space after the word if it's not the last word
                        if (index < words.length - 1) {
                            fragment.appendChild(document.createTextNode(' '));
                        }
                    }
                });

                // Replace the original text node with the new fragment
                node.parentNode.replaceChild(fragment, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // If it's an element node, call the function recursively
                wrapWordsInElement(node);
            }
        });
    }

    // Load pages dynamically
    for (let i = 1; i <= 3; i++) {
        loadPage(i); // Load pages 1 and 2, add more as needed
    }

    // Click control for navigating between pages
    $('#flipbook').on('click', function (e) {
        const flipbookOffset = $(this).offset();
        const clickPosition = e.pageX - flipbookOffset.left;

        if (clickPosition < $(this).width() / 2) {
            $('#flipbook').turn('previous'); // Go to the previous page
        } else {
            $('#flipbook').turn('next'); // Go to the next page
        }
    });

    // Adjust display based on screen size
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

    // Execute on page load and when resizing the window
    updateDisplay();
    $(window).resize(updateDisplay);

    // Function to pronounce a word using the Web Speech API
    function pronounceWord(word) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = word;
        msg.lang = 'es-ES'; // Set the language code for Spanish

        // Optional: Set other properties of SpeechSynthesisUtterance
        msg.rate = 1; // Speech rate
        msg.pitch = 1; // Pitch

        window.speechSynthesis.speak(msg);
    }
});