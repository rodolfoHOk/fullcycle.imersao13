'use client';

import { PropsWithChildren, startTransition } from 'react';
import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';

import { revalidateOrders } from '@/actions/revalidate-orders';

interface IProps extends PropsWithChildren {
  wallet_id: string;
}

export function SyncOrders({ children, wallet_id }: IProps) {
  const { data, error } = useSWRSubscription(
    `http://localhost:3000/wallets/${wallet_id}/orders/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);

      eventSource.addEventListener('order-created', async (event) => {
        const orderCreated = JSON.parse(event.data);

        next(null, orderCreated);

        startTransition(() => {
          revalidateOrders(wallet_id);
        });
      });

      eventSource.addEventListener('order-updated', async (event) => {
        const orderUpdated = JSON.parse(event.data);

        next(null, orderUpdated);

        startTransition(() => {
          revalidateOrders(wallet_id);
        });
      });

      eventSource.onerror = (errorEvent) => {
        console.error('error:', errorEvent);
        eventSource.close();

        // @ts-ignore
        next(errorEvent.data, null);
      };

      return () => {
        eventSource.close();
      };
    },
  );

  return <>{children}</>;
}
