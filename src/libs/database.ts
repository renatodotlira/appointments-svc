import { Sequelize } from 'sequelize';
import { configService } from '../config/env.config';

console.log("carregando configs");
console.log(configService.get("DATABASE").HOST);
console.log(configService.get("DATABASE").DB_NAME);
console.log(configService.get("DATABASE").USER);
console.log(configService.get("DATABASE").PASSWORD);

const sequelize: Sequelize = new Sequelize(
  configService.get("DATABASE").DB_NAME, 
  configService.get("DATABASE").USER, 
  configService.get("DATABASE").PASSWORD,  
{
  host: configService.get("DATABASE").HOST,
  dialect: 'postgres',
  logging: false,
});

console.log(sequelize);
export default sequelize;
