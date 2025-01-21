import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../libs/database';

// Definição do modelo de User
class UserAccount extends Model {
  public id!: number;
  public phoneNumber!: string;
  public email!: string
  public password!: string;
}

UserAccount.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'user_account',
  timestamps: false
});

export default UserAccount;
