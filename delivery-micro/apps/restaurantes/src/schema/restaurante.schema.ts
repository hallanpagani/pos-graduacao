import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AbstractDocument } from '@app/comum/database/abstract.schema';
import { Usuario } from '@app/comum/interfaces/usuarios.interface';
/*import { Produto, ProdutoSchema } from 'src/produtos/schema/produto.schema';*/

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

@Schema({ versionKey: false })
export class Restaurante extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  donoID: Usuario;
  @Prop()
  nome: string;
  @Prop()
  descricao: string;
  @Prop()
  endereco: Endereco;
}

export const RestauranteSchema = SchemaFactory.createForClass(Restaurante);
