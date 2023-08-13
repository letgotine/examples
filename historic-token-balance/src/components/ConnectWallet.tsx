"use client";

import { shortenAddress } from '@/shared/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
} from 'wagmi'
import Button from './ui/Button';
 
export default function ConnectWallet({ addressVerify }: { addressVerify: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()

  const disconnectWallet = () => {
    disconnect();
    router.push(pathname);
  }

  useEffect(() => {
    if (isConnected && address && addressVerify !== address) {
      router.push(`${pathname}/?address=${address}&${searchParams}`);
    }
  }, [address, addressVerify, isConnected, router, pathname]);

  if (isConnected) {
    return (
      <Button
        onClick={() => {
          disconnectWallet();
        }}
      >
        { ensName ? ensName : shortenAddress(address as string) }
      </Button>
    )
  }
 
  return (
    <div>
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => {
            connect({ connector });
          }}
        >
          { "Connect Wallet" }
        </Button>
      ))}
 
      {error && <div>{error.message}</div>}
    </div>
  )
}