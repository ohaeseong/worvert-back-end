import { Entity, BaseEntity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Post } from "./Post";
import { ReplyComment } from "./ReplyComment";

// 사용자, 멤버 모델
@Entity()
export class Member extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50, unique: true })
  memberId: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  githubId: string;

  @Column({ type: 'varchar', length: 50 })
  memberName: string;

  @Column({ type: 'varchar', length: 1000 })
  pw: string;

  @Column({ type: 'int' })
  accessLevel: number;

  @Column({ type: 'text', nullable: true })
  profileImage: string;

  @Column({ type: 'text', nullable: true })
  introduce: string;

  @OneToMany(
    (type) => Post,
    (post) => post.memberId,
  )
  posts: Post[];

  @OneToMany(
    (type) => Comment,
    (comment) => comment.memberId,
  )
  comments: Comment[];


  @OneToMany(
    (type) => ReplyComment,
    (comment) => comment.memberId,
  )
  replyComments: ReplyComment[];


  @OneToMany(
    (type) => Like,
    (like) => like.memberId,
  )
  likes: Like[];
}