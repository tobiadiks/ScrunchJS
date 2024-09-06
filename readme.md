# ScrunchJs

ScrunchJs is an extremely efficient image resizer that compresses images to meet specified size and quality constraints.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Node.js Usage](#nodejs-usage)
  - [React Usage](#react-usage)
  - [Next.js Usage](#nextjs-usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install scrunchjs --save
```

## Usage

### Node.js Usage

```javascript
const compressImage = require('scrunchjs');

const inputBuffer = await fs.readFile('./images/input.png');
const compressedBuffer = await compressImage({
  input: inputBuffer,
  maxWidth: 1920,
  initialQuality: 70,
  minQuality: 10,
  maxFileSize: 200 * 1024
});
```

### React Usage

```javascript
import React, { useState } from 'react';
import compressImage from 'scrunchjs';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) return;

    const compressedBuffer = await compressImage({
      input: image,
      maxWidth: 1920,
      initialQuality: 70,
      minQuality: 10,
      maxFileSize: 200 * 1024
    });

    setCompressedImage(compressedBuffer);
    };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload and Compress</button>
      {compressedImage && <img src={compressedImage} alt="Compressed" />}
    </div>
  );
};
```

### Next.js Usage

When using ScrunchJs with Next.js, you need to create a server-side API route to handle the image compression.

1. Create an API route for image compression (e.g., `pages/api/compress-image.js` or `app/api/compress-image/route.js` for App Router):

```javascript
import { NextResponse } from 'next/server';
import  compressImage  from 'scrunchjs';

export async function POST(req, res) {
  if (req.method === 'POST') {
    try {
      const buffer = Buffer.from(await req.arrayBuffer());
      const compressedBuffer = await compressImage({
        input: buffer,
        maxWidth: 1920,
        initialQuality: 70,
        minQuality: 10,
        maxFileSize: 200 * 1024
      });

      return new Response(compressedBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Length': compressedBuffer.length.toString(),
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error compressing image' });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' });
  }
};
```

2. Use the API route in your Next.js application:

``` javascript
import React, { useState } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) return;

    try {
      const response = await fetch('/api/image', {
        headers: {
          'Content-Type': 'image/png',
        },  
        method: 'POST',
        body: image
      });

      if (!response.ok) {
        throw new Error('Failed to compress image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCompressedImage(url);

    } catch (error) {
      console.error(error);
      alert('Error compressing image');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload and Compress</button>
      {compressedImage && <img src={compressedImage} alt="Compressed" />}
    </div>
  );
};
```

## API Reference

### `compressImage(options)`

Compresses an image based on the provided options.

#### Parameters

- `options`: Object
  - `input`: Buffer | File | Blob | string
    - The image to compress.
  - `maxWidth`: number
    - The maximum width for the compressed image.
  - `initialQuality`: number
    - The initial quality setting for the image compression.
  - `minQuality`: number
    - The minimum quality setting for the image compression.
  - `maxFileSize`: number
    - The maximum file size in bytes for the compressed image.

#### Returns

- `Buffer`: The compressed image buffer.

## Testing

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
