import { Logger } from '../../config/logger.config';
import { InstanceDto } from '../dto/instance.dto';

export class WebhookService {
  constructor() {}

  private readonly logger = new Logger(WebhookService.name);

  public create(instance: InstanceDto) {
    this.logger.verbose('create: ' + instance.instanceName);
    return { instance: { ...instance } };
  }

  public async find(instance: InstanceDto): Promise<InstanceDto> {
    try {
      this.logger.verbose('find webhook: ' + instance.instanceName);
      return null;
    } catch (error) {
      return null;
    }
  }
}
