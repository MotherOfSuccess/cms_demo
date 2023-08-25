import { entities } from '../entities';
import { Configuration } from '../modules/shared/constants/configuration.enum';
import { ConfigurationService } from '../modules/shared/services/configuration/configuration.service';

export const postgresqlFactory = async (
  configurationService: ConfigurationService,
) => ({
  type: configurationService.get(Configuration.POSTGRESQL_TYPE) as 'postgres',
  host: configurationService.get(Configuration.POSTGRESQL_HOST),
  port: parseInt(configurationService.get(Configuration.POSTGRESQL_PORT)),
  database: configurationService.get(Configuration.POSTGRESQL_DATABASE_NAME),
  username: configurationService.get(Configuration.POSTGRESQL_USERNAME),
  password: configurationService.get(Configuration.POSTGRESQL_PASSWORD),
  entities: entities,
});
