import { Response } from 'express';
import { Service } from "typedi";

// import { PostLikeService } from '../../../services/post.like.service';
import { AuthRequest } from '../../../typings';
import * as colorConsole from '../../../lib/console';
import { PostService } from '../../../services/post.service';

@Service()
export class TemporaryCtrl {
    constructor (
        private postService: PostService,
    ) { }

    public getTemporaryPostList = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[GET] get temporary post list ');
        const { memberId } = req.decoded;

        if (!memberId) {
            res.status(400).json({
                status: 400,
                message: '요청 오류!',
            });

            return;
        }

        try {
            res.status(200).json({
                status: 200,
                message: 'get temporary posts!',
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
              status: 500,
              message: '서버 에러',
            });
        }
    }
}