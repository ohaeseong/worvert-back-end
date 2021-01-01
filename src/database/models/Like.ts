import { BaseEntity, Column, Entity, Generated, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Like extends BaseEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    @Generated('increment')
    idx: number;

    @Column({ type: 'varchar', length: 50 })
    memberId: string;

    @ManyToOne(
        (type) => Post,
        (post) => post.id,
    )
    post!: Post;
}