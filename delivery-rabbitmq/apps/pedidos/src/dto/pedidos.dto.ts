import {
  IsNotEmpty,
  Min,
  Max,
  IsInt,
  ValidateNested,
  NotEquals,
  //IsEnum,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { orderStatus } from '../helpers/pedidos';

const status = orderStatus.map((item) => item.status);

class ProdutoPedido {
  @ApiProperty()
  @IsNotEmpty()
  produtoID: string;

  @ApiProperty()
  @IsNotEmpty()
  nome_produto: string;

  @ApiProperty()
  @IsNotEmpty()
  img_produto: string;

  @ApiProperty({ type: Number, minimum: 0, maximum: 99 })
  preco: number;

  @ApiProperty({ type: Number, minimum: 0, maximum: 99 })
  @IsInt()
  @Min(1)
  @Max(99)
  quantidade: number;
}

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

export class CreatePedidoDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  restauranteID: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ApiProperty({ type: [ProdutoPedido] })
  @Type(() => ProdutoPedido)
  produtos: ProdutoPedido[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ApiProperty({ type: Endereco })
  @Type(() => Endereco)
  endereco: Endereco;
}

export class ChangePedidoStatusDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(status)
  @NotEquals('Solicitado')
  status: string;
}
