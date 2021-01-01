import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Comment } from '../database/models/Comment';

@Service()
export class PostCommentService {
    constructor(
        @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    ) { }

    // 게시글 작성 함수
    public async createPostComment(commentTxt: string, memberId: string, postId: string) {

        const commentData = await this.commentRepo.save({
            postId,
            commentTxt,
            memberId,
        });

        return commentData;
    }

    // 게시글 댓글 목록 조회 조회 방식은 load more형식이므로 skip이 필요 없다.
    public async getPostCommentList(limit: number, postId: string) {
        const commentData = await this.commentRepo.find({
            where: {
                postId,
            },
            order: {
                createDate: "DESC",
            },
            take: limit,
        });

        return commentData;
    }

    public async getPostCommentListAll(postId: string) {
        const commentData = await this.commentRepo.find({
            where: {
                postId,
            },

            relations:['id','postId']
        });

        return commentData;
    }

    // 게시글 댓글 수정 함수
    public async updatePostComment(idx: number, commentTxt: string) {
        const commentData = await this.commentRepo.update({
            idx,
        }, {
            commentTxt,
        });

        return commentData;
    }

    // 게시글 댓글 삭제
    public async deletePostComment(idx: number) {
        const commentData = await this.commentRepo.delete({
            idx,
        });

        return commentData;
    }

    // 댓글 작성자 식별을 위한 함수
    public async getCommentForDiscrimination(idx: number, memberId: string) {
        const commentData = await this.commentRepo.findOne({
            idx,
            memberId,
        });

        return commentData;
    }

    // idx로 댓글 조회
    public async getCommentByIdx(idx: number) {
        const commentData = await this.commentRepo.findOne({
            idx,
        });

        return commentData;
    }
}