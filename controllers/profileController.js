import { prisma } from "../lib/prisma.config.js";
import cloudinary from "../config/cloudinary.js";

async function getProfile(req, res) {

    try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true, // if you add it later
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            comments: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load profile" });
  }
}

async function uploadPhoto(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "social-profile-images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: uploadResult.secure_url,
      },
    });

    return res.status(200).json({
      success: true,
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
}

export { getProfile, uploadPhoto }