import { isHomeBrokerClosed } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

interface IParameter {
  params: {
    wallet_id: string;
  };
}

export async function GET(request: NextRequest, { params }: IParameter) {
  const response = await fetch(
    `http://host.docker.internal:3000/wallets/${params.wallet_id}/assets`,
    {
      next: {
        revalidate: isHomeBrokerClosed() ? 60 * 60 : 5, // 1 hour or 5 seconds
      },
    },
  );
  return NextResponse.json(await response.json());
}
