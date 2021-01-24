import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('article')
export class ArticleEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  nickname: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;
}
