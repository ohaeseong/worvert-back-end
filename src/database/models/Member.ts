import { Entity, BaseEntity, PrimaryColumn, Column } from "typeorm";

// 사용자, 멤버 모델
@Entity()
export class Member extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50, unique: true })
  member_id: string;

  @PrimaryColumn({ type: 'varchar', length: 50 })
  member_name: string;

  @Column({ type: 'varchar', length: 1000 })
  pw: string;

  @Column({ type: 'int' })
  access_level: number;

  @Column({ type: 'text', nullable: true })
  profile_image: string;
}