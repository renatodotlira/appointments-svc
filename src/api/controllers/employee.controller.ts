import { Logger } from '../../config/logger.config';
import Employee from '../models/employee';

const logger = new Logger('EmployeeController');

export class EmployeeController {
  constructor() { }

  async getEmployeesByBusinessId(businessId: string) {
    try {
      const employees = await Employee.findAll({ where: { business_id: businessId } });
      return employees;
    } catch (error) {
      throw new Error('Error retrieving employees by business id: ' + error.message);
    }
  }

  async getAllEmployees() {
    try {
      const employees = await Employee.findAll();
      return employees;
    } catch (error) {
      throw new Error('Error retrieving all employees: ' + error.message);
    }
  }

}
