import { Entity, BaseEntity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Comment } from './Comment';
import { Like } from './Like';

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
  thumbnail_address: string;

  @Column({ type: 'varchar', nullable: true })
  series: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  writer: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  create_time: string;

  @Column({ type: 'timestamp', nullable: true})
  update_time: string;

  @OneToMany(
    (type) => Comment,
    (comment) => comment.post_id,
  )
  comments!: Comment[];

  @OneToMany(
    (type) => Like,
    (like) => like.post_id,
  )
  likes!: Like[];
}