import { BaseEntity, Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    @Generated('increment')
    idx: number;

    @Column({ type: 'varchar', length: 1000 })
    commentTxt: string;


    @Column({ type: 'varchar', length: 50 })
    memberId: string;

    @Column({ type: 'varchar', length: 100 })
    postId: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    createDate: string;


    @ManyToOne(
        (type) => Post,
        (post) => post.id, { nullable: false, onDelete: 'CASCADE' },
    )
    post: Post;
}