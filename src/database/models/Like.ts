import { BaseEntity, Column, Entity, Generated, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Like extends BaseEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    @Generated('increment')
    idx: number;

    @Column({ type: 'varchar', length: 50 })
    memberId: string;

    @Column({ type: 'varchar', length: 100 })
    postId: string;

    @ManyToOne(
        (type) => Post,
        (post) => post.id, { nullable: false, },
    )
    post!: Post;
}