import { Order } from '@/app/models';
import { isHomeBrokerClosed } from '@/utils/utils';

async function getOrders(wallet_id: string): Promise<Order[]> {
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/orders`,
    {
      next: {
        tags: [`orders-wallet-${wallet_id}`],
        revalidate: isHomeBrokerClosed() ? 60 * 60 : 5, // isHomeBrokerClosed? 1 hour or 5 seconds
      },
    },
  );
  return response.json();
}

interface IProps {
  wallet_id: string;
}

export async function MyOrders({ wallet_id }: IProps) {
  const orders = await getOrders(wallet_id);

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.Asset.id} - {order.shares} - R$ {order.price} - {order.status}
        </li>
      ))}
    </ul>
  );
}
