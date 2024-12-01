import { Logger } from '../config/logger.config';
import { InstanceController } from './controllers/instance.controller';
import { AppointmentController } from './controllers/appointment.controller';
import { EmployeeController } from './controllers/employee.controller';

const logger = new Logger('Appo - MODULE');

export const instanceController = new InstanceController();
export const appointmentController = new AppointmentController();
export const employeeController = new EmployeeController();

logger.info('Module - ON');
