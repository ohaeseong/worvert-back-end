import { Router } from 'express';


export class SocialRoute { 
    private router: Router;

    constructor() {

    }

    public setRouter() {
        this.router.post();
    }

    public getRouter() {
        return this.router;
    }
}