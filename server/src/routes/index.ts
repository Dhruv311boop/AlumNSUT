import { Router } from 'express';
import studentAuthRoutes from './auth.student.routes';
import mentorAuthRoutes from './auth.mentor.routes';
import forumRoutes from './forum.routes';

const router = Router();

router.use('/auth/student', studentAuthRoutes);
router.use('/auth/mentor', mentorAuthRoutes);
router.use('/forum', forumRoutes);

export default router;
