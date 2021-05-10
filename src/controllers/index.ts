import { Router } from 'express';
import { Container, Service } from 'typedi';

import { PostRoute } from './post';
import { AuthRoute } from './auth';
import { TokenRoute } from './token';
import { UploadRoute } from './upload';
import { SocialRoute } from './social';

@Service() 
class RootRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRouter();
  }

  private setRouter() {
    this.router.use('/post', Container.get(PostRoute).getRouter());
    this.router.use('/social', Container.get(SocialRoute).getRouter());
    this.router.use('/auth', Container.get(AuthRoute).getRouter());
    this.router.use('/upload', Container.get(UploadRoute).getRouter());
    this.router.use('/token', Container.get(TokenRoute).getRouter());
  }

  public getRouter() {
    return this.router;
  }
}

export default RootRouter;