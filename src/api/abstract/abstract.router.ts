import 'express-async-errors';

import { Request } from 'express';
import { JSONSchema7 } from 'json-schema';
import { validate } from 'jsonschema';

import { Logger } from '../../config/logger.config';
import { BadRequestException } from '../../exceptions';
import { InstanceDto } from '../dto/instance.dto';

type DataValidate<T> = {
  request: Request;
  schema: JSONSchema7;
  ClassRef: any;
  execute: (data: T) => Promise<any>;
};

const logger = new Logger('Validate');

export abstract class RouterBroker {
  constructor() {}
  public routerPath(path: string, param = true) {
    let route = '/' + path;
    param ? (route += '/:instanceName') : null;

    return route;
  }

  public async dataValidate<T>(args: DataValidate<T>) {
    const { request, schema, ClassRef, execute } = args;

    const ref = new ClassRef();
    const body = request.body;
    const instance = request.params as unknown as InstanceDto;

    if (request?.query && Object.keys(request.query).length > 0) {
      Object.assign(instance, request.query);
    }

    if (request.originalUrl.includes('/instance/create')) {
      Object.assign(instance, body);
    }

    Object.assign(ref, body);

    const v = schema ? validate(ref, schema) : { valid: true, errors: [] };

    if (!v.valid) {
      const message: any[] = v.errors.map(({ stack, schema }) => {
        let message: string;
        if (schema['description']) {
          message = schema['description'];
        } else {
          message = stack.replace('instance.', '');
        }
        return message;
      });
      logger.error(message);
      throw new BadRequestException(message);
    }

    return await execute(ref);
  }

  public async appointmentValidate<T>(args: DataValidate<T>) {
    const { request, ClassRef, schema, execute } = args;

    const body = request.body;

    const ref = new ClassRef();

    Object.assign(ref, body);

    const v = validate(ref, schema);

    if (!v.valid) {
      const message: any[] = v.errors.map(({ property, schema }) => {
        let message: string;
        if (schema['description']) {
          message = schema['description'];
        }
        return {
          property: property,
          message,
        };
      });
      logger.error([...message]);
      throw new BadRequestException(...message);
    }

    return await execute(ref);
  }
}
