import { WalletAsset } from '@/app/models';

// Server Components - Next 13
async function getWalletAssets(wallet_id: string): Promise<WalletAsset[]> {
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/assets`,
    {
      next: {
        revalidate: 1 * 60, // 1 minute
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
