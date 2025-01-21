import { RequestHandler, Router } from 'express';
import { ConfigService } from '../../config/env.config';
import { Logger } from '../../config/logger.config';
import { RouterBroker } from '../abstract/abstract.router';
import { userController } from '../server.module';
import { HttpStatus } from './index.router';

const logger = new Logger('UserRouter');

export class UserRouter extends RouterBroker {
  constructor(readonly configService: ConfigService, ...guards: RequestHandler[]) {
    super();
    
    this.router
      .post('/login', ...guards, async (req, res) => {
        logger.info('start method login');
        const { userName, password } = req.body;
        logger.info(`userName: ${userName}, password: ${password}`)
        try {
          const response = await userController.login({userName, password});
          return res.status(HttpStatus.OK).json({ token: response});
        } catch (error) {
          logger.error(`Error in user login: ${error.message}`);
          return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
      })
      .post('/register', ...guards, async (req, res) => {
        logger.info('start method register');
        const { userName, password } = req.body;
        logger.info(`userName: ${userName}`)
        try {
          const response = await userController.register({userName, password});
          return res.status(HttpStatus.OK).json();
        } catch (error) {
          logger.error(`Error getting userAccount by business id: ${error.message}`);
          return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
      })
;

  }

  public readonly router = Router();
}
