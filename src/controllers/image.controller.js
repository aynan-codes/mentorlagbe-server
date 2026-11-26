import { uploadImageToImgBB } from "../services/image.service.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    // Validate image MIME type
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed.",
      });
    }

    // Validate image size (5MB)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Image size must not exceed 5MB.",
      });
    }

    const image = await uploadImageToImgBB(req.file.buffer);

    if (!image || !image.url) {
      throw new Error("Image URL was not returned by ImgBB.");
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      imageUrl: image.url,
    });
  } catch (error) {
    console.error("Image Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });
  }
};