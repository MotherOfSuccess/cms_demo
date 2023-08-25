import { Column, Entity } from 'typeorm';

@Entity()
export class RootEntity {
  @Column('timestamp without time zone', {
    name: 'createAt',
    default: Date.now(),
    nullable: false,
  })
  createAt: Date;

  @Column('timestamp without time zone', { name: 'updateAt', nullable: true })
  updateAt: Date;

  @Column('timestamp without time zone', { name: 'deleteAt', nullable: true })
  deleteAt: Date;

  @Column('boolean', { name: 'deleted', nullable: false, default: false })
  deleted: boolean;
}
