import { BaseEntity, Column, Entity, Generated, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Tag extends BaseEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    @Generated('increment')
    idx: number;

    @Column({ type: 'varchar', length: 100 })
    tagName: string;

    @Column({ type: 'varchar', length: 100 })
    postId: string;

    @ManyToOne(
        (type) => Post,
        (post) => post.id, { nullable: false, onDelete: 'CASCADE' },
    )
    post!: Post;
}