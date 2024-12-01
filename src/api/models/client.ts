import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../libs/database';

// Definição do modelo de Client
class Client extends Model {
  public id!: number;
  public name!: string;
}

// Definir o modelo de Client com Sequelize
Client.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'client',
  timestamps: false
});

export default Client;

