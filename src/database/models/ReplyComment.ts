import { BaseEntity, Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Comment } from "./Comment";
import { Member } from "./Member";
import { Post } from "./Post";

@Entity()
export class ReplyComment extends BaseEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    @Generated('increment')
    idx: number;

    @Column({ type: 'varchar', length: 1000 })
    commentTxt: string;


    @Column({ type: 'varchar', length: 50 })
    memberId: string;

    @Column({ type: 'int', nullable: true })
    replyCommentIdx: number;

    @Column({ type: 'varchar', length: 100 })
    postId: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    createDate: string;


    @ManyToOne(
        (type) => Post,
        (post) => post.id, { nullable: false, onDelete: 'CASCADE' },
    )
    post: Post;


    @ManyToOne(
        (type) => Comment,
        (comment) => comment.idx, { nullable: false,  onDelete: 'CASCADE' },
    )
    @JoinColumn({
        name: 'replyCommentIdx'
      })
    commentIdx: Comment;

    @ManyToOne(
        (type) => Member,
        (member) => member.memberId, { nullable: false , onDelete: 'CASCADE'},
      )
      @JoinColumn({
        name: 'memberId'
      })
    member: Member;
}