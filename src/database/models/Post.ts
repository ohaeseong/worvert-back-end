import { Entity, BaseEntity, Column, PrimaryColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Comment } from './Comment';
import { Like } from './Like';
import { Member } from './Member';
import { Tag } from './Tag';

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

  @Column({ type: 'varchar', nullable: true })
  url: string;

  @Column({ type: 'varchar', nullable: true })
  intro: string;

  @Column({ type: 'varchar', nullable: true })
  kinds: string;

  @Column({ type: 'int', default: () => 0 })
  state: number;

  @Column({ type: 'varchar', nullable: true })
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

  @OneToMany(
    (type) => Tag,
    (tag) => tag.post, { nullable: true },
  )
  tags!: Tag[];

  @ManyToOne(
    (type) => Member,
    (member) => member.memberId, { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'memberId'
  })
  member: Member;
}