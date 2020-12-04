import { Router } from 'express';
import { Service } from 'typedi';

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
        this.router.post('/');
    }

    public getRouter() {
        return this.router;
    }
}