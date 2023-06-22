'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from './flowbite-components';

export default function DefaultNavbar() {
  const pathname = usePathname();
  const params = useParams();

  return (
    <Navbar fluid rounded>
      <NavbarBrand href="/">
        <Image
          className="mr-3 h-6 sm:h-9"
          alt="Full Cycle Invest"
          src="/logo.png"
          width={37}
          height={40}
        />

        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          FullCycle Invest
        </span>
      </NavbarBrand>

      <NavbarToggle />

      <NavbarCollapse>
        <NavbarLink
          active={pathname === `/${params.wallet_id}`}
          as={Link}
          href={`/${params.wallet_id}`}
        >
          Home
        </NavbarLink>

        <Navbar.Link href="#">Ativos</Navbar.Link>
      </NavbarCollapse>

      <div className="flex md:order-2 text-white">Olá {params.wallet_id}</div>
    </Navbar>
  );
}
