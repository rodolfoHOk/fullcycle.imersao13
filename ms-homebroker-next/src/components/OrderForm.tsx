import { revalidateTag } from 'next/cache';

async function initTransaction(formData: FormData) {
  'use server';

  const shares = formData.get('shares');
  const price = formData.get('price');
  const wallet_id = formData.get('wallet_id');
  const asset_id = formData.get('asset_id');
  const type = formData.get('type');

  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/orders`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        wallet_id,
        asset_id,
        shares,
        price,
        type,
        status: 'OPEN',
        Asset: {
          id: asset_id,
          symbol: asset_id,
          price: price,
        },
      }),
    },
  );

  revalidateTag(`orders-wallet-${wallet_id}`);

  return await response.json();
}

interface IProps {
  asset_id: string;
  wallet_id: string;
  type?: 'BUY' | 'SELL';
}

export function OrderForm({ asset_id, wallet_id, type }: IProps) {
  return (
    <div>
      <h1>Order Form</h1>

      <form action={initTransaction}>
        <input name="asset_id" type="hidden" defaultValue={asset_id} />
        <input name="wallet_id" type="hidden" defaultValue={wallet_id} />
        <input name="type" type="hidden" defaultValue={'BUY'} />

        <input
          className="text-black placeholder:text-gray-500"
          id="shares"
          name="shares"
          required
          type="number"
          min={1}
          step={1}
          placeholder="quantidade"
        />

        <br />

        <input
          className="text-black placeholder:text-gray-500"
          id="price"
          name="price"
          required
          type="number"
          min={1}
          step={0.01}
          placeholder="preço"
        />

        <br />

        <button type="submit">Comprar</button>
      </form>
    </div>
  );
}
