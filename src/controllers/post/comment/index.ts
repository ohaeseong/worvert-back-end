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
        // public 
    ) {
        // Router 함수 값 선언
        this.router = Router();

        //setRouter 실행
        this.setRouter();
    }

    private setRouter() {
        this.router.post('/',authMiddleWare, Container.get(CommentCtrl).createComment);
        this.router.get('/', Container.get(CommentCtrl).getComments);
        this.router.put('/',authMiddleWare, Container.get(CommentCtrl).updateComment);
        this.router.delete('/',authMiddleWare, Container.get(CommentCtrl).deleteComment);
    }

    public getRouter() {
        return this.router;
    }
}