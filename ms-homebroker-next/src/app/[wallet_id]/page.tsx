import { MyWallet } from '@/components/MyWallet';

interface IProps {
  params: {
    wallet_id: string;
  };
}

export default function Wallet({ params }: IProps) {
  return (
    <div>
      <h1>Meus investimentos</h1>
      <MyWallet wallet_id={params.wallet_id} />
    </div>
  );
}
