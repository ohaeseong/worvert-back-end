import { Router } from 'express';
import { Service } from 'typedi';
import authMiddleWare from '../../../middlewares/auth.middleware';

import { TagCtrl } from './tag.ctrl';

@Service()
export class TagRoute {
    private router: Router;

    constructor(
        public tagCtrl: TagCtrl,
    ) {

        // Router 함수 값 선언
        this.router = Router();

        //setRouter 실행
        this.setRouter();
    };

    setRouter() {
        this.router.post('/', authMiddleWare, this.tagCtrl.addTagToPost);
        this.router.delete('/', authMiddleWare, this.tagCtrl.deleteTagFromPost);
    }

    public getRouter() {
        return this.router;
    }
}