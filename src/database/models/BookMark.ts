import { BaseEntity, Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Member } from "./Member";
import { Post } from "./Post";

@Entity()
export class BookMark extends BaseEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    @Generated('increment')
    idx: number;

    @Column({ type: 'varchar', length: 50 })
    memberId: string;

    @Column({ type: 'varchar', length: 100 })
    postId: string;

    @ManyToOne(
        (type) => Post,
        (post) => post.id, { nullable: false, onDelete: 'CASCADE' },
    )
    post!: Post;

    @ManyToOne(
        (type) => Member,
        (member) => member.memberId, { nullable: false , onDelete: 'CASCADE'},
      )
      @JoinColumn({
        name: 'memberId'
      })
    member: Member;
}