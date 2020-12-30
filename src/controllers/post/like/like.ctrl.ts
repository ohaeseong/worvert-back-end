import { Response } from 'express';
import { Service } from "typedi";

import { PostLikeService } from '../../../services/post.like.service';
import { AuthRequest } from '../../../typings';
import * as colorConsole from '../../../lib/console';
import { PostService } from '../../../services/post.service';

@Service()
export class LikeCtrl {
    constructor (
        private likeService: PostLikeService,
        private postService: PostService,
    ) { }

    public async addLikeOrCancelLike(req: AuthRequest, res: Response) {
        colorConsole.info('[POST] add or cancel like to post');
        const { postId } = req.body;
        const { memberId } = req.decoded;
        console.log(this.postService);
        

        if (!postId) {
            res.status(400).json({
                status: 400,
                message: '요청 오류!',
            });

            return;
        }

        try {
            const post = await this.postService.getPostById(postId);
            if (!post) {
                res.status(404).json({
                    status: 404,
                    message: 'post is not found!',
                });
    
                return;
            }

            const like = await this.likeService.findLikeWithPostIdAndMemberId(postId, memberId);

            if (!like) {
                await this.likeService.addLikeByPostId(postId, memberId);

                res.status(200).json({
                    status: 200,
                    message: 'added like on post!',
                });

                return;
            }

            await this.likeService.cancelLikeByPostId(postId, memberId);

            res.status(200).json({
                status: 200,
                message: 'canceled like in post!',
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