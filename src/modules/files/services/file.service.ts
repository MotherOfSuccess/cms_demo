import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { FileEntity } from '../../../entities/file.entity';
import { LogService } from '../../log/services/log.service';
import { Levels } from '../../../constants/enums/levels.enum';
import { Methods } from '../../../constants/enums/methods.enum';

@Injectable()
export class FileService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    private logService: LogService,
  ) {}

  async add(
    file: FileEntity,
    manage?: EntityManager,
  ): Promise<FileEntity | null> {
    try {
      if (!manage) manage = this.dataSource.manager;
      const result = await manage.save(file);
      return result;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.ADD,
        'FileService.add()',
        error,
      );
      return null;
    }
  }

  async findByID(fileID: string): Promise<FileEntity | null> {
    try {
      const condition = this.fileRepository
        .createQueryBuilder('file')
        .where('deleted = :deleted', { deleted: false })
        .andWhere('id = :fileID', { fileID: fileID });
      return condition.getOne() || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.GET,
        'FileService.findByID()',
        error,
      );
      return null;
    }
  }

  async update(
    file: FileEntity,
    manage?: EntityManager,
  ): Promise<FileEntity | null> {
    try {
      if (!manage) manage = this.dataSource.manager;
      file = await manage.save(file);
      return file || null;
    } catch (error) {
      this.logService.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'FileService.update()',
        error,
      );
      return null;
    }
  }
}
