import { useState } from 'react'
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
    if (result.ok && result.newAchievements && result.newAchievements.length > 0) {
      setMessage(`Item resgatado! Conquista desbloqueada: ${result.newAchievements[0].icon} ${result.newAchievements[0].name}`)
    } else {
      setMessage(result.ok ? 'Item resgatado com sucesso!' : result.error ?? 'Não foi possível comprar.')
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const functionalItems = SHOP_ITEMS.filter((i) => i.kind !== 'avatar')
  const avatarItems = SHOP_ITEMS.filter((i) => i.kind === 'avatar')

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

      <h2 className="mb-3 font-bold text-slate-700">Itens</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {functionalItems.map((item) => {
          const canAfford = user.coins >= item.cost
          return (
            <Card key={item.id} className="flex items-center gap-4 p-5">
              <span className="text-4xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
              <Button size="sm" disabled={!canAfford} onClick={() => handleBuy(item.id)}>
                {item.cost} 🪙
              </Button>
            </Card>
          )
        })}
      </div>

      <h2 className="mb-3 font-bold text-slate-700">Avatares</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {avatarItems.map((item) => {
          const owned = user.ownedCosmetics.includes(item.id)
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

      <p className="mt-6 text-center text-xs text-slate-400">
        Ganhe moedas completando lições: você recebe metade do XP da lição também em moedas.
      </p>
    </div>
  )
}
