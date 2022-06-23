import { CriarRestauranteDTO } from './criar-restaurante.dto';
import { PartialType } from '@nestjs/swagger';
// importar PartialType de '@nestjs/swagger' mostrar o DTO na documentação

export class AtualizarRestauranteDTO extends PartialType(CriarRestauranteDTO) {}
