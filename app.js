let selectedFile;
let selectedFileName;
let uploadedFormat = '';
let convertedFormat = '';

document.getElementById('drop-area').addEventListener('click', function() {
  document.getElementById('imageInput').click();
});

document.getElementById('drop-area').addEventListener('dragover', function(event) {
  event.preventDefault();
  event.target.style.color = 'black';
  event.target.style.borderColor = 'black';
});

document.getElementById('drop-area').addEventListener('dragleave', function(event) {
  event.target.style.color = '#ccc';
  event.target.style.borderColor = '#ccc';
});

document.getElementById('drop-area').addEventListener('drop', function(event) {
  event.preventDefault();
  event.target.style.color = '#ccc';
  event.target.style.borderColor = '#ccc';
  const files = event.dataTransfer.files;
  selectedFile = files[0];
  selectedFileName = selectedFile.name; // Store the file name
  uploadedFormat = getFileFormat(selectedFile);
  showPreview(selectedFile);
});

document.getElementById('imageInput').addEventListener('change', function(event) {
  const files = event.target.files;
  selectedFile = files[0];
  selectedFileName = selectedFile.name; // Store the file name
  uploadedFormat = getFileFormat(selectedFile);
  showPreview(selectedFile);
});

function getFileFormat(file) {
  const fileNameParts = file.name.split('.');
  return fileNameParts[fileNameParts.length - 1].toUpperCase();
}

function showPreview(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.innerHTML = ''; // Clear previous previews
    const img = new Image();
    img.src = event.target.result;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    uploadedImage.appendChild(img);
    document.getElementById('uploadedHeading').innerText = `Your Image [${uploadedFormat}]`;
  };
  reader.readAsDataURL(file);
}

function convertImage() {
  if (selectedFile) {
    const format = document.getElementById('formatSelect').value;
    const mimeType = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
    const fileExtension = format === 'jpeg' ? 'jpg' : format;
    convertedFormat = format.toUpperCase();
    
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.querySelector('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function(blob) {
          const url = URL.createObjectURL(blob);
          const convertedImage = document.getElementById('convertedImage');
          convertedImage.innerHTML = ''; // Clear previous previews
          const convertedImg = new Image();
          convertedImg.src = url;
          convertedImg.style.maxWidth = '100%';
          convertedImg.style.height = 'auto';
          convertedImage.appendChild(convertedImg);
          
          const downloadBtn = document.getElementById('downloadBtn');
          downloadBtn.style.display = 'block';
          downloadBtn.textContent = `Download Image (${convertedFormat})`;
          downloadBtn.onclick = function() {
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedFileName}.${fileExtension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          };
          document.getElementById('convertedHeading').innerText = `Converted Image [${convertedFormat}]`;
        }, mimeType);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
  } else {
    alert('Please select an image first.');
  }
}
