import { DataTypes, Model } from 'sequelize';
import sequelize from '../../libs/database';

class Business extends Model {
  public id!: number;
  public name!: string;
}

Business.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  tableName: 'business',
  timestamps: false
});

export default Business;
