import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';

import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { Asset as MongooseAsset } from './asset.schema';
import { Asset } from '@prisma/client';

interface IAssetPriceUpdateEvent {
  event: 'asset-price-changed';
  data: Asset;
}

@Injectable()
export class AssetsService {
  constructor(
    private prismaService: PrismaService,
    @InjectModel(MongooseAsset.name) private assetModel: Model<MongooseAsset>,
  ) {}

  listAll() {
    return this.prismaService.asset.findMany();
  }

  create(input: { id: string; symbol: string; price: number }) {
    return this.prismaService.asset.create({
      data: input,
    });
  }

  subscribeEvents(): Observable<IAssetPriceUpdateEvent> {
    return new Observable((observer) => {
      this.assetModel
        .watch(
          [
            {
              $match: {
                operationType: 'update',
              },
            },
          ],
          {
            fullDocument: 'updateLookup',
          },
        )
        .on('change', async (data) => {
          const asset = await this.prismaService.asset.findUnique({
            where: {
              id: data.fullDocument._id + '',
            },
          });

          observer.next({ event: 'asset-price-changed', data: asset });
        });
    });
  }
}
