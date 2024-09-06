const sharp = require('sharp');

/**
 * Compresses an image file to meet specified size and quality constraints.
 * @param {Object} options - Compression options
 * @param {Buffer|string} options.input - The image buffer or file path to compress
 * @param {number} [options.maxWidth=1920] - Maximum width of the compressed image
 * @param {number} [options.initialQuality=70] - Initial compression quality (1-100)
 * @param {number} [options.minQuality=10] - Minimum acceptable quality (1-100)
 * @param {number} [options.maxFileSize=200*1024] - Maximum file size in bytes (default 200KB)
 * @returns {Promise<Buffer>} A promise that resolves with the compressed image buffer
 */
const compressImageServer = async ({
  input,
  maxWidth = 1920,
  initialQuality = 70,
  minQuality = 10,
  maxFileSize = 200 * 1024
}) => {
  const compressImageHelper = async (quality) => {
    const image = sharp(input);
    const metadata = await image.metadata();
    
    const resizeOptions = metadata.width > maxWidth 
      ? { width: maxWidth } 
      : undefined;

    return image
      .resize(resizeOptions)
      .webp({ quality })
      .toBuffer();
  };

  let quality = initialQuality;
  let compressedBuffer = await compressImageHelper(quality);

  // Gradually reduce quality until file size is acceptable or min quality is reached
  while (compressedBuffer.length > maxFileSize && quality > minQuality) {
    quality = Math.max(quality - 10, minQuality);
    compressedBuffer = await compressImageHelper(quality);
  }

  return compressedBuffer;
};

module.exports = compressImageServer;

