import { Router } from 'express';
import authMiddleWare from '../../../middlewares/auth.middleware';


export class BookmarkRoute {
    private router: Router;

    constructor(
        public bookmarkCtrl: any,
    ) {
        this.router = Router();
        this.setRouter();
    }

    private setRouter() {
        this.router.post('/', authMiddleWare, );
    }

    public getRouter() {
        return this.router;
    }
}