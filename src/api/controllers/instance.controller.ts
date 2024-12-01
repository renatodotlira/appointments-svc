import { Logger } from '../../config/logger.config';
import { BadRequestException } from '../../exceptions';
import { InstanceDto } from '../dto/instance.dto';

export class InstanceController {
  constructor() {}

  private readonly logger = new Logger(InstanceController.name);

  public async createInstance({}: InstanceDto) {
    try {
      this.logger.info('requested createInstance from instance');
    } catch (error) {
      this.logger.error(error.message[0]);
      throw new BadRequestException(error.message[0]);
    }
  }
}
