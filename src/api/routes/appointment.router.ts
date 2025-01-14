import { RequestHandler, Router } from 'express';
import { ConfigService } from '../../config/env.config';
import { Logger } from '../../config/logger.config';
import { RouterBroker } from '../abstract/abstract.router';
import { appointmentController } from '../server.module';
import { HttpStatus } from './index.router';

const logger = new Logger('AppointmentRouter');

export class AppointmentRouter extends RouterBroker {
  constructor(readonly configService: ConfigService, ...guards: RequestHandler[]) {
    super();
    //const auth = configService.get<Auth>('AUTHENTICATION');
    this.router
      .get('/date', ...guards, async (req, res) => {
        logger.info('start method getAppointmentsByDate');
        const { date } = req.query;  // Recebe a data como parâmetro de consulta
        try {
          const response = await appointmentController.getAppointmentsByDate(date); // Chama o método do controller
          return res.status(HttpStatus.OK).json(response);
        } catch (error) {
          logger.error(`Error getting appointments by date: ${error.message}`);
          return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
      })
      .get('', ...guards, async (req, res) => {
        logger.info('start method getAppointments');
        const response = await appointmentController.getAllAppointments();
        return res.status(HttpStatus.CREATED).json(response);
      })
      .delete('/:id', ...guards, async (req, res) => {
        logger.info('start method deleteAppointment');
        const { id } = req.params;

        try {
          const response = await appointmentController.deleteAppointment(id);
          return res.status(HttpStatus.OK).json(response);
        } catch (error) {
          logger.error(`Error deleting appointment: ${error.message}`);
          return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
      })
      .put('/:id/reschedule', ...guards, async (req, res) => {
        logger.info('start method rescheduleAppointment');
        const { id } = req.params;
        const { newDateTime, employeeId } = req.body;

        try {
          const response = await appointmentController.rescheduleAppointment(id, employeeId, newDateTime);
          return res.status(HttpStatus.OK).json(response);
        } catch (error) {
          logger.error(`Error rescheduling appointment: ${error.message}`);
          return res.status(HttpStatus.BAD_REQUEST).json({
            code: "01",
            message: error.message
          });
        }
      })
      .post('/book', ...guards, async (req, res) => {
        logger.info('start method bookAppointment');
        const { dateTimeStart, dateTimeEnd, employeeId } = req.body;

        try {
          const response = await appointmentController.bookAppointment(employeeId, dateTimeStart, dateTimeEnd);
          return res.status(HttpStatus.OK).json(response);
        } catch (error) {
          logger.error(`Error rescheduling appointment: ${error.message}`);
          return res.status(HttpStatus.BAD_REQUEST).json({
            code: "01",
            message: error.message
          });
        }
      })
      .get('/month/:month', async (req, res) => {
        try {
          const { month } = req.params;
          const response = await appointmentController.getAppointmentsByMonth(Number.parseInt(month));
          return res.status(200).json(response);
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      });

  }

  public readonly router = Router();
}
