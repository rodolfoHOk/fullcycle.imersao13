import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'Asset',
})
export class Asset {}

export type AssetDocument = HydratedDocument<Asset>;

export const AssetSchema = SchemaFactory.createForClass(Asset);
