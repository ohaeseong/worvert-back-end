import { Entity, BaseEntity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";

// 사용자, 멤버 모델
@Entity()
export class Member extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50, unique: true })
  memberId: string;

  @Column({ type: 'varchar', length: 50 })
  memberName: string;

  @Column({ type: 'varchar', length: 1000 })
  pw: string;

  @Column({ type: 'int' })
  accessLevel: number;

  @Column({ type: 'text', nullable: true })
  profileImage: string;

  @OneToMany(
    (type) => Post,
    (post) => post.memberId,
  )
  posts: Post[];
}