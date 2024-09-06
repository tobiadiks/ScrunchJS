/**
 * Compresses an image file to meet specified size and quality constraints.
 * @param {Object} options - Compression options
 * @param {File|Blob} options.input - The image file or blob to compress
 * @param {number} [options.maxWidth=1920] - Maximum width of the compressed image
 * @param {number} [options.initialQuality=70] - Initial compression quality (0-100)
 * @param {number} [options.minQuality=10] - Minimum acceptable quality (0-100)
 * @param {number} [options.maxFileSize=200*1024] - Maximum file size in bytes (default 200KB)
 * @returns {Promise<Blob>} A promise that resolves with the compressed image blob
 */
const compressImageClient = async ({
  input,
  maxWidth = 1920,
  initialQuality = 70,
  minQuality = 10,
  maxFileSize = 200 * 1024
}) => {
  // Create canvas and context only once
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const compressImageHelper = (img, quality) => {
    // Calculate new dimensions
    let width = img.width;
    let height = img.height;
    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    // Draw image on canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to blob
    return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
  };

  // Load image
  const img = await createImageBitmap(input);

  let quality = initialQuality / 100;
  let compressedBlob = await compressImageHelper(img, quality);

  // Binary search for optimal quality
  let minQ = minQuality / 100;
  let maxQ = quality;

  while (compressedBlob.size > maxFileSize && maxQ - minQ > 0.01) {
    quality = (minQ + maxQ) / 2;
    compressedBlob = await compressImageHelper(img, quality);
    
    if (compressedBlob.size > maxFileSize) {
      maxQ = quality;
    } else {
      minQ = quality;
    }
  }

  return compressedBlob;
};

module.exports = compressImageClient;

