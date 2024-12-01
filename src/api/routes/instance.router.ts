import { RequestHandler, Router } from 'express';
import { Auth, ConfigService } from '../../config/env.config';
import { Logger } from '../../config/logger.config';
import { RouterBroker } from '../abstract/abstract.router';
import { InstanceDto } from '../dto/instance.dto';
import { instanceController, appointmentController } from '../server.module';
import { HttpStatus } from './index.router';

const logger = new Logger('InstanceRouter');

export class InstanceRouter extends RouterBroker {
  constructor(readonly configService: ConfigService, ...guards: RequestHandler[]) {
    super();
    const auth = configService.get<Auth>('AUTHENTICATION');
    this.router
      .post('/create', ...guards, async (req, res) => {
        logger.verbose('request received in createInstance');
        logger.verbose('request body: ');
        logger.verbose(req.body);
        const response = await this.dataValidate<InstanceDto>({
          request: req,
          schema: null,
          ClassRef: InstanceDto,
          execute: (instance) => instanceController.createInstance(instance),
        });

        return res.status(HttpStatus.CREATED).json(response);
      })
  }

  public readonly router = Router();
}
