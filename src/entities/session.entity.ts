import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';

@Entity('Sessions')
export class SessionEntity extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'userID', nullable: false, unique: true })
  userID: string;

  @Column('varchar', { name: 'refreshToken', length: 1000, nullable: true })
  refreshToken: string;

  @Column('varchar', { name: 'accessToken', length: 1000, nullable: true })
  accessToken: string;

  @Column('timestamp without time zone', { name: 'loginAt', nullable: false })
  loginAt: Date;

  @Column('timestamp without time zone', { name: 'aTExpireAt', nullable: true })
  aTExpireAt: Date;

  @Column('timestamp without time zone', { name: 'logoutAt', nullable: true })
  logoutAt: Date;
}
