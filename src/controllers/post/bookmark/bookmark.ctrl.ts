import { Response } from 'express';
import { Service } from "typedi";
import { BookMarkService } from "../../../services/post.book.mark.service";
import { AuthRequest } from '../../../typings';
import * as colorConsole from '../../../lib/console';
import { PostService } from '../../../services/post.service';

@Service()
export class BookMarkCtrl {
    constructor(
        private bookmarkService: BookMarkService,
        private postService: PostService,
    ) { }

    public bookmarkToPost = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[POST] bookmark to post api call ');
        const { memberId } = req.decoded;
        const { postId } = req.body;

        try {
            const post = await this.postService.getPostById(postId);

            if (!post) {
                res.status(404).json({
                    status: 404,
                    message: 'post is not found!',
                });
    
                return;
            }

            if (post.state !== 1) {
                res.status(403).json({
                    status: 403,
                    message: '잘못된 접근!',
                });
    
                return;
            }

            const bookmark = await this.bookmarkService.findBookmarkCheck(postId, memberId);

            if (!bookmark) {
                await this.bookmarkService.bookmarkPost(postId, memberId);

                res.status(200).json({
                    status: 200,
                    message: 'added bookmark post!',
                });

                return;
            }

            await this.bookmarkService.cancleBookmark(postId, memberId);

            res.status(200).json({
                status: 200,
                message: 'canceled bookmark post!',
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
              status: 500,
              message: '서버 에러',
            });
        }
    }

    public isCheckBookmark = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[GET] is check bookmark api call ');
        const memberId = req.query.memberId as string;
        const postId = req.query.postId as string;
        
        try {

            const bookmark = await this.bookmarkService.checkMemberBookmark(memberId, postId);
            let isBookmark = false;
            
            if (bookmark) {
                isBookmark = true;
            }

            res.status(200).json({
                status: 200,
                message: 'success check! is bookmark',
                data: {
                    isBookmark,
                },
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
              status: 500,
              message: '서버 에러',
            });
        }
    }

    public getBookmarkPost = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[GET] bookmark post ');
        const memberId: string  = req.query.memberId as string;

        if (!memberId) {
            res.status(404).json({
                status: 404,
                message: 'memberId is not found!',
            });

            return;
        }

        try {

            const posts = await this.bookmarkService.getBookmarkPostByMemberId(memberId);
            const postsDataFormat: any = [];
            posts.forEach((post) => {
                delete post.postId;
                delete post.idx;
                delete post.memberId;
                

                postsDataFormat.push(post.post);
            });

            res.status(200).json({
                status: 200,
                message: '북마크한 게시글 조회 성공!',
                data: {
                    posts: postsDataFormat,
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