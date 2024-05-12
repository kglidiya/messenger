import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthorizationEntity } from './authorization.entity';
import genTokenPair from '../middleware/genTokenPair';
import { verifyToken } from '../middleware/jwtMiddleware';
import { IAvatar } from './interfaces';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  userName: string;
  avatar: string | null;
  email: string;
  // recoveryCode: null | number;
}
let recoveryCode: number;

@Injectable()
export class AuthorizationService {
  constructor(
    private configService: ConfigService,
    private readonly mailerService: MailerService,
    @InjectRepository(AuthorizationEntity)
    private readonly usersRepository: Repository<AuthorizationEntity>,
  ) {}

  async registration(registerData: AuthorizationEntity): Promise<any> {
    const findDuplicateEmail = await this.usersRepository.find({
      where: { email: registerData.email },
    });

    if (findDuplicateEmail.length !== 0) {
      throw new BadRequestException({
        key: 'User with this email already exist',
      });
    }
    const hash = await bcrypt.hash(registerData.password, 5);
    const newUser = {
      ...registerData,
      email: registerData.email,
      password: hash,
      userName: registerData.userName,
      avatar: registerData.avatar,
    };
    // console.log(newUser);
    const createNewUser = this.usersRepository.create(newUser);
    // console.log(createNewUser);
    const user = await this.usersRepository.save(createNewUser);
    // console.log(user);
    const tokenPair = genTokenPair(user.id);
    const { password, recoveryCode, ...rest } = user;

    const { accessToken, refreshToken } = tokenPair;
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      ...rest,
    };
  }

  async login(loginData: AuthorizationEntity): Promise<LoginResponse> {
    const findRegisteredUser = await this.usersRepository.find({
      where: { email: loginData.email },
      // relations: ['avatar'],
    });
    // console.log(findRegisteredUser);
    if (findRegisteredUser.length !== 0) {
      const validPassword = bcrypt.compareSync(
        loginData.password,
        findRegisteredUser[0].password,
      );
      if (validPassword) {
        const tokenPair = genTokenPair(findRegisteredUser[0].id);
        const { accessToken, refreshToken } = tokenPair;
        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: findRegisteredUser[0].id,
          userName: findRegisteredUser[0].userName,
          email: findRegisteredUser[0].email,
          avatar: findRegisteredUser[0].avatar,
          // recoveryCode: findRegisteredUser[0].recoveryCode,
        };
      } else {
        throw new BadRequestException({ key: 'Неверный пароль!' });
      }
    } else {
      throw new ForbiddenException('Пользователь не зарегистирован');
    }
  }

  async refresh(token: string): Promise<string[]> {
    const validToken = verifyToken(token);
    if (validToken) {
      const tPair = genTokenPair(validToken.id);
      return [tPair.accessToken, tPair.refreshToken];
    } else {
      return ['403'];
    }
  }

  async findOneByEmail(email: string): Promise<any> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findOneByRecoveryCode(code: number): Promise<any> {
    return await this.usersRepository.findOne({
      where: { recoveryCode: code },
    });
  }

  async forgotpassword(email: string): Promise<any> {
    const user = await this.findOneByEmail(email);
    recoveryCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    if (!user) throw new BadRequestException('Пользователь не найден');
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: this.configService.get<string>('MAILDEV_INCOMING_USER'),
        subject: 'Восстановление пароля',
        text: 'Ваш код для восстановления пароля',
        html: `<b>Ваш код для восстановления пароля</b>
               <b>${recoveryCode}</b>`,
      });
      return await this.usersRepository.update(user.id, { recoveryCode });
      // return await this.usersRepository.findOne({
      //   where: { id: user.id },
      // });
    } catch (e) {
      console.log(e);
    }
  }

  async resetPassword(recoveryCode: number, password: string): Promise<any> {
    if (recoveryCode) {
      const user = await this.findOneByRecoveryCode(recoveryCode);
      if (!user) {
        throw new BadRequestException('Введен некорректный код');
      }
      // if (password) {
      //   const hash = await bcrypt.hash(password, 5);
      // }
      try {
        const updatedData = await this.usersRepository
          .createQueryBuilder('users')
          .update<AuthorizationEntity>(AuthorizationEntity, {
            ...user,
            password: await bcrypt.hash(password, 5),
          })
          .where({ id: user.id })
          .returning('*')
          .updateEntity(true)
          .execute();
        return updatedData.raw;
      } catch (error) {
        if (error.code == 23505) {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
  }
}
