import { Button, Label, TextInput } from '../components/flowbite-components';
import { revalidateTag } from 'next/cache';

async function initTransaction(formData: FormData) {
  'use server';

  const shares = formData.get('shares');
  const price = formData.get('price');
  const wallet_id = formData.get('wallet_id');
  const asset_id = formData.get('asset_id');
  const type = formData.get('type');

  const response = await fetch(
    `http://host.docker.internal:3000/wallets/${wallet_id}/orders`,
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
  type: 'BUY' | 'SELL';
}

export function OrderForm({ asset_id, wallet_id, type }: IProps) {
  return (
    <div>
      <article className="format format-invert">
        <h2>Formulário de {type === 'BUY' ? 'compra' : 'venda'}</h2>
      </article>

      <form action={initTransaction} className="flex flex-col gap-4">
        <input name="asset_id" type="hidden" defaultValue={asset_id} />
        <input name="wallet_id" type="hidden" defaultValue={wallet_id} />
        <input name="type" type="hidden" defaultValue={'BUY'} />

        <div>
          <div className="mb-2 block">
            <Label htmlFor="shares" value="Quantidade" />
          </div>

          <TextInput
            id="shares"
            name="shares"
            required
            type="number"
            min={1}
            step={1}
            defaultValue={1}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="shares" value="Preço R$" />
          </div>

          <TextInput
            id="price"
            name="price"
            required
            type="number"
            min={1}
            step={1}
            defaultValue={1}
          />
        </div>

        <Button type="submit" color={type === 'BUY' ? 'green' : 'red'}>
          Confirmar {type === 'BUY' ? 'compra' : 'venda'}
        </Button>
      </form>
    </div>
  );
}
