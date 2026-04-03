const multer = require('multer');
const ImageKit = require('imagekit');

// Store file in memory so we can send the buffer to ImageKit
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ImageKit instance using env credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Helper: upload a file buffer to ImageKit, returns the URL
const uploadToImageKit = (fileBuffer, fileName, folder = 'autoaidx') => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: fileBuffer,
        fileName: `${Date.now()}_${fileName}`,
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.url);
      }
    );
  });
};

module.exports = { upload, uploadToImageKit };
