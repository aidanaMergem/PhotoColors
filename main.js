class ImageDimensions {
    constructor(imgElement) {
        this.imgElement = imgElement;
    }
    
    getWidth() {
        return this.imgElement.width;
    }
    
    getHeight() {
        return this.imgElement.height;
    }
}
// Get the canvas element
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

// Get the circle div and text element
const colorCircle = document.getElementById('colorCircle');
const colorText = document.getElementById('colorText');

// Get the image input element
const imageInput = document.getElementById('imageInput');

// Function to handle user image upload
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imgElement = new Image();
            imgElement.src = e.target.result;

            imgElement.onload = function() {
                const aspectRatio = imgElement.width / imgElement.height;

                // Set the canvas dimensions, ensuring it fits within window height
                const maxHeight = window.innerHeight - 150; // Adjust as needed
                canvas.height = Math.min(maxHeight, imgElement.height);
                canvas.width = canvas.height * aspectRatio;

                // Draw the scaled image on the canvas
                context.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
            };
        };

        reader.readAsDataURL(file);
    }
});

// ... (previous code)

// ... (previous JavaScript code)

let isColorIdentificationPaused = false;
let hoverTimeout;

// Function to handle mouse hover event
function handleMouseHover(event) {
    if (isColorIdentificationPaused) {
        return;
    }

    clearTimeout(hoverTimeout);

    hoverTimeout = setTimeout(function() {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const pixelData = context.getImageData(x, y, 1, 1).data;

        const red = pixelData[0];
        const green = pixelData[1];
        const blue = pixelData[2];
        const alpha = pixelData[3];

        const colorRGBA = `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
        const colorRGB = `rgb(${red}, ${green}, ${blue})`;
        const colorHex = rgbToHex(red, green, blue);

        const colorSample = document.querySelector('.color-sample');
        colorSample.style.backgroundColor = colorRGBA;

        const colorTextRGBA = document.querySelector('.color-textRGBA');
        colorTextRGBA.textContent = colorRGBA;
        colorTextRGBA.setAttribute('data-value', colorRGBA);

        const colorTextHEX = document.querySelector('.color-textHEX');
        colorTextHEX.textContent = colorHex;
        colorTextHEX.setAttribute('data-value', colorHex);
    }, 10); // Adjust the delay time (in milliseconds) as needed
}

// Handle canvas click event to toggle color identification
canvas.addEventListener('click', function() {
    isColorIdentificationPaused = !isColorIdentificationPaused;
});

// ... (remaining JavaScript code)

// ... (remaining code)

// Add mousemove event listener to the canvas
canvas.addEventListener('mousemove', handleMouseHover);

// Function to convert RGB values to HEX
function rgbToHex(r, g, b) {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = text;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}
