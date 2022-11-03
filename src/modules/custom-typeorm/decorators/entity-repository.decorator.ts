/* eslint-disable @typescript-eslint/ban-types */
import { SetMetadata } from '@nestjs/common';

export const ENTITY_REPOSITORY = 'entity_repository';

export const EntityRepository = (entity: Function) =>
  SetMetadata(ENTITY_REPOSITORY, entity);
