import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CriarUsuarioDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  nome: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  password: string;

  @IsEmail()
  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({
    type: Boolean,
    default: false /*description: ''*/,
  })
  dono: boolean;
}
