import { PassportStrategy } from '@nestjs/passport';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Configuration } from '../../shared/constants/configuration.enum';
import { JwtPayload } from '../interfaces/payload/jwt-payload.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configurationService: ConfigurationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurationService.get(Configuration.ACCESS_SECRET_KEY),
    });
  }
  validate(payload: JwtPayload) {
    return payload;
  }
}
