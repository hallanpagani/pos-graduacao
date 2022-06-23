import { AbstractDocument } from 'src/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ versionKey: false })
export class Usuario extends AbstractDocument {
  @Prop()
  nome: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop({ type: Boolean, default: false })
  dono: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);

// hash password antes de gravar na base de dados
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this['password'] = await bcrypt.hash(this['password'], 10);
  return next();
});
