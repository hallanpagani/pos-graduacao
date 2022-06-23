import { PartialType } from '@nestjs/swagger';
import { AtualizarRestaurante, CriarRestauranteDTO } from './create-restaurante-dto';

export class AtualizarRestauranteDTO extends PartialType(CriarRestauranteDTO) {}
