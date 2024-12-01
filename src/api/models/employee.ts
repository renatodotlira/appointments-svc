import { DataTypes, Model } from 'sequelize';
import sequelize from '../../libs/database';
import Business from './business';

class Employee extends Model {
  public id!: number;
  public name!: string;
  public business_id!: number;
}

Employee.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  business_id: {
    type: DataTypes.INTEGER,
    references: {
        model: Business,
        key: 'id'
    }
},
}, {
  sequelize,
  tableName: 'employee',
  timestamps: false
});

export default Employee;
