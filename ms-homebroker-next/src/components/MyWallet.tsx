'use client'; // transformamos em client component na aula 5

import useSWR from 'swr';

import { WalletAsset } from '@/app/models';
import { fetcher, isHomeBrokerClosed } from '@/utils/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from './flowbite-components';
import Link from 'next/link';

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

  const { data: walletAssets, error } = useSWR<WalletAsset[]>(
    `http://localhost:3001/api/wallets/${wallet_id}/assets`,
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
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
