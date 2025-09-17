import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { type ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import jwtConfig from '../../config/jwt.config';
import { JwtPayload } from '../../types/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      private authService: AuthService,
      @Inject(jwtConfig.KEY)
      private readonly config: ConfigType<typeof jwtConfig>,
   ) {
      if (!config.secret) {
         throw new HttpException('JWT secret is not defined', 500);
      }

      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: config.secret,
         ignoreExpiration: false,
      });
   }

   async validate(payload: JwtPayload) {
      return this.authService.validateJwtUser(payload.sub);
   }
}
