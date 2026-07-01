import { Router } from 'express';
import { getPosts, createPost, getPostById, toggleLike, addComment } from '../controllers/forum.controller';
import { authenticateUser } from '../middleware/authenticateUser';

const router = Router();

router.get('/', getPosts);
router.post('/', authenticateUser, createPost);
router.get('/:id', getPostById);
router.post('/:id/like', authenticateUser, toggleLike);
router.post('/:id/comments', authenticateUser, addComment);

export default router;
