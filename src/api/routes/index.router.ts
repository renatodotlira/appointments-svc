import { Router } from 'express';
import fs from 'fs';

import { Auth, configService } from '../../config/env.config';
import { InstanceRouter } from './instance.router';
import { AppointmentRouter } from './appointment.router';
import { EmployeeRouter } from './employee.router';
import sequelize from '../../libs/database';

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
  .get('/', async (req, res) => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Welcome my API, it is working!',
      version: packageJson.version,
   });
  })
  .use('/instance', new InstanceRouter(configService).router)
  .use('/appointment', new AppointmentRouter(configService).router)
  .use('/employee', new EmployeeRouter(configService).router)

export { HttpStatus, router };
