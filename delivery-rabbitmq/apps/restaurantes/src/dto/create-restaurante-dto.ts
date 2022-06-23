import { IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Endereco {
  logradouro: string;
  bairro: string;
  cep: string;
  complemento: string;
}

export class CriarRestauranteDTO {
  nome: string;
  descricao: string;
  endereco: Endereco;
}

export class AtualizarRestaurante {
  nome: string;
  descricao: string;
  endereco: Endereco;
}

