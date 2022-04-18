import express from 'express';
import controller from '../controllers/posts';
import passport from '../middlewares/passport.middleware';

const router = express.Router();

router.get('/posts', passport.authenticate('jwt', { session: false }), controller.getPosts);

// router.get('/posts', controller.getPosts);
router.get('/posts/:id', controller.getPost);
router.put('/posts/:id', controller.updatePost);
router.delete('/posts/:id', controller.deletePost);
router.post('/posts', controller.addPost);

export { router as postsRouter };