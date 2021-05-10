import { BaseEntity, Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Member } from "./Member";

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

    @ManyToOne(
      (type) => Member,
      (member) => member.memberId, { nullable: false , onDelete: 'CASCADE'},
    )
    @JoinColumn({
      name: 'following'
    })
    member: Member;
}