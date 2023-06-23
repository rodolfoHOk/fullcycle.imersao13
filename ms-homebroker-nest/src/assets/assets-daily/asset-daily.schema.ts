import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'AssetDaily',
})
export class AssetDaily {}

export type AssetDailyDocument = HydratedDocument<AssetDaily>;

export const AssetDailySchema = SchemaFactory.createForClass(AssetDaily);
