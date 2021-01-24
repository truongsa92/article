import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('comment')
export class CommentEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  article_id: number;

  @Column({ default: null})
  parent_id: number;

  @Column()
  content: string;

  @Column()
  nickname: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
}
