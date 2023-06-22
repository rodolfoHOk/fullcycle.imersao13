import { Order } from '@/app/models';
import { isHomeBrokerClosed } from '@/utils/utils';
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from './flowbite-components';

async function getOrders(wallet_id: string): Promise<Order[]> {
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/orders`,
    {
      next: {
        tags: [`orders-wallet-${wallet_id}`],
        revalidate: isHomeBrokerClosed() ? 60 * 60 : 5, // 1 hour or 5 seconds
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
    <div>
      <article className="format format-invert">
        <h2>Minha ordens</h2>
      </article>

      <Table className="mt-2">
        <TableHead>
          <TableHeadCell>asset_id</TableHeadCell>

          <TableHeadCell>quant.</TableHeadCell>

          <TableHeadCell>price</TableHeadCell>

          <TableHeadCell>tipo</TableHeadCell>

          <TableHeadCell>status</TableHeadCell>
        </TableHead>

        <TableBody>
          {orders.map((order, key) => (
            <TableRow key={key} className=" border-gray-700 bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-white">
                {order.Asset.id}
              </TableCell>

              <TableCell>{order.shares}</TableCell>

              <TableCell>{order.price}</TableCell>

              <TableCell>
                <Badge>{order.type}</Badge>
              </TableCell>

              <TableCell>
                <Badge>{order.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
