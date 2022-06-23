import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HistoricoPedido, HistoricoPedidoSchema } from './historico.schema';
import { ProdutosPedido, ProdutosPedidoSchema } from './produtos-pedido.schema';
import { AbstractDocument, Usuario } from '@app/comum';

class Endereco {
  @Prop()
  logradouro: string;
  @Prop()
  bairro: string;
  @Prop()
  cep: string;
  @Prop()
  complemento: string;
}

@Schema({ versionKey: false, timestamps: true })
export class Pedido extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  usuarioID: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  restauranteID: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: [{ type: HistoricoPedidoSchema, ref: HistoricoPedido.name }] })
  historico_status: HistoricoPedido[];

  @Prop()
  endereco: Endereco;

  @Prop({ type: Number, default: 0 })
  preco_total: number;

  @Prop({ type: [{ type: ProdutosPedidoSchema, ref: ProdutosPedido.name }] })
  produtos: ProdutosPedido[];
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
