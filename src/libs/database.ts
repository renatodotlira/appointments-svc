import { Sequelize } from 'sequelize';
import { configService, Database } from '../config/env.config';

console.log("carregando configs");
console.log(configService.get("DATABASE").PASSWORD);

const sequelize: Sequelize = new Sequelize(
  configService.get("DATABASE").DB_NAME, 
  configService.get("DATABASE").USER, 
  configService.get("DATABASE").PASSWORD,  
{
  host: configService.get("DATABASE").HOST,
  dialect: 'postgres',
});

export default sequelize;
