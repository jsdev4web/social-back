import { prisma } from "../lib/prisma.config.js";

async function getFriends(req, res) {
  try {
    const userId = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        name: true,
        followers: {
          where: {
            followerId: userId,
          },
        },
      },
    });

    const formatted = users.map((user) => ({
      id: user.id,
      name: user.name,
      isFollowing: user.followers.length > 0,
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load users" });
  }
}

async function followUser(req, res) {
  try {
    const followerId = req.user.id;
    const { followingId } = req.body;

    await prisma.follow.create({
      data: {
        followerId,
        followingId: Number(followingId),
      },
    });

    return res.status(201).json({
      message: "Followed user",
    });

  } catch (error) {
    console.error("Follow Error:", error);

    return res.status(500).json({
      message: "Unable to follow user",
    });
  }
}

async function unfollowUser(req, res) {
  try {
    const followerId = req.user.id;
    const { followingId } = req.body;

    await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId: Number(followingId),
      },
    });

    return res.status(200).json({
      message: "Unfollowed user",
    });

  } catch (error) {
    console.error("Unfollow Error:", error);

    return res.status(500).json({
      message: "Unable to unfollow user",
    });
  }
}



export { followUser, unfollowUser, getFriends }