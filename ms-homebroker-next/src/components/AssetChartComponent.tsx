'use client';

import { MutableRefObject, useRef } from 'react';
import useSWR from 'swr';
import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';

import { ChartComponent, ChartComponentRef } from './ChartComponent';
import { fetcher } from '@/utils/utils';
import { AssetDaily } from '@/app/models';

interface IProps {
  asset_id: string;
}

export function AssetChartComponent({ asset_id }: IProps) {
  const chartRef = useRef() as MutableRefObject<ChartComponentRef>;

  // melhoria implementar na api do nextjs para trabalhar após as 18h
  const { data: asset, mutate: mutateAsset } = useSWR(
    `http://localhost:3000/assets/${asset_id}`,
    fetcher,
    {
      fallbackData: { id: asset_id, price: 0 },
    },
  );

  const { data: assetDaily } = useSWRSubscription(
    `http://localhost:3000/assets/${asset_id}/daily/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);

      eventSource.addEventListener('asset-daily-created', async (event) => {
        const assetDailyCreated: AssetDaily = JSON.parse(event.data);

        chartRef.current.update({
          time: new Date(assetDailyCreated.date).getTime(),
          value: assetDailyCreated.price,
        });

        await mutateAsset(
          { id: assetDailyCreated.id, price: assetDailyCreated.price },
          false,
        );

        next(null, assetDailyCreated);
      });

      eventSource.onerror = (errorEvent) => {
        console.error(errorEvent);
        eventSource.close();
      };

      return () => {
        console.log('close event source');
        eventSource.close();
      };
    },
    {},
  );

  return (
    <ChartComponent header={`${asset_id} - R$ ${asset.price}`} ref={chartRef} />
  );
}
