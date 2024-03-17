import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RootEntity } from './root.entity';
import { BannerEntity } from './banner.entity';
import { FileEntity } from './file.entity';
import { LanguageEntity } from './language.entity';

@Entity('BannerLanguages')
export class BannerLanguageEntity extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BannerEntity, (banner) => banner.banner_languages)
  @JoinColumn([{ name: 'bannerID', referencedColumnName: 'id' }])
  banner: BannerEntity | null;

  @Column('uuid', { name: 'bannerID', nullable: false })
  bannerID: string;

  @Column('varchar', { name: 'title', nullable: false, length: 500 })
  title: string;

  @Column('varchar', { name: 'slug', nullable: true, length: 255 })
  slug: string;

  @Column('uuid', { name: 'fileID', nullable: false })
  fileID: string;

  @Column('varchar', { name: 'languageCode', nullable: false, length: 50 })
  languageCode: string;

  @OneToOne(() => FileEntity, (file) => file.banner_language)
  @JoinColumn([{ name: 'fileID', referencedColumnName: 'id' }])
  file: FileEntity | null;

  @ManyToOne(() => LanguageEntity, (language) => language.code)
  @JoinColumn([{ name: 'languageCode', referencedColumnName: 'code' }])
  language: LanguageEntity | null;
}
