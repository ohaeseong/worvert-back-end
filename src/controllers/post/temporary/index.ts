import { Router } from 'express';
import { Service } from 'typedi';
import authMiddleWare from '../../../middlewares/auth.middleware';

import { TemporaryCtrl } from './temporary.ctrl';

@Service()
export class TemporaryRoute {
    private router: Router;

    constructor(
        public temporaryCtrl: TemporaryCtrl,
    ) {

        // Router 함수 값 선언
        this.router = Router();

        //setRouter 실행
        this.setRouter();
    };

    setRouter() {
        this.router.get('/', authMiddleWare, this.temporaryCtrl.getTemporaryPostList);
    }

    public getRouter() {
        return this.router;
    }
}