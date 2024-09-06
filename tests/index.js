'use strict';

const fs = require('fs').promises;
const compressImage = require('../index');


async function test() {
  try {
    const inputBuffer = await fs.readFile('./tests/images/input.png');
    const compressedBuffer = await compressImage({
      input: inputBuffer,
      maxWidth: 1920,
      initialQuality: 70,
      minQuality: 10,
      maxFileSize: 200 * 1024
    });
    
    await fs.writeFile('./tests/images/output.png', compressedBuffer);
    console.log('Image compressed successfully',`input: ${inputBuffer.length / 1024} kb, output: ${compressedBuffer.length / 1024} kb`);
  } catch (error) {
    console.error('Error compressing image:', error);
  }
}

test();
