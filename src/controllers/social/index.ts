import { Router } from 'express';
import authMiddleWare from '../../middlewares/auth.middleware';
import { SocialCtrl } from './social.ctrl';
import { Service } from 'typedi';

@Service()
export class SocialRoute { 
    private router: Router;

    // 의존성 주입을 위한 객체 선언
    constructor(
        public socialCtrl: SocialCtrl,
    ) {
        // Router 함수 값 선언
        this.router = Router();

        // setRouter 실행
        this.setRouter();
    }

    setRouter() {
        this.router.post('/', authMiddleWare, this.socialCtrl.isFollowMember);
        this.router.get('/', this.socialCtrl.getFollowInfo);
    }

    public getRouter() {
        return this.router;
    }
}