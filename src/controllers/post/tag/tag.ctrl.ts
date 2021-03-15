import { Response } from 'express';
import { Service } from "typedi";

import { AuthRequest } from '../../../typings';
import * as colorConsole from '../../../lib/console';
import { PostService } from '../../../services/post.service';
import { PostTagService } from '../../../services/post.tag.service';

@Service()
export class TagCtrl {
    constructor (
        private postService: PostService,
        private postTagService: PostTagService,
    ) { }

    public addTagToPost = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[POST] add tag item ');
        const { body } = req;


        if (!body.postId || !body.tagName) {
            res.status(400).json({
                status: 400,
                message: '잘못 된 요청 값입니다.',
            });

            return;
        }

        try {
            const { postId, tagName } = body;

            await this.postTagService.addTag(postId, tagName);

            res.status(200).json({
                status: 200,
                message: 'add tag to post!',
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
              status: 500,
              message: '서버 에러',
            });
        }
    }

    public deleteTagFromPost = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[DELETE] delete tag item ');


        try {
            res.status(200).json({
                status: 200,
                message: 'delete tag from post!',
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