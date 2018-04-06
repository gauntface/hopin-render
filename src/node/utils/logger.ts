import {factory, Logger} from '@hopin/logger';

export const logger: Logger = factory.getLogger('example-project', {
  prefix: 'hopin-render',
});
