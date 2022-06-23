import { ObjectID } from 'bson';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
//import { Produto } from 'src/restaurantes/schema/produto.schema';

@Schema({ versionKey: false, _id: false })
export class ProdutosPedido {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  produtoID: ObjectID;

  @Prop({ type: String })
  nome_produto: string;

  @Prop({ type: String })
  img_produto: string;

  @Prop({ type: Number, default: 0 })
  preco: number;

  @Prop({ type: Number, default: 0 })
  quantidade: number;
}

export const ProdutosPedidoSchema =
  SchemaFactory.createForClass(ProdutosPedido);
