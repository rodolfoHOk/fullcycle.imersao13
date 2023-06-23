import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';

import { AssetDaily as MongooseAssetDaily } from './asset-daily.schema';
import { PrismaService } from '../../prisma/prisma/prisma.service';
import { AssetDaily } from '@prisma/client';
import { Observable } from 'rxjs';

interface IAssetDailyEvent {
  event: 'asset-daily-created';
  data: AssetDaily;
}

@Injectable()
export class AssetsDailyService {
  constructor(
    private prismaService: PrismaService,
    @InjectModel(MongooseAssetDaily.name)
    private assetDailyModel: Model<MongooseAssetDaily>,
  ) {}

  listByAssetIdOrSymbol(assetIdOrSymbol: string) {
    const where = ObjectId.isValid(assetIdOrSymbol)
      ? { asset_id: assetIdOrSymbol }
      : { asset: { symbol: assetIdOrSymbol } };

    return this.prismaService.assetDaily.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });
  }

  subscribeEvents(asset_id: string): Observable<IAssetDailyEvent> {
    return new Observable((observer) => {
      this.assetDailyModel
        .watch(
          [
            {
              $match: {
                operationType: 'insert',
                'fullDocument.asset_id': asset_id,
              },
            },
          ],
          {
            fullDocument: 'updateLookup',
          },
        )
        .on('change', async (data) => {
          const asset = await this.prismaService.assetDaily.findUnique({
            where: {
              id: data.fullDocument._id + '',
            },
          });

          observer.next({ event: 'asset-daily-created', data: asset });
        });
    });
  }
}
