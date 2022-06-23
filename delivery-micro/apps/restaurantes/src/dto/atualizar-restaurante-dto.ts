import { PartialType } from '@nestjs/swagger';
import { CriarRestauranteDTO } from './create-restaurante-dto';
// importar PartialType de '@nestjs/swagger' mostrar o DTO na documentação

export class AtualizarRestauranteDTO extends PartialType(CriarRestauranteDTO) {}
