import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';
import { UserPermissionEntity } from './user-permission.entity';

@Entity('Users')
export class UserEntity extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    name: 'username',
    nullable: false,
    length: 20,
  })
  username: string;

  @Column('varchar', { name: 'password', nullable: false, length: 500 })
  password: string;

  @Column('boolean', { name: 'status', nullable: false, default: true })
  status: boolean;

  @OneToMany(
    () => UserPermissionEntity,
    (user_permissions) => user_permissions.user,
  )
  user_permissions: UserPermissionEntity[];
}
