import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../libs/database';

class Service extends Model {
  public id!: number;
  public name!: string;
  public price?: number;
  public duration?: number;
}

Service.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'service',
  timestamps: false
});

export default Service;
