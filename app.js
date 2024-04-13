document.getElementById('imageInput').addEventListener('change', handleFileSelect, false);
document.getElementById('drop-area').addEventListener('dragover', handleDragOver, false);
document.getElementById('drop-area').addEventListener('drop', handleFileDrop, false);

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function handleFileDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(evt) {
    const files = evt.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }
    previewFile(file);
}

function previewFile(file) {
    const reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            const uploadedImage = document.getElementById('uploadedImage');
            uploadedImage.innerHTML = `<img src="${e.target.result}" alt="${escape(theFile.name)}" style="max-width: 100%;">`;
            const uploadedHeading = document.getElementById('uploadedHeading');
            uploadedHeading.innerText = `Your Image [${theFile.type.split('/')[1]}]`;
            const uploadedSize = (theFile.size / 1024).toFixed(2); // Size in KB
            uploadedHeading.innerHTML += ` (${uploadedSize} KB)`;
        };
    })(file);
    reader.readAsDataURL(file);
}

async function resizeImage() {
    const files = document.getElementById('imageInput').files;
    if (!files.length) return alert('Please select an image.');

    const widthInput = document.getElementById('widthInput').value;
    const heightInput = document.getElementById('heightInput').value;

    if (!widthInput && !heightInput) {
        // No dimensions provided, proceed with conversion without resizing
        convertImage(files[0]);
    } else {
        // Dimensions provided, perform resizing and conversion
        const width = parseInt(widthInput, 10);
        const height = parseInt(heightInput, 10);
        if (isNaN(width) || isNaN(height)) return alert('Please enter valid dimensions.');

        const file = files[0];
        const originalImage = new Image();
        const reader = new FileReader();

        reader.onload = function (e) {
            originalImage.src = e.target.result;

            originalImage.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Setting canvas size to desired dimensions
                canvas.width = width;
                canvas.height = height;

                // Drawing the image into canvas
                ctx.drawImage(originalImage, 0, 0, width, height);

                // Converting canvas to desired format
                const format = document.getElementById('formatSelect').value;
                canvas.toBlob(function (blob) {
                    const url = URL.createObjectURL(blob);
                    showPreview(url, blob, format, file.name);
                }, `image/${format}`);
            };
        };

        reader.readAsDataURL(file);
    }
}

function showPreview(url, blob, format, originalName) {
    const convertedImage = document.getElementById('convertedImage');
    convertedImage.innerHTML = `<img src="${url}" alt="Converted Image" style="max-width: 100%;">`;

    const downloadButton = document.getElementById('downloadBtn');
    downloadButton.style.display = 'block';
    downloadButton.onclick = function () {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${originalName.split('.')[0]}_converted.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const heading = document.getElementById('convertedHeading');
    heading.innerText = `Converted Image [${format}]`;

    // Calculate and display image sizes
    const uploadedSize = (blob.size / 1024).toFixed(2); // Size in KB
    const convertedSize = (blob.size / 1024).toFixed(2); // Size in KB
    const sizeInfo = document.createElement('div');
    sizeInfo.innerHTML = `Uploaded Image Size: ${uploadedSize} KB<br>Converted Image Size: ${convertedSize} KB`;
    convertedImage.appendChild(sizeInfo);
}

function convertImage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const format = document.getElementById('formatSelect').value;
        const blob = new Blob([e.target.result], { type: `image/${format}` });
        const url = URL.createObjectURL(blob);
        showPreview(url, blob, format, file.name);
    };
    reader.readAsArrayBuffer(file);
}


function toggleMenu() {
  var menu = document.querySelector('.menu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

document.addEventListener("DOMContentLoaded", function() {
  var popupContainer = document.querySelector(".popup-container");
  var popupCloseBtn = document.querySelector(".popup-close-btn");

  // Close the popup when the close button is clicked
  popupCloseBtn.addEventListener("click", function() {
    closePopup();
  });

  // Close the popup when clicking outside the popup container
  popupContainer.addEventListener("click", function(e) {
    if (e.target === popupContainer) {
      closePopup();
    }
  });

  // Show the popup when the page is loaded
  showPopup();

  function showPopup() {
    popupContainer.style.display = "flex";
  }

  function closePopup() {
    popupContainer.style.display = "none";
  }
});