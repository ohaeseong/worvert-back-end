import { Router } from 'express';
import Container, { Service } from 'typedi';
import authMiddleWare from '../../../middlewares/auth.middleware';
import { CommentCtrl } from './comment.ctrl';

// 의존성 주입
@Service()
export class CommentRoute {

    // router 변수 선언
    private router: Router;

    constructor(
        public commentCtrl: CommentCtrl,
    ) {
        // Router 함수 값 선언
        this.router = Router();

        //setRouter 실행
        this.setRouter();
    }

    private setRouter() {
        this.router.post('/', authMiddleWare, this.commentCtrl.createComment);
        this.router.post('/reply', authMiddleWare, this.commentCtrl.replyComment);
        this.router.get('/', this.commentCtrl.getComments);
        this.router.get('/reply', this.commentCtrl.getReplyComment);
        this.router.put('/', authMiddleWare, this.commentCtrl.updateComment);
        this.router.delete('/', authMiddleWare, this.commentCtrl.deleteComment);
        this.router.delete('/reply', authMiddleWare, this.commentCtrl.deleteReplyComment);
    }

    public getRouter() {
        return this.router;
    }
}