import { AbstractDocument } from '@app/comum/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Restaurante } from './restaurante.schema';

export type ProdutoDocument = Produto & Document;

@Schema({ versionKey: false })
export class Produto extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurante' })
  restauranteID: Restaurante;

  @Prop({ type: String })
  nome: string;

  @Prop({ type: String })
  descricao: string;

  @Prop({ type: String })
  imagem: string;

  @Prop({ type: Number, default: 0 })
  preco: number;

  @Prop({ type: Date, default: Date.now() })
  criado_em: Date;
}
export const ProdutoSchema = SchemaFactory.createForClass(Produto);
