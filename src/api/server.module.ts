import { Logger } from '../config/logger.config';
import { InstanceController } from './controllers/instance.controller';
import { AppointmentController } from './controllers/appointment.controller';
import { EmployeeController } from './controllers/employee.controller';
import { UserController } from './controllers/user.controller';
import { EmailService } from './services/email.service';

const logger = new Logger('Appo - MODULE');

export const instanceController = new InstanceController();
export const appointmentController = new AppointmentController();
export const emailService = new EmailService();
export const employeeController = new EmployeeController();
export const userController = new UserController(emailService);

logger.info('Module - ON');
