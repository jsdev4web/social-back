import { prisma } from "../lib/prisma.config.js";

async function getComment(req, res) {

    console.log("test")
    res.send("Get Comments")
}


async function createComment(req, res) {
  try {
    const { content, postId } = req.body;

    // Validate input
    if (!content || !postId) {
      return res.status(400).json({ message: "Content and postId are required" });
    }

    // Get logged in user from session
    const userId = req.user?.id; // depends on your auth setup

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }


    // Create comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: Number(postId),
        authorId: userId,
      },
      include: {
        author: true, // return author info with comment
      },
    });

    return res.status(201).json(newComment);

  } catch (error) {
    console.error("Create comment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export { getComment, createComment }