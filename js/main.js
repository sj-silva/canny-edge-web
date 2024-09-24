const imgSource = document.querySelector("#imageSrc");
const fileInput = document.querySelector("#fileInput");
const placeholderMessage = document.querySelector("#placeholderMessage");
const sliderContainer = document.querySelector("#slider-container");
const saveImageButton = document.querySelector("#saveImageBtn");

const canvas = document.querySelector("#imageOutput");
const defaultCanvasWidth = canvas.width;
const defaultCanvasHeight = canvas.height;

// Sliders
const lowThresholdSlider = document.querySelector("#lowThreshold");
const highThresholdSlider = document.querySelector("#highThreshold");
const lowThresholdValueDisplay = document.querySelector("#lowThresholdValue");
const highThresholdValueDisplay = document.querySelector("#highThresholdValue");

var Module = {
  onRuntimeInitialized() {
    const statusButton = document.querySelector("#status");
    statusButton.innerHTML =
      'OpenCV.js is ready! <i class="bi bi-check-circle"></i>';
    statusButton.classList.remove("btn-primary");
    statusButton.classList.add("btn-success");
  },
};

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    hideElement(placeholderMessage);
    showElement(imgSource);
    showElement(sliderContainer);

    imgSource.src = URL.createObjectURL(file);
  } else {
    hideElement(imgSource);
    hideElement(sliderContainer);
    showElement(placeholderMessage);

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas

    // Reset the canvas to its default size
    canvas.width = defaultCanvasWidth;
    canvas.height = defaultCanvasHeight;

    // Reset the canvas caption
    setCanvasCaption("Canvas Output");
  }
});

imgSource.addEventListener("load", (event) => {
  setCanvasCaption("Edges Detected");
  applyCanny(cv.imread(imgSource));
});

saveImageButton.addEventListener("click", () => {
  let link = document.createElement("a");
  link.download = "Canny-Edge-image.png"; // Set default filename
  link.href = canvas.toDataURL(); // Convert canvas content to data URL
  link.click(); // Trigger the download
});

// Sliders Listeners
// Add event listeners for sliders
lowThresholdSlider.addEventListener("input", () => {
  const lowVal = parseInt(lowThresholdSlider.value);
  const highVal = parseInt(highThresholdSlider.value);

  // Ensure lowThreshold is less than or equal to highThreshold
  lowThresholdSlider.value = lowVal > highVal ? highVal : lowVal;

  lowThresholdValueDisplay.textContent = lowThresholdSlider.value;
  applyCanny(cv.imread(imgSource)); // Process image with updated threshold
});

highThresholdSlider.addEventListener("input", () => {
  const lowVal = parseInt(lowThresholdSlider.value);
  const highVal = parseInt(highThresholdSlider.value);

  // Ensure highThreshold is greater than or equal to lowThreshold
  highThresholdSlider.value = highVal < lowVal ? lowVal : highVal;

  highThresholdValueDisplay.textContent = highThresholdSlider.value;
  applyCanny(cv.imread(imgSource)); // Process image with updated threshold
});

// --- Helpers Functions ---

function applyCanny(inputImage) {
  let resultImage = new cv.Mat();
  cv.cvtColor(inputImage, inputImage, cv.COLOR_RGB2GRAY, 0);

  // First apply Gaussian Blur
  let blurredImage = new cv.Mat();
  let ksize = new cv.Size(7, 7);
  cv.GaussianBlur(inputImage, blurredImage, ksize, 0, 0, cv.BORDER_DEFAULT);

  // Now apply Canny
  const lowThreshold = parseInt(lowThresholdSlider.value);
  const highThreshold = parseInt(highThresholdSlider.value);

  cv.Canny(blurredImage, resultImage, lowThreshold, highThreshold, 3, false);
  cv.imshow("imageOutput", resultImage);

  blurredImage.delete();
  inputImage.delete();
  resultImage.delete();
}

function showElement(element) {
  element.style.display = "block";
}

function hideElement(element) {
  element.style.display = "none";
}

function setCanvasCaption(captionText) {
  const canvasCaption = document.querySelector("#canvas-caption");
  canvasCaption.textContent = captionText;
}
