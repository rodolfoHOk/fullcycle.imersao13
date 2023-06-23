'use client'; // transformamos em client component na aula 5

import Link from 'next/link';
import useSWR from 'swr';
import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';

import { Asset, WalletAsset } from '@/app/models';
import { fetcher } from '@/utils/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from './flowbite-components';

// Server Components - Next 13
// async function getWalletAssets(wallet_id: string): Promise<WalletAsset[]> {
//   const response = await fetch(
//     `http://host.docker.internal:3000/wallets/${wallet_id}/assets`,
//     {
//       // cache: 'no-store', // não faz cache, efetua a requisição em todas as vezes
//       next: {
//         revalidate: isHomeBrokerClosed() ? 60 * 60 : 5, // 1 hour or 5 seconds
//       },
//     },
//   );
//   return response.json();
// }

interface IProps {
  wallet_id: string;
}

export function MyWallet({ wallet_id }: IProps) {
  // const walletAssets = await getWalletAssets(wallet_id);

  const {
    data: walletAssets,
    error,
    mutate: mutateWalletAssets,
  } = useSWR<WalletAsset[]>(
    `http://localhost:3001/api/wallets/${wallet_id}/assets`,
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const { data: assetChanged } = useSWRSubscription(
    `http://localhost:3000/assets/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);

      eventSource.addEventListener('asset-price-changed', async (event) => {
        const assetChanged: Asset = JSON.parse(event.data);

        await mutateWalletAssets((prev) => {
          const foundIndex = prev?.findIndex(
            (walletAsset) => walletAsset.asset_id === assetChanged.id,
          );

          if (foundIndex !== -1 && foundIndex !== undefined && prev) {
            prev[foundIndex].Asset.price = assetChanged.price;
          }

          return [...prev!];
        }, false);

        next(null, assetChanged);
      });

      eventSource.onerror = (error) => {
        console.error(error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    },
    {},
  );

  const { data: walletAssetUpdated } = useSWRSubscription(
    `http://localhost:3000/wallets/${wallet_id}/assets/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);

      eventSource.addEventListener('wallet-asset-updated', async (event) => {
        const walletAssetUpdated: WalletAsset = JSON.parse(event.data);

        await mutateWalletAssets((prev) => {
          const foundIndex = prev?.findIndex(
            (walletAsset) =>
              walletAsset.asset_id === walletAssetUpdated.asset_id,
          );

          if (foundIndex !== -1 && foundIndex !== undefined && prev) {
            console.log('aqui');
            prev[foundIndex].shares = walletAssetUpdated.shares;
          }

          return [...prev!];
        }, false);

        next(null, walletAssetUpdated);
      });

      eventSource.onerror = (error) => {
        console.error(error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    },
  );

  return (
    <Table>
      <TableHead>
        <TableHeadCell>Nome</TableHeadCell>

        <TableHeadCell>Preço R$</TableHeadCell>

        <TableHeadCell>Quant.</TableHeadCell>

        <TableHeadCell>
          <span className="sr-only">Comprar/Vender</span>
        </TableHeadCell>
      </TableHead>

      <TableBody className="divide-y">
        {walletAssets!.map((walletAsset, key) => (
          <TableRow key={key} className="border-gray-700 bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-white">
              {walletAsset.Asset.id} ({walletAsset.Asset.symbol})
            </TableCell>

            <TableCell>{walletAsset.Asset.price}</TableCell>

            <TableCell>{walletAsset.shares}</TableCell>

            <TableCell>
              <Link
                className="font-medium hover:underline text-cyan-500"
                href={`/${wallet_id}/home-broker/${walletAsset.Asset.id}`}
              >
                Comprar/Vender
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
