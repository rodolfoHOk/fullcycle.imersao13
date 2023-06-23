import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'WalletAsset' })
export class WalletAsset {}

export type WalletAssetDocument = HydratedDocument<WalletAsset>;

export const WalletAssetSchema = SchemaFactory.createForClass(WalletAsset);
