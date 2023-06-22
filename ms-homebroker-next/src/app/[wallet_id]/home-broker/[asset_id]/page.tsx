import { ChartComponent } from '@/components/ChartComponent';
import { MyOrders } from '@/components/MyOrders';
import { OrderForm } from '@/components/OrderForm';
import { Card, TabsGroup, TabsItem } from '@/components/flowbite-components';
import { HiShoppingCart, HiArrowUp } from '@/components/react-icons/hi';

interface IProps {
  params: {
    wallet_id: string;
    asset_id: string;
  };
}

export default function Asset({ params }: IProps) {
  return (
    <main className="flex flex-grow flex-col container mx-auto p-2">
      <article className="format format-invert my-4">
        <h1>Home broker - {params.asset_id}</h1>
      </article>

      <div className="grid grid-cols-5 flex-grow gap-2 mt-2">
        <div className="col-span-2">
          <div>
            <Card
              theme={{
                root: {
                  children:
                    'flex h-full flex-col justify-center gap-4 py-4 px-2',
                },
              }}
            >
              <TabsGroup aria-label="Default tabs" style="pills">
                <TabsItem active title="Comprar" icon={HiShoppingCart}>
                  <OrderForm
                    wallet_id={params.wallet_id}
                    asset_id={params.asset_id}
                    type="BUY"
                  />
                </TabsItem>

                <TabsItem title="Vender" icon={HiArrowUp}>
                  <OrderForm
                    wallet_id={params.wallet_id}
                    asset_id={params.asset_id}
                    type="SELL"
                  />
                </TabsItem>
              </TabsGroup>
            </Card>
          </div>

          <div className="mt-2">
            <Card
              theme={{
                root: {
                  children:
                    'flex h-full flex-col justify-center gap-4 py-4 px-2',
                },
              }}
            >
              <MyOrders wallet_id={params.wallet_id} />
            </Card>
          </div>
        </div>

        <div className="col-span-3 flex flex-grow">
          <ChartComponent header={`Asset 1 - R$ 100`} />
        </div>
      </div>
    </main>
  );
}
