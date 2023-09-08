import { JwtService } from '@nestjs/jwt';
import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { Configuration } from '../../../shared/constants/configuration.enum';

export const generateRefreshToken = async (
  userID: string,
  username: string,
  jwtService: JwtService,
  configurationService: ConfigurationService,
) => {
  const payload = await { userID, username };

  const refreshToken = await jwtService.signAsync(payload, {
    secret: configurationService.get(Configuration.REFRESH_SECRET_KEY),
    expiresIn: configurationService.get(Configuration.REFRESH_TOKEN_EXPIRESIN),
  });

  return refreshToken;
};

export const generateAccessToken = async (
  userID: string,
  username: string,
  refreshToken: string,
  jwtService: JwtService,
  configuationService: ConfigurationService,
) => {
  const payload = { userID, username, refreshToken };
  const accessToken = await jwtService.signAsync(payload, {
    secret: configuationService.get(Configuration.ACCESS_SECRET_KEY),
    expiresIn: configuationService.get(Configuration.ACCESS_TOKEN_EXPIRESIN),
  });
  return accessToken;
};

export const generateTokens = async (
  userID: string,
  username: string,
  jwtService: JwtService,
  configuationService: ConfigurationService,
): Promise<Record<string, string>> => {
  const refreshToken = await generateRefreshToken(
    userID,
    username,
    jwtService,
    configuationService,
  );
  const accessToken = await generateAccessToken(
    userID,
    username,
    refreshToken,
    jwtService,
    configuationService,
  );

  return { refreshToken, accessToken };
};
