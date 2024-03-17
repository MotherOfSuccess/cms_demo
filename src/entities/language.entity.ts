import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';
import { BannerLanguageEntity } from './banner_language.entity';

@Entity('Languages')
export class LanguageEntity extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    name: 'code',
    nullable: false,
    length: 50,
    unique: true,
  })
  code: string;

  @Column('varchar', { name: 'name', nullable: false, length: 255 })
  name: string;

  @Column('boolean', { name: 'status', nullable: false, default: true })
  status: boolean;

  @Column('varchar', { name: 'slug', nullable: true, length: 255 })
  slug: string;

  @OneToMany(
    () => BannerLanguageEntity,
    (banner_language) => banner_language.language,
  )
  banner_language: BannerLanguageEntity;
}
