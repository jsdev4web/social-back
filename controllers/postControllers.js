import { prisma } from "../lib/prisma.config.js";

async function postHome(req, res) {
    console.log("test post page")
    res.send("Post Page Back End")
}

async function createPost(req, res) {
  try {
    
    const { content } = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Post content is required"
      });
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        author: {
          connect: {
            id: req.user.id
          }
        }
      }
    });

    res.status(201).json(post);

  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      message: "Failed to create post"
    });
  }
}

async function deletePost(req, res) {
  try {
    const { postId } = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    await prisma.post.delete({
      where: {
        id: Number(postId)
      }
    });

    res.status(200).json({
      message: "Post deleted successfully"
    });

  } catch (error) {
    console.error("Delete post error:", error);

    res.status(500).json({
      message: "Failed to delete post"
    });
  }
}

async function feedPost(req, res) {
  try {
    const userId = req.user.id;

    const posts = await prisma.post.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        likes: {
          where: {
            userId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    const formattedPosts = posts.map(post => ({
      ...post,
      isLiked: post.likes.length > 0,
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error(error);
  }
}

async function postLike(req, res) {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.id);

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return res.status(200).json({
        message: "Post already liked",
        liked: true,
      });
    }

    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return res.status(201).json({
      message: "Post liked",
      liked: true,
    });
  } catch (error) {
    console.error("Like Error:", error);

    return res.status(500).json({
      error: "Unable to like post",
    });
  }
}


async function myPost(req, res) {
  try {
    const userId = req.user.id;

    // My posts
    const myPosts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    // Posts from people I follow
    const followingPosts = await prisma.post.findMany({
      where: {
        author: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    return res.status(200).json({
      myPosts,
      followingPosts,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to load content",
    });
  }
}


export { postHome, createPost, deletePost, feedPost, postLike, myPost }