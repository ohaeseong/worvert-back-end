import { Router } from 'express';
import { Service } from 'typedi';
import { TokenCtrl } from './token.ctrl';

@Service()
export class TokenRoute {
    private router: Router;

    constructor(
        public tokenCtrl: TokenCtrl,
    ) { 
        this.router = Router();

        this.setRouter();
     }

     setRouter() {
        this.router.post('/', this.tokenCtrl.createToken);
     }

     getRouter() {
         return this.router;
     }
}