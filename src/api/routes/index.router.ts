import { Router } from 'express';
import fs from 'fs';

import { Auth, configService } from '../../config/env.config';
import { InstanceRouter } from './instance.router';
import { AppointmentRouter } from './appointment.router';
import { EmployeeRouter } from './employee.router';

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NOT_FOUND = 404,
  FORBIDDEN = 403,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}

const router = Router();
const serverConfig = configService.get('SERVER');

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

router
  .get('/', (req, res) => {
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Welcome my API, it is working!',
      version: packageJson.version,
      swagger: !serverConfig.DISABLE_DOCS ? `${req.protocol}://${req.get('host')}/docs` : undefined,
      manager: !serverConfig.DISABLE_MANAGER ? `${req.protocol}://${req.get('host')}/manager` : undefined,
    });
  })
  .use('/instance', new InstanceRouter(configService).router)
  .use('/appointment', new AppointmentRouter(configService).router)
  .use('/employee', new EmployeeRouter(configService).router)

export { HttpStatus, router };
