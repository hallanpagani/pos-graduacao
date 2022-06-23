import { AbstractDocument } from 'src/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Usuario } from 'src/auth/schema/usuario.schema';

class Endereco {
  @Prop({ type: String })
  logradouro: string;
  @Prop({ type: String })
  bairro: string;
  @Prop({ type: String })
  cep: string;
  @Prop({ type: String })
  complemento: string;
}

@Schema({ versionKey: false })
export class Restaurante extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  donoID: Usuario;
  @Prop({ type: String })
  nome: string;
  @Prop({ type: String })
  descricao: string;
  @Prop({ schema: [Endereco] })
  endereco: Endereco;
}

export const RestauranteSchema = SchemaFactory.createForClass(Restaurante);