const cloudinary = require('../utils/cloudinary');

const uploadImage = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;

    const base64String = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'your_folder_name', // optional
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = uploadImage;