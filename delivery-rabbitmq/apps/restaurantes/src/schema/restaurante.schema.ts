import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AbstractDocument } from '@app/comum/database/abstract.schema';
import { Usuario } from '@app/comum/interfaces/usuarios.interface';

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

export type RestauranteDocument = Restaurante & Document;

@Schema({ versionKey: false })
export class Restaurante extends AbstractDocument {
  @Prop({ type: String })
  donoID: string
  @Prop({ type: String })
  nome: string;
  @Prop({ type: String })
  descricao: string;
  @Prop({ schema: [Endereco] })
  endereco: Endereco;
}

export const RestauranteSchema = SchemaFactory.createForClass(Restaurante);
