import { Logger } from '../../config/logger.config';
import Appointment from '../models/appointment';
import Employee from '../models/employee';
import User from '../models/user';
import Service from '../models/service';
import RelationAppointmentService from '../models/relationAppointmentService';
import { BadRequestException } from '../../exceptions/400.exception';
import { AppointmentDto } from '../dto/appointment.dto';
import { NotFoundException } from '../../exceptions';
import { Op, Sequelize } from 'sequelize';
import { startOfMonth, endOfMonth } from 'date-fns';

const logger = new Logger('AppointmentController');

export class AppointmentController {
  constructor() { }

  public async getAppointmentsByDate(date: any) {
    try {
      logger.info(`start method getAppointmentsByDate for date: ${date}`);

      const dts = date.split('-');
      var startOfDay;
      var endOfDay;

      if (date) {
        const dts = date.split('-');
        startOfDay = new Date(Date.UTC(dts[0], dts[1] - 1, dts[2], 0, 0, 0));
        endOfDay = new Date(Date.UTC(dts[0], dts[1] - 1, dts[2], 23, 59, 59));
      } else {
        
        const currentUtcDate = new Date();
        currentUtcDate.setHours(0, 0, 0, 0);
        startOfDay = new Date(Date.UTC(currentUtcDate.getUTCFullYear(), currentUtcDate.getUTCMonth(), currentUtcDate.getUTCDate(), 0, 0, 0));
        endOfDay = new Date(Date.UTC(currentUtcDate.getUTCFullYear(), currentUtcDate.getUTCMonth(), currentUtcDate.getUTCDate(), 23, 59, 59));
      }

      console.log(startOfDay.toISOString());
      console.log(endOfDay.toISOString());
      
      const appointments = await Appointment.findAll({
        where: {
          start: {
            [Op.between]: [startOfDay, endOfDay], 
          },
          status: "SCHEDULED",
        },
        include: [
          {
            model: Employee,
            as: 'employee',
          },
          {
            model: User,
            as: 'user',
          },
          {
            model: RelationAppointmentService,
            as: 'appointmentServices',
            include: [{ model: Service, as: 'service' }]
          }
        ],
        order: [['start', 'ASC']]
      });
      const appointmentsDto = appointments.map(appointment => new AppointmentDto(appointment));
      return appointmentsDto;
    } catch (error) {
      logger.error(`Error fetching appointments by date: ${error.message}`);
      throw new BadRequestException('Erro ao buscar agendamentos pela data informada.');
    }
  }

  public async getAllAppointments() {
    try {
      logger.info('start method getAllAppointments');
      const appointments = await Appointment.findAll({
        where: { status: "SCHEDULED" },
        include: [
          {
            model: Employee,
            as: 'employee',
          },
          {
            model: User,
            as: 'user',
          },
          {
            model: RelationAppointmentService,
            as: 'appointmentServices',
            include: [{ model: Service, as: "service" }]
          }
        ],
      });

      const appointmentsDto = appointments.map(appointment => new AppointmentDto(appointment));

      return appointmentsDto;

    } catch (error) {
      logger.error(error.message[0]);
      throw new BadRequestException(error.message[0]);
    }
  }

