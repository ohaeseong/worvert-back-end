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
        const memberId: string  = req.query.memberId as string;

        if (!memberId) {
            res.status(400).json({
                status: 400,
                message: '요청 오류!',
            });

            return;
        }

        try {
            const posts = await this.postService.getPostsByMemberId(memberId, 0);

            res.status(200).json({
                status: 200,
                message: 'get temporary posts!',
                data: {
                    posts,
                }
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