import { Router } from 'express';
import studentAuthRoutes from './auth.student.routes';
import mentorAuthRoutes from './auth.mentor.routes';
import forumRoutes from './forum.routes';
import { getMe, logout, refresh } from '../controllers/auth.me.controller';

const router = Router();

router.use('/auth/student', studentAuthRoutes);
router.use('/auth/mentor', mentorAuthRoutes);
router.use('/forum', forumRoutes);
router.get('/auth/me', getMe);
router.post('/auth/logout', logout);
router.post('/auth/refresh-token', refresh);

export default router;
