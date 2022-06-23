import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EfetuarLoginDTO {
  @IsEmail()
  @ApiProperty({ type: String })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  password: string;
}
