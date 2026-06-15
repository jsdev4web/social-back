import { prisma } from "../lib/prisma.config.js";

async function dashHome(req, res) {

    console.log("test")
    res.send("Dash Page Back End")
}

async function getProfiles(req, res) {
    
  try {

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: req.user.id
        }
      },
      select: {
        id: true,
        name: true,

        followers: {
          where: {
            followerId: req.user.id
          },
        },
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      isFollowing: user.followers.length > 0,
    }));

    return res.status(200).json(formattedUsers);

  } catch (error) {
    console.error("Error fetching profiles:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}


async function followUser(req, res) {
  try {
    console.log("BODY:", req.body);

    const followerId = req.user.id;
    const { followingId } = req.body;

    console.log("Follower:", followerId);
    console.log("Following:", followingId);
    console.log("REQ USER ID:", req.user.id);

    await prisma.follow.create({
      data: {
        followerId: Number(followerId),
        followingId: Number(followingId),
      },
      skipDuplicates: true,
    });

    return res.status(201).json({
      message: "User followed successfully",
    });

  } catch (error) {
    console.error("Follow Error:", error);

    return res.status(500).json({
      error: "Unable to follow user",
    });
  }
}

async function unfollowUser(req, res) {
    try {
    const followerId = req.user.id;
    const { followingId } = req.body;

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return res.status(200).json({
      message: "User unfollowed successfully",
    });

  } catch (error) {
    console.error("Unfollow Error:", error);

    return res.status(500).json({
      error: "Unable to unfollow user",
    });
  }
}



export { dashHome, getProfiles, unfollowUser, followUser}