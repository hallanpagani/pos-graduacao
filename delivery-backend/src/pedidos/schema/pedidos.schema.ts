import { AbstractDocument } from 'src/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Usuario } from 'src/auth/schema/usuario.schema';
import { Restaurante } from 'src/restaurantes/schema/restaurante.schema';
import { HistoricoPedido, HistoricoPedidoSchema } from './historico.schema';
import { ProdutosPedido, ProdutosPedidoSchema } from './produtos-pedido.schema';

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

export type PedidoDocument = Pedido & Document; 

@Schema({ versionKey: false, timestamps: true })
export class Pedido extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  usuarioID: Usuario;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurante' })
  restauranteID: Restaurante;

  @Prop({ type: String })
  status: string;

  @Prop({ type: [{ type: HistoricoPedidoSchema, ref: HistoricoPedido.name }] })
  historico_status: HistoricoPedido[];

  @Prop()
  endereco: Endereco;

  @Prop({ type: Number, default: 0 })
  preco_total: number;

  @Prop( { type: [{ type: ProdutosPedidoSchema, ref: ProdutosPedido.name }] })
  produtos: ProdutosPedido[];
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);

