import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RootEntity } from './root.entity';
import { UserEntity } from './user.entity';
import { PermissionEntity } from './permission.entity';

@Entity('UserPermissions')
export class UserPermissionEntity extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id', nullable: false })
  user_id: string;

  @Column('uuid', { name: 'permission_id', nullable: false })
  permission_id: string;

  @Column('boolean', { name: 'allowed', nullable: false, default: true })
  allowed: boolean;

  @ManyToOne(() => UserEntity, (user) => user.user_permissions)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity | null;

  @ManyToOne(
    () => PermissionEntity,
    (permission) => permission.user_permissions,
  )
  @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
  permission: PermissionEntity | null;
}
