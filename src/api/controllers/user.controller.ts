import { Logger } from '../../config/logger.config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestException } from '../../exceptions';
import { UserLoginDto } from '../dto/userLogin.dto';
import UserAccount from '../models/userAccount';
import { configService } from '../../config/env.config';
import { EmailService } from '../services/email.service';
import Business from '../models/business';

export class UserController {
  constructor(private readonly emailService: EmailService) {}

  private readonly logger = new Logger(UserController.name);

  public async login(userLogin: UserLoginDto) {
    try {
      this.logger.info('requested login');
      const userAccount = await UserAccount.findOne({ 
        where: { email: userLogin.userName},
        include: [
          {
            model: Business,
            as: 'business',
          }]
      });
      if (!userAccount) {
        throw new BadRequestException("Usuário não encontrado.");
      }
      const isValid = await bcrypt.compare(userLogin.password, userAccount.password);
      if (!isValid) {
        throw new BadRequestException("Senha inválida.");
      }

      const token = jwt.sign({ userAccountId: userAccount.id, business_id: userAccount.business.id }, configService.get("AUTHENTICATION").JWT.SECRET, {
        expiresIn: configService.get("AUTHENTICATION").JWT.EXPIRIN_IN,
      });
      console.log(token);
      return token;

    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }

  public async register(userLogin: UserLoginDto) {
    try {
      this.logger.info('requested register');
      const userAccount = await UserAccount.findOne({ where: { email: userLogin.userName}});
      if (userAccount) {
        throw new BadRequestException("Usuário já existe com o email informado.");
      }
      const passwordEncrypted = await bcrypt.hash(userLogin.password, 10);
      UserAccount.create({  email: userLogin.userName, password: passwordEncrypted});
      this.emailService.sendEmail(userLogin.userName);
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
