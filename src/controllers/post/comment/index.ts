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
        this.router.post('/',authMiddleWare, this.commentCtrl.createComment);
        this.router.get('/', this.commentCtrl.getComments);
        this.router.put('/', authMiddleWare, this.commentCtrl.updateComment);
        this.router.delete('/', authMiddleWare, this.commentCtrl.deleteComment);
    }

    public getRouter() {
        return this.router;
    }
}