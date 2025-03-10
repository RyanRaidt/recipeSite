const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Configure multer for temporary storage
const storage = multer.memoryStorage(); // Store files in memory before uploading to Supabase

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, or JPG files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Middleware to upload file to Supabase
const uploadMiddleware = async (req, res, next) => {
  if (!req.file) {
    console.error("No file received in request.");
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const fileName = `recipe-images/${Date.now()}-${req.file.originalname}`;
    console.log("Uploading file:", fileName);

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from("recipe-images")
      .upload(fileName, req.file.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: req.file.mimetype,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      return res
        .status(500)
        .json({ message: "Error uploading image to Supabase" });
    }

    // ✅ Fix: Correctly get public URL
    const { publicURL } = supabase.storage
      .from("recipe-images")
      .getPublicUrl(fileName);
    req.fileUrl = publicURL;
    console.log("File uploaded successfully:", req.fileUrl);

    next();
  } catch (error) {
    console.error("Unexpected error uploading to Supabase:", error);
    res
      .status(500)
      .json({ message: "Unexpected error uploading image to Supabase" });
  }
};


module.exports = { upload, uploadMiddleware };
