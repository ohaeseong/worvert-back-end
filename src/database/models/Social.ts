import { BaseEntity, Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Comment } from "./Comment";
import { Member } from "./Member";
import { Post } from "./Post";

@Entity()
export class Social extends BaseEntity {
    @PrimaryColumn({ type: 'int', unique: true })
    @Generated('increment')
    idx: number;

    @Column({ type: 'varchar', length: 50 })
    memberId: string;

    @Column({ type: 'varchar', length: 50 })
    following: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    createDate: string;

    @ManyToOne(
        (type) => Member,
        (member) => member.memberId, { nullable: false , onDelete: 'CASCADE'},
      )
      @JoinColumn({
        name: 'memberId'
      })
    member: Member;
}