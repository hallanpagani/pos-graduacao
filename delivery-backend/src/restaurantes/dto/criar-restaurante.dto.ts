import { IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Endereco {
  @ApiProperty()
  @IsNotEmpty()
  logradouro: string;

  @ApiProperty()
  @IsNotEmpty()
  bairro: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  complemento: string;
}

export class CriarRestauranteDTO {
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ type: String }) /* Obrigatorio para mostrar no swagger */
  nome: string;

  @MaxLength(100)
  @ApiProperty({ type: String })
  descricao: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ApiProperty({ type: Endereco })
  @Type(() => Endereco)
  endereco: Endereco;
}

/* 
export class BloquearUsuarioDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  UsuarioID: string;
} 

export class AdicionarRewiewDTO {
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  rating: number;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  comentario: string;
}
*/
