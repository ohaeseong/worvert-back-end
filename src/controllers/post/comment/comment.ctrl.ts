import { Service } from 'typedi';
import { Response } from 'express';
import { PostCommentService } from '../../../services/post.comment.service';
import * as Validate from '../../../lib/validate/post.validate';
import * as colorConsole from '../../../lib/console';
import { AuthRequest, PostComment } from '../../../typings';
import { PostService } from '../../../services/post.service';
import { asyncForeach } from '../../../lib/method.lib';
import { Comment } from '../../../database/models/Comment';
import { PostReplyCommentService } from '../../../services/post.reply.comment.service';

// service 계층의 클래스를 의존하고 있으므로 typedi를 이용해 의존성을 주입 해줌
@Service()
export class CommentCtrl {
    constructor(
        // comment service 클래스의 속성을 사용할 수 있도록 생성자에서 commentService 타입의 변수 선언
        private commentService: PostCommentService,
        private postService: PostService,
        private replyCommentService: PostReplyCommentService,
    ) { }

    // 댓글 목록 조회 api 기본적으로 댓글 목록은 게시글 조회시 함께 전달 되지만 추가적인 댓글 조회는 해당 api에서 진행된다.
    public getComments = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[GET] comments list lookup api was called');
        // const limit = req.query.limit as string;
        const postId = req.query.postId as string;

        if (!postId) {
            res.status(400).json({
                status: 400,
                message: 'postId is null!'
            });

            return;
        }

        try {
            const commentData = await this.commentService.getPostCommentList(postId);
            
            await asyncForeach(commentData, async (comment: PostComment) => {
                const replyComment = await this.replyCommentService.getCommentByReplyCommentIdx(comment.idx);
                comment.replyComments = replyComment;
            });
            res.status(200).json({
                status: 200,
                message: 'comment lookup success!',
                data: {
                    commentData,
                },
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
                status: 500,
                message: 'server error!',
            });
        }
    };

    // 댓글 작성 api
    public createComment = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[POST] comment post api was called');
        const { body, decoded } = req;
    
        try {
            await Validate.createPostCommentValidate(body);
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: 'comment create body form is wrong!',
            });

            return;
        }

        try {
            const { commentTxt, postId } = body;
            const { memberId } = decoded;

            const post = await this.postService.getPostById(postId);

            if (!post) {
                res.status(404).json({
                    status: 404,
                    message: 'post is not found',
                });

                return;
            }

            await this.commentService.createPostComment(commentTxt, memberId, postId);

            res.status(200).json({
                status:200,
                message: 'create comment success!',
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
                status: 500,
                message: 'server error!',
            });
        }
    };

    // 댓글 수정 api
    public updateComment = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[PUT] comment update api was called');
        const { body, decoded } = req;

        try {
            await Validate.updatePostCommentValidate(body);
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: 'comment update body form is wrong! try again',
            });

            return;
        }

        try {
            const { commentIdx, commentTxt } = body;
            const { memberId } = decoded;

            const comment = await this.commentService.getCommentForDiscrimination(commentIdx, memberId);

            if (!comment) {
                res.status(403).json({
                    status: 403,
                    message: 'you don\'t have update permission of this comment!',
                });

                return;
            }

            await this.commentService.updatePostComment(commentIdx, commentTxt);

            res.status(200).json({
                status:200,
                message: 'update comment success!',
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
                status: 500,
                message: 'server error!',
            });
        }
    };

    // 댓글 삭제 api
    public deleteComment = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[DELETE] comment delete api was called');
        const commentIdx = req.query.commentIdx as string;
        const { decoded } = req;
        

        if (!commentIdx) {
            res.status(400).json({
                status: 400,
                message: 'you\'re not input the idx!',
            });

            return;
        }

        try {
            const comment = await this.commentService.getCommentByIdx(parseInt(commentIdx));

            if (!comment) {

                res.status(404).json({
                    status: 404,
                    message: 'comment data is not found',
                });

                return;
            }

            if (decoded.accessLevel === 0) {

                await this.commentService.deletePostComment(parseInt(commentIdx));

                res.status(200).json({
                    status: 200,
                    message: 'delete comment success! (admin permission)',
                });

                return;
            }

            const commentForDiscriminaion = await this.commentService.getCommentForDiscrimination(parseInt(commentIdx), decoded.memberId);

            if (!commentForDiscriminaion) {
                res.status(403).json({
                    status: 403,
                    message: 'you don\'t have update permission of this comment!',
                });

                return;
            }

            await this.commentService.deletePostComment(parseInt(commentIdx));

            res.status(200).json({
                status:200,
                message: 'delete comment success!',
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
                status: 500,
                message: 'server error!',
            });
        }
    };

    public replyComment = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[POST] reply comment get api was called');
        const { body, decoded } = req;

        try {
            await Validate.createPostReplyCommentValidate(body);
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: 'comment create body form is wrong!',
            });

            return;
        }

        try {
            const { commentTxt, replyCommentIdx, postId } = body;
            const { memberId } = decoded;

            await this.replyCommentService.createReplyPostComment(commentTxt, memberId, replyCommentIdx, postId);

            res.status(200).json({
                status:200,
                message: 'create reply comment success!',
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
                status: 500,
                message: 'server error!',
            });
        }
    };

    public getReplyComment = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[GET] reply comment get api was called');
        const replyCommentIdx = req.query.replyCommentIdx as string;

        if (!replyCommentIdx) {
            res.status(400).json({
                status: 400,
                message: 'replyCommentIdx is null!',
            });

            return;
        }

        try {
            const commentData = await this.replyCommentService.getCommentByReplyCommentIdx(parseInt(replyCommentIdx));

            res.status(200).json({
                status:200,
                message: 'create reply comment success!',
                data: {
                    commentData,
                }
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
                status: 500,
                message: 'server error!',
            });
        }
    };

    public deleteReplyComment = async (req: AuthRequest, res: Response) => {
        colorConsole.info('[DELETE] reply comment get api was called');
        const commentIdx = req.query.commentIdx as string;
        // const { decoded } = req;

        console.log(commentIdx);
        

        if (!commentIdx) {
            res.status(400).json({
                status: 400,
                message: 'commentIdx is null!',
            });

            return;
        }

        try {
            await this.replyCommentService.deleteReplyCommentByCommentIdx(parseInt(commentIdx));

            res.status(200).json({
                status:200,
                message: 'delete reply comment success!',
            });
        } catch (error) {
            colorConsole.error(error);

            res.status(500).json({
                status: 500,
                message: 'server error!',
            });
        }
    };
}