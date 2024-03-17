import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';
import { BannerLanguageEntity } from './banner_language.entity';

@Entity('Files')
export class FileEntity extends RootEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'originalName', nullable: false, length: 255 })
  originalName: string;

  @Column('varchar', { name: 'fileName', nullable: false, length: 255 })
  fileName: string;

  @Column('varchar', { name: 'path', nullable: false, length: 255 })
  path: string;

  @Column('varchar', { name: 'url', nullable: false, length: 255 })
  url: string;

  @Column('varchar', { name: 'extention', nullable: false, length: 50 })
  extention: string;

  @Column('boolean', { name: 'drafted', nullable: false, default: false })
  drafted: boolean;

  @OneToOne(
    () => BannerLanguageEntity,
    (banner_language) => banner_language.file,
  )
  banner_language: BannerLanguageEntity;
}
