const uploadImageToImgBB = async (imageBuffer) => {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      throw new Error("Valid image buffer is required.");
    }

    const base64Image = imageBuffer.toString("base64");

    const formData = new URLSearchParams();
    formData.append("image", base64Image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error?.message || "ImgBB image upload failed."
      );
    }

    return {
      url: result.data.url,
      displayUrl: result.data.display_url,
      deleteUrl: result.data.delete_url,
    };
  } catch (error) {
    console.error("ImgBB Upload Error:", error.message);
    throw error;
  }
};

export { uploadImageToImgBB };