import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, MaxLength } from 'class-validator';

export class CriarRestauranteProdutoDTO {
  nome: string;
  descricao: string;
  imagem: string;
  preco: number;
}


export class restauranteID {
  restauranteID: string;
}
