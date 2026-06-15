import { prisma } from "../lib/prisma.config.js";

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

async function uploadPhoto(req, res){
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        image: imagePath,
      },
    });

    return res.status(200).json({
      image: updatedUser.image,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
}

export { getProfile, uploadPhoto }