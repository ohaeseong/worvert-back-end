import { Router } from 'express';
import { Service } from 'typedi';
import authMiddleWare from '../../../middlewares/auth.middleware';

import { LikeCtrl } from './like.ctrl';

@Service()
export class LikeRoute {
    private router: Router;

    constructor(
        public likeCtrl: LikeCtrl,
    ) {

        // Router 함수 값 선언
        this.router = Router();

        //setRouter 실행
        this.setRouter();
    };

    setRouter() {
        this.router.post('/', authMiddleWare, this.likeCtrl.addLikeOrCancelLike);
    }

    public getRouter() {
        return this.router;
    }
}