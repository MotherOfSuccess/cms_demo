import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';
import { UserPermissionEntity } from './user-permission.entity';

@Entity('Permissions')
export class PermissionEntity extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'name', length: 100, nullable: false })
  name: string;

  @Column('varchar', {
    name: 'code',
    nullable: false,
    length: 10,
  })
  code: string;

  @OneToMany(
    () => UserPermissionEntity,
    (user_permissions) => user_permissions.permission,
  )
  user_permissions: UserPermissionEntity[];
}
