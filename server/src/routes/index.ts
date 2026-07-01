import { Router } from 'express';
import studentAuthRoutes from './auth.student.routes';
import mentorAuthRoutes from './auth.mentor.routes';

const router = Router();

router.use('/auth/student', studentAuthRoutes);
router.use('/auth/mentor', mentorAuthRoutes);

export default router;
