import { MyWallet } from '@/components/MyWallet';

interface IProps {
  params: {
    wallet_id: string;
  };
}

export default function Wallet({ params }: IProps) {
  return (
    <main className="container mx-auto px-2">
      <article className="format format-invert my-4">
        <h1>Meus investimentos</h1>
      </article>

      <MyWallet wallet_id={params.wallet_id} />
    </main>
  );
}
