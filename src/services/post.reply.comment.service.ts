import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ReplyComment } from "../database/models/ReplyComment";

@Service()
export class PostReplyCommentService {
    constructor(
        @InjectRepository(ReplyComment) private readonly replyCommentRepo: Repository<ReplyComment>,
    ) { }

    public async createReplyPostComment(replyCommentTxt: string, memberId: string, commentIdx: number, postId: string) {
        const commentData = await this.replyCommentRepo.save({
            replyCommentIdx: commentIdx,
            commentTxt: replyCommentTxt,
            memberId,
            postId,
        });

        return commentData;
    }

    // public async getPostCommentListAll(postId: string) {
    //     const commentData = await this.replyCommentRepo.find({
    //         where: {
    //             postId,
    //         },
    //     });

    //     return commentData;
    // }

    // 게시글 댓글 수정 함수
    public async updateReplyComment(idx: number, commentTxt: string) {
        const commentData = await this.replyCommentRepo.update({
            idx,
        }, {
            commentTxt,
        });

        return commentData;
    }

    // 게시글 댓글 삭제
    public async deletePostComment(idx: number) {
        const commentData = await this.replyCommentRepo.delete({
            idx,
        });

        return commentData;
    }

    // 댓글 작성자 식별을 위한 함수
    public async getCommentForDiscrimination(idx: number, memberId: string) {
        const commentData = await this.replyCommentRepo.findOne({
            idx,
            memberId,
        });

        return commentData;
    }

    // idx로 댓글 조회
    public async getCommentByIdx(idx: number) {
        const commentData = await this.replyCommentRepo.findOne({
            idx,
        });

        return commentData;
    }

    // reply comment idx로 댓글 조회
    public async getCommentByReplyCommentIdx(replyCommentIdx: number) {
        const commentData = await this.replyCommentRepo.find({
            relations: ['member'],
            where: {
                replyCommentIdx,
            },
        });

        return commentData;
    }

    // reply comment idx로 댓글 조회
    public async deleteReplyCommentByCommentIdx(replyCommentIdx: number) {
        const commentData = await this.replyCommentRepo.delete({
            idx: replyCommentIdx,
        });

        return commentData;
    }
}