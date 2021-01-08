import { Entity, BaseEntity, Column, PrimaryColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Comment } from './Comment';
import { Like } from './Like';
import { Member } from './Member';

// 게시글 모델 구성
@Entity()
export class Post extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 100, unique: true })
  id: string;

  @Column({ type: 'varchar', length: 50})
  title: string;

  @Column({ type: 'text'})
  contents: string;

  @Column({ type: 'text', nullable: true })
  thumbnailAddress: string;

  @Column({ type: 'varchar', nullable: true })
  series: string;

  @Column({ type: 'varchar', nullable: false })
  kinds: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  memberId: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createTime: string;

  @Column({ type: 'timestamp', nullable: true})
  updateTime: string;

  @OneToMany(
    (type) => Comment,
    (comment) => comment.post, { nullable: false },
  )
  comments!: Comment[];

  @OneToMany(
    (type) => Like,
    (like) => like.post, { nullable: false },
  )
  likes!: Like[];

  @ManyToOne(
    (type) => Member,
    (member) => member.memberId, { nullable: false },
  )
  @JoinColumn({
    name: 'memberId'
  })
  member: Member;
}