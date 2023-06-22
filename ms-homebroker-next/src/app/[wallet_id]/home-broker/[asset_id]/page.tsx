import { MyOrders } from '@/components/MyOrders';
import { OrderForm } from '@/components/OrderForm';

interface IProps {
  params: {
    wallet_id: string;
    asset_id: string;
  };
}

export default function Asset({ params }: IProps) {
  return (
    <div>
      <h1>Home broker</h1>

      <div className="flex flex-row">
        <div className="flex flex-col">
          <div>
            <OrderForm
              wallet_id={params.wallet_id}
              asset_id={params.asset_id}
            />
          </div>

          <div>
            <MyOrders wallet_id={params.wallet_id} />
          </div>
        </div>

        <div>gráfico</div>
      </div>
    </div>
  );
}
