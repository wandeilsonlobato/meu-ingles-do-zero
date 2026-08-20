import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Pencil, Users, X } from 'lucide-react'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ACHIEVEMENTS } from '../data/achievements'
import { nextRankInfo, rankForXp } from '../lib/gamification'
import { SHOP_ITEMS } from '../data/shop'
import { useT } from '../lib/i18n'

const MAX_PHOTO_BYTES = 3 * 1024 * 1024

export default function Profile() {
  const navigate = useNavigate()
  const t = useT()
  const user = useAppStore((s) => s.currentUser())
  const updateAvatar = useAppStore((s) => s.updateAvatar)
  const updateProfileInfo = useAppStore((s) => s.updateProfileInfo)
  const uploadAvatarPhotoAction = useAppStore((s) => s.uploadAvatarPhotoAction)
  const removeAvatarPhoto = useAppStore((s) => s.removeAvatarPhoto)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!user) return null

  const rank = rankForXp(user.xpTotal)
  const next = nextRankInfo(user.xpTotal)
  const completedLessons = Object.values(user.progress).filter((p) => p.status === 'completed').length
  const estimatedMinutes = completedLessons * 4
  const ownedAvatars = SHOP_ITEMS.filter((i) => i.kind === 'avatar' && user.ownedCosmetics.includes(i.id))
  const earnedIds = new Set(user.achievements.map((a) => a.achievementId))

  function startEditing() {
    setName(user!.name)
    setBio(user!.bio ?? '')
    setError(null)
    setEditing(true)
  }

  function saveEdits() {
    if (!name.trim()) {
      setError(t('profile.nameRequired'))
      return
    }
    updateProfileInfo({ name: name.trim(), bio: bio.trim() })
    setEditing(false)
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Escolha um arquivo de imagem.')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError('A imagem precisa ter até 3 MB.')
      return
    }
    setError(null)
    setUploading(true)
    const result = await uploadAvatarPhotoAction(file)
    setUploading(false)
    if (!result.ok) setError(result.error ?? 'Não foi possível enviar a foto.')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="mb-6 flex flex-col items-center gap-3 p-8 text-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-5xl">
            {user.avatarPhotoUrl ? (
              <img src={user.avatarPhotoUrl} alt="Foto de perfil" className="h-full w-full object-cover" />
            ) : (
              user.avatarEmoji
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white shadow-md hover:bg-brand-400"
            aria-label={t('profile.uploadPhoto')}
          >
            <Camera size={16} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
        {uploading && <p className="text-xs text-slate-400">{t('profile.uploadingPhoto')}</p>}
        {user.avatarPhotoUrl && !uploading && (
          <button onClick={removeAvatarPhoto} className="text-xs font-semibold text-slate-400 hover:text-heart-600">
            {t('profile.removePhoto')}
          </button>
        )}

        {!editing ? (
          <>
            <h1 className="text-2xl font-extrabold text-slate-800">{user.name}</h1>
            <p className="text-sm text-slate-400">{user.email}</p>
            {user.bio && <p className="max-w-md text-sm text-slate-600">{user.bio}</p>}
            <button
              onClick={startEditing}
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
            >
              <Pencil size={14} /> {t('profile.editProfile')}
            </button>
          </>
        ) : (
          <div className="w-full max-w-sm text-left">
            <label className="mb-1 block text-xs font-semibold text-slate-500">{t('profile.nameLabel')}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              className="mb-3 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <label className="mb-1 block text-xs font-semibold text-slate-500">{t('profile.bioLabel')}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              placeholder={t('profile.bioPlaceholder')}
              className="mb-1 w-full resize-none rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <p className="mb-3 text-right text-[11px] text-slate-400">{bio.length}/160</p>
            {error && <p className="mb-3 text-xs font-semibold text-heart-600">{error}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdits}>
                {t('common.save')}
              </Button>
              <Button size="sm" variant="ghost" icon={<X size={14} />} onClick={() => setEditing(false)}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        )}

        <span className="rounded-full bg-glow-100 px-4 py-1 text-sm font-bold text-glow-700">{t('profile.rank')}: {rank}</span>
        {next && <p className="text-xs text-slate-400">{t('profile.xpToNextRank', { xp: next.xpNeeded, rank: next.rank })}</p>}

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => updateAvatar('🙂')}
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full border-2 text-xl',
              !user.avatarPhotoUrl && user.avatarEmoji === '🙂' ? 'border-brand-500' : 'border-transparent',
            )}
          >
            🙂
          </button>
          {ownedAvatars.map((a) => (
            <button
              key={a.id}
              onClick={() => updateAvatar(a.emoji)}
              className={clsx(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 text-xl',
                !user.avatarPhotoUrl && user.avatarEmoji === a.emoji ? 'border-brand-500' : 'border-transparent',
              )}
              title={a.name}
            >
              {a.emoji}
            </button>
          ))}
        </div>

        <Button variant="secondary" size="sm" icon={<Users size={16} />} onClick={() => navigate('/app/amigos')}>
          {t('profile.friends')}
        </Button>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label={t('profile.statXpTotal')} value={user.xpTotal} />
        <StatCard label={t('profile.statStreak')} value={`${user.streakCurrent} ${t('common.days')}`} />
        <StatCard label={t('profile.statStreakRecord')} value={`${user.streakRecord} ${t('common.days')}`} />
        <StatCard label={t('profile.statTime')} value={`${estimatedMinutes} min`} />
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-bold text-slate-700">{t('profile.achievements')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const earned = earnedIds.has(a.id)
            return (
              <div
                key={a.id}
                className={clsx(
                  'flex flex-col items-center gap-1 rounded-2xl border-2 p-4 text-center',
                  earned ? 'border-glow-300 bg-glow-50' : 'border-slate-100 bg-slate-50 opacity-50',
                )}
              >
                <span className="text-3xl">{a.icon}</span>
                <span className="text-xs font-bold text-slate-700">{a.name}</span>
                <span className="text-[11px] text-slate-400">{a.description}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-4 text-center">
      <p className="text-2xl font-extrabold text-brand-700">{value}</p>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
    </Card>
  )
}
