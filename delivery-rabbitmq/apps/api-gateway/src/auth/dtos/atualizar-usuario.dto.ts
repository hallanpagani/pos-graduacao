import { PartialType } from '@nestjs/swagger';
import { CriarUsuarioDTO } from './criar-usuario.dto';

export class AtualizarUsuarioDto extends PartialType(CriarUsuarioDTO) {}
