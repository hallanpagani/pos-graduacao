import { Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class AbstractDocument {
  // @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}
