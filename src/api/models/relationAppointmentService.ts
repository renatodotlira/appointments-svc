import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../libs/database';
import Appointment from './appointment';
import Service from './service';

class RelationAppointmentService extends Model {
  [x: string]: any;
  public appointmentId!: number;
  public serviceId!: number;
}

RelationAppointmentService.init({
  appointmentId: {
    type: DataTypes.INTEGER,
    field: 'appointment_id',
    allowNull: false,
    references: { model: Appointment, key: 'id' }
  },
  serviceId: {
    type: DataTypes.INTEGER,
    field: 'service_id',
    allowNull: false,
    references: { model: Service, key: 'id' }
  }
}, {
  sequelize,
  tableName: 'appointment_service',
  timestamps: false,
});

Appointment.hasMany(RelationAppointmentService, {
  foreignKey: 'appointment_id',
  as: 'appointmentServices',
});

Service.hasMany(RelationAppointmentService, {
  foreignKey: 'service_id',
  as: 'relationAppointmentServices',
});

RelationAppointmentService.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

Appointment.belongsToMany(Service, { through: RelationAppointmentService, foreignKey: 'appointmentId' });
Service.belongsToMany(Appointment, { through: RelationAppointmentService, foreignKey: 'serviceId' });

export default RelationAppointmentService;
