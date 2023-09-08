import { IsOptional } from 'class-validator';

export class UpdateSessionDto {
  @IsOptional()
  refreshToken: string;

  @IsOptional()
  accessToken: string;
}
