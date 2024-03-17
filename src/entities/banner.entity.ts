import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';
import { BannerLanguageEntity } from './banner_language.entity';

@Entity('Banners')
export class BannerEntity extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp without time zone', { name: 'startAt', nullable: false })
  startAt: Date;

  @Column('timestamp without time zone', { name: 'endAt', nullable: false })
  endAt: Date;

  @Column('boolean', { name: 'status', nullable: false, default: true })
  status: boolean;

  @OneToMany(
    () => BannerLanguageEntity,
    (banner_languages) => banner_languages.banner,
  )
  banner_languages: BannerLanguageEntity[];
}
