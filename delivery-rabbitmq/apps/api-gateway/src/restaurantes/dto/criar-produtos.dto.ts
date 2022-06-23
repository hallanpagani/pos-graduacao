import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, MaxLength } from 'class-validator';

export class CriarRestauranteProdutoDTO {
   @IsNotEmpty()
   @MaxLength(50)
   @ApiProperty({ type: String })
  nome: string;

  @ApiProperty({ type: String })
   @MaxLength(100)
  descricao: string;

  @ApiProperty({ type: String })
  imagem: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number })
  preco: number;
}
