import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../libs/database';
import Employee from './employee';
import Client from './client';
import User from './user';
import RelationAppointmentService from './relationAppointmentService';

// Definição do modelo de Appointment
class Appointment extends Model {
    public id!: number;
    public start!: Date;
    public end!: Date;
    public duration?: number;
    public employee_id!: number;
    public client_id!: number;
    public user_id!: number;
    public time_display?: string;
    public time_end_display?: string;
    public appointmentServices?: RelationAppointmentService;
    public user?: User;
    public employee?: Employee;
    public status?: string;
    public resourceId?: string;
}

// Definir o modelo de Appointment com Sequelize
Appointment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER
    },
    employee_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'id'
        }
    },
    client_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Client,
            key: 'id'
        }
    },
    time_display: {
        type: DataTypes.STRING,
        allowNull: true
    },
    time_end_display: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING
    },
    resourceId: {
        type: DataTypes.STRING,
        field: "resource_id"
    }
}, {
    sequelize,
    tableName: 'appointment',
    timestamps: false
});

// Relações entre modelos
Employee.hasMany(Appointment, {
    foreignKey: 'employee_id',
    as: 'appointments',
});
Appointment.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

Client.hasMany(Appointment, {
    foreignKey: 'client_id',
    as: 'appointments',
});
Appointment.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

User.hasMany(Appointment, {
    foreignKey: 'user_id',
    as: 'appointments',
});
Appointment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Appointment;
