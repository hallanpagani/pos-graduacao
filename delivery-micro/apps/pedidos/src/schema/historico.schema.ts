//import { AbstractDocument } from '@app/comum/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import mongoose from 'mongoose';

@Schema({ versionKey: false, _id: false })
export class HistoricoPedido {
  @Prop({ type: String, default: '' })
  status: string;

  @Prop({ type: Date, default: Date.now() })
  criado_em: Date;
}
export const HistoricoPedidoSchema =
  SchemaFactory.createForClass(HistoricoPedido);
