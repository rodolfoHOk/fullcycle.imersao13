import { WalletAsset } from '@/app/models';
import { isHomeBrokerClosed } from '@/utils/utils';

// Server Components - Next 13
async function getWalletAssets(wallet_id: string): Promise<WalletAsset[]> {
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/assets`,
    {
      // cache: 'no-store', // não faz cache, efetua a requisição em todas as vezes
      next: {
        revalidate: isHomeBrokerClosed() ? 60 * 60 : 5, // 1 hour or 5 seconds
      },
    },
  );
  return response.json();
}

interface IProps {
  wallet_id: string;
}

export async function MyWallet({ wallet_id }: IProps) {
  const walletAssets = await getWalletAssets(wallet_id);

  return (
    <ul>
      {walletAssets.map((walletAsset) => (
        <li key={walletAsset.id}>
          {walletAsset.Asset.id} - {walletAsset.shares} - R${' '}
          {walletAsset.Asset.price}
        </li>
      ))}
    </ul>
  );
}
