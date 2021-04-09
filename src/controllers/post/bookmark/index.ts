import { Router } from 'express';
import authMiddleWare from '../../../middlewares/auth.middleware';
import { BookMarkCtrl } from './bookmark.ctrl';
import { Service } from 'typedi';
// dependency injection type di
@Service()
export class BookmarkRoute {
    private router: Router;

    constructor(
        public bookmarkCtrl: BookMarkCtrl,
    ) {
        this.router = Router();
        this.setRouter();
    }

    private setRouter() {
        this.router.post('/', authMiddleWare, this.bookmarkCtrl.bookmarkToPost);
        this.router.get('/', this.bookmarkCtrl.getBookmarkPost);
    }

    public getRouter() {
        return this.router;
    }
}