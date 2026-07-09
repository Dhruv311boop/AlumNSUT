import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, sort, search } = req.query;

    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (search) {
      where.title = { contains: search as string, mode: 'insensitive' };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'Most Popular') {
      orderBy = { likesCount: 'desc' };
    } else if (sort === 'Most Commented') {
      orderBy = { comments: { _count: 'desc' } };
    }

    const posts = await prisma.forumPost.findMany({
      where,
      orderBy,
      include: {
        author: {
          include: {
            studentProfile: true,
            mentorProfile: true,
          }
        },
        _count: {
          select: { comments: true }
        }
      }
    });

    const parsedPosts = posts.map(post => ({
      ...post,
      tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags
    }));
    res.json(parsedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, category, tags, isAnonymous } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        category,
        tags: JSON.stringify(tags || []),
        isAnonymous: isAnonymous || false,
        authorId: userId,
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating post' });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const post = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            studentProfile: true,
            mentorProfile: true,
          }
        },
        comments: {
          include: {
            author: {
              include: {
                studentProfile: true,
                mentorProfile: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { likes: true, bookmarks: true }
        }
      }
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Increment views
    await prisma.forumPost.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    const parsedPost = {
      ...post,
      tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags
    };
    res.json(parsedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching post' });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      await prisma.forumPost.update({
        where: { id },
        data: { likesCount: { decrement: 1 } }
      });
      res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId: id
        }
      });
      await prisma.forumPost.update({
        where: { id },
        data: { likesCount: { increment: 1 } }
      });
      res.json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error toggling like' });
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId: userId
      },
      include: {
        author: {
          include: {
            studentProfile: true,
            mentorProfile: true,
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error adding comment' });
  }
};
