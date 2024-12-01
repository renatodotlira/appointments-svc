import { RequestHandler, Router } from 'express';
import { ConfigService } from '../../config/env.config';
import { Logger } from '../../config/logger.config';
import { RouterBroker } from '../abstract/abstract.router';
import { employeeController } from '../server.module';
import { HttpStatus } from './index.router';

const logger = new Logger('EmployeeRouter');

export class EmployeeRouter extends RouterBroker {
  constructor(readonly configService: ConfigService, ...guards: RequestHandler[]) {
    super();
    
    this.router
      .get('/business/:businessId', ...guards, async (req, res) => {
        logger.info('start method getEmployeesByBusinessId');
        const { businessId } = req.params;

        try {
          const response = await employeeController.getEmployeesByBusinessId(businessId);
          return res.status(HttpStatus.OK).json(response);
        } catch (error) {
          logger.error(`Error getting employees by business id: ${error.message}`);
          return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
      })
      .get('', ...guards, async (req, res) => {
        logger.info('start method getAllEmployees');
        try {
          const response = await employeeController.getAllEmployees();
          return res.status(HttpStatus.OK).json(response);
        } catch (error) {
          logger.error(`Error getting all employees: ${error.message}`);
          return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
      });

  }

  public readonly router = Router();
}
