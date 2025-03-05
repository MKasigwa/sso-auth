import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class OAuthClient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  redirectUrl: string;
}