  public async deleteAppointment(id: number | string) {
    try {
      logger.info(`start method deleteAppointment for id: ${id}`);
      const appointment = await Appointment.findByPk(id);

      if (!appointment) {
        throw new NotFoundException('Agendamento não encontrado');
      }

      appointment.status = 'CANCELED';
      await appointment.save();

      logger.info(`Appointment with id ${id} updated to status CANCELED`);
      return { message: 'Agendamento cancelado com sucesso' };

    } catch (error) {
      logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  public async rescheduleAppointment(id: number | string, newDateTime: string) {
    try {
      logger.info(`start method rescheduleAppointment for id: ${id}`);

      const appointment = await Appointment.findOne({
        include: [
          {
            model: RelationAppointmentService,
            as: 'appointmentServices',
            include: [{ model: Service, as: "service" }]
          }
        ],
        where: { id: id }
      });

      if (!appointment) {
        throw new NotFoundException('Agendamento não encontrado');
      }
      const newStartTime = new Date(newDateTime);
      const appointmentDuration = appointment.duration;

      const conflictingAppointments = await Appointment.findAll({
        where: {
          employee_id: appointment.employee_id,
          status: 'SCHEDULED',
          start: {
            [Op.between]: [
              new Date(newStartTime.getTime() - appointmentDuration * 60 * 1000),
              new Date(newStartTime.getTime() + appointmentDuration * 60 * 1000)
            ]
          }
        }
      });

      if (conflictingAppointments.length > 0) {
        throw new BadRequestException(`O horário selecionado está em conflito com outro agendamento.`);
      }
      const { timeDisplay, timeEndDisplay } = updateAppointmentTime(appointment);
      appointment.time_display = timeDisplay;
      appointment.time_end_display = timeEndDisplay;
      appointment.start = newStartTime;
      await appointment.save();

      logger.info(`Appointment with id ${id} rescheduled successfully to ${newStartTime}`);
      return { message: 'Agendamento reagendado com sucesso' };

    } catch (error) {
      logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  public async getAppointmentsByMonth() {
    try {
      const today = new Date();
      const startOfCurrentMonth = startOfMonth(today);
      const endOfCurrentMonth = endOfMonth(today);

      const appointments = await Appointment.findAll({
        where: {
          start: {
            [Op.between]: [startOfCurrentMonth, endOfCurrentMonth],
          },
          status: "SCHEDULED",
        },
        include: [
          {
            model: Employee,
            as: 'employee',
            attributes: ['name']
          }
        ],
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('Appointment.start')), 'day'],
          'employee_id',
          [Sequelize.col('employee.name'), 'employeeName'],
          [Sequelize.fn('COUNT', Sequelize.col('Appointment.id')), 'numberOfAppointments'],
        ],
        group: ['day', 'employee_id', 'employee.name'],
        order: [[Sequelize.fn('DATE', Sequelize.col('Appointment.start')), 'ASC']],
        raw: true
      });

      const groupedAppointments = appointments.reduce((result, appointment) => {
        const day = appointment['day'];
        const employeeId = appointment['employee_id'];
        const employeeName = appointment['employeeName'];
        const numberOfAppointments = parseInt(appointment['numberOfAppointments'], 10);

        if (!result[day]) {
          result[day] = [];
        }

        const employeeInDay = result[day].find((item) => item.employeeId === employeeId);
        if (employeeInDay) {
          employeeInDay.numberOfAppointments += numberOfAppointments;
        } else {
          result[day].push({
            employeeId: employeeId,
            employeeName: employeeName,
            numberOfAppointments: numberOfAppointments
          });
        }

        return result;
      }, {});

      console.log(groupedAppointments);

      const response = Object.keys(groupedAppointments).map(day => ({
        day: day,
        appointmentsDay: groupedAppointments[day]
      }));

      return response;

    } catch (error) {
      console.error(error.message);
      throw new Error('Erro ao buscar agendamentos por mês');
    }
  }

}

const padToTwoDigits = (num: number): string => num.toString().padStart(2, '0');

const convertMinutesToHours = (minutes: number): { hours: number; remainingMinutes: number } => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return { hours, remainingMinutes };
};

const updateAppointmentTime = (appointment: Appointment): { timeDisplay: string; timeEndDisplay: string } => {
  console.log(appointment);
  const newDate = new Date(appointment.start.getTime());
  const [splitHours, splitMinutes] = appointment.time_display.split(":").map(Number);
  newDate.setHours(splitHours, splitMinutes, 0, 0);
  const timeDisplay = `${padToTwoDigits(splitHours)}:${padToTwoDigits(splitMinutes)}`;
  const endDateHour = new Date(newDate.getTime());
  const duration = appointment.appointmentServices[0].service.duration;
  const { hours, remainingMinutes } = convertMinutesToHours(duration);
  endDateHour.setHours(newDate.getHours() + hours, newDate.getMinutes() + remainingMinutes, 0, 0);
  const timeEndDisplay = `${padToTwoDigits(endDateHour.getHours())}:${padToTwoDigits(endDateHour.getMinutes())}`;
  return { timeDisplay, timeEndDisplay };
};

