import { useState } from 'react'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { SHOP_ITEMS } from '../data/shop'
import { CoinsBadge } from '../components/ui/StatusBadges'

export default function Store() {
  const user = useAppStore((s) => s.currentUser())
  const purchaseItem = useAppStore((s) => s.purchaseItem)
  const [message, setMessage] = useState<string | null>(null)
  if (!user) return null

  function handleBuy(itemId: string) {
    const result = purchaseItem(itemId)
    setMessage(result.ok ? 'Item resgatado com sucesso!' : result.error ?? 'Não foi possível comprar.')
    setTimeout(() => setMessage(null), 2500)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800">Loja de recompensas</h1>
        <CoinsBadge coins={user.coins} />
      </div>

      {message && (
        <div className="mb-4 rounded-xl bg-brand-50 px-4 py-2 text-center text-sm font-semibold text-brand-700">
          {message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {SHOP_ITEMS.map((item) => {
          const owned = item.kind === 'avatar' && user.ownedCosmetics.includes(item.id)
          const canAfford = user.coins >= item.cost
          return (
            <Card key={item.id} className="flex items-center gap-4 p-5">
              <span className="text-4xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
              <Button
                size="sm"
                variant={owned ? 'secondary' : 'primary'}
                disabled={owned || !canAfford}
                onClick={() => handleBuy(item.id)}
              >
                {owned ? 'Adquirido' : `${item.cost} 🪙`}
              </Button>
            </Card>
          )
        })}
      </div>

      <p className={clsx('mt-6 text-center text-xs text-slate-400')}>
        Ganhe moedas completando lições: você recebe metade do XP da lição também em moedas.
      </p>
    </div>
  )
}
