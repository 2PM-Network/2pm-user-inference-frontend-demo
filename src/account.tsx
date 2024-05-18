import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
<div className="flex flex-col items-center">
  {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
  {address && <div className="mb-4">{ensName ? `${ensName} (${address})` : address}</div>}
  <button 
    onClick={() => disconnect()} 
    className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white font-semibold rounded shadow">
    Disconnect
  </button>
</div>
  )
}