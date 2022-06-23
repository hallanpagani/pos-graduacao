import { AbstractDocument } from 'src/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Restaurante } from 'src/restaurantes/schema/restaurante.schema';

export type RestauranteDocument = Restaurante & Document;

@Schema({ versionKey: false })
export class Produto extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurante' })
  restauranteID: Restaurante;

  @Prop()
  nome: string;

  @Prop()
  descricao: string;

  @Prop()
  imagem: string;

  @Prop({ type: Number, default: 0 })
  preco: number;

  @Prop({ type: Date, default: Date.now() })
  criado_em: Date;
}
export const ProdutoSchema = SchemaFactory.createForClass(Produto);
