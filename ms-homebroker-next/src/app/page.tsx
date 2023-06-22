import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/wallet1');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Bem-vindo ao Home Broker da FullCycle</h1>
    </main>
  );
}
