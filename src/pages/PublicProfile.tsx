import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Flame, UserCheck, UserPlus } from 'lucide-react'
import clsx from 'clsx'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ACHIEVEMENTS } from '../data/achievements'
import { fetchPublicProfile } from '../lib/supabaseSync'
import { useT } from '../lib/i18n'
import type { PublicProfile as PublicProfileType } from '../types'

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const t = useT()
  const currentUser = useAppStore((s) => s.currentUser())
  const friendships = useAppStore((s) => s.friendships)
  const loadFriendships = useAppStore((s) => s.loadFriendships)
  const sendFriendRequestAction = useAppStore((s) => s.sendFriendRequestAction)

  const [profile, setProfile] = useState<PublicProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    loadFriendships()
  }, [loadFriendships])

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    fetchPublicProfile(userId, ACHIEVEMENTS).then((p) => {
      setProfile(p)
      setLoading(false)
    })
  }, [userId])

  if (!currentUser || !userId) return null

  const friendship = friendships.find(
    (f) => (f.requesterId === userId && f.addresseeId === currentUser.id) || (f.addresseeId === userId && f.requesterId === currentUser.id),
  )

  async function handleAddFriend() {
    const result = await sendFriendRequestAction(userId!)
    setMessage(result.ok ? t('friends.requestSent') : result.error ?? t('friends.requestError'))
    setTimeout(() => setMessage(null), 2500)
  }

  return (
    <div className="mx-auto max-w-xl">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-600">
        <ArrowLeft size={18} /> {t('publicProfile.back')}
      </button>

      {loading && <Card className="p-8 text-center text-slate-400 dark:text-slate-500">{t('publicProfile.loading')}</Card>}

      {!loading && !profile && <Card className="p-8 text-center text-slate-400 dark:text-slate-500">{t('publicProfile.notFound')}</Card>}

      {!loading && profile && (
        <>
          {message && (
            <div className="mb-4 rounded-xl bg-brand-50 dark:bg-brand-900/30 px-4 py-2 text-center text-sm font-semibold text-brand-700 dark:text-brand-300">
              {message}
            </div>
          )}

          <Card className="mb-6 flex flex-col items-center gap-3 p-8 text-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900/50 text-5xl">
              {profile.avatarPhotoUrl ? (
                <img src={profile.avatarPhotoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                profile.avatarEmoji
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{profile.name}</h1>
            {profile.bio && <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">{profile.bio}</p>}

            <span
              className={clsx(
                'flex items-center gap-1 rounded-full px-4 py-1 text-sm font-bold',
                'bg-glow-100 dark:bg-glow-900/50 text-glow-700 dark:text-glow-300',
              )}
            >
              <Flame size={16} /> {t('publicProfile.streakDays', { count: profile.streakCurrent })}
            </span>
            <span className="rounded-full bg-brand-50 dark:bg-brand-900/30 px-4 py-1 text-xs font-bold text-brand-700 dark:text-brand-300">
              {t('publicProfile.league', { league: profile.league })}
            </span>

            {!friendship && (
              <Button size="sm" icon={<UserPlus size={16} />} onClick={handleAddFriend}>
                {t('publicProfile.addFriend')}
              </Button>
            )}
            {friendship?.status === 'pending' && (
              <span className="text-sm text-slate-400 dark:text-slate-500">{t('publicProfile.requestPending')}</span>
            )}
            {friendship?.status === 'accepted' && (
              <span className="flex items-center gap-1 text-sm font-semibold text-progress-600 dark:text-progress-400">
                <UserCheck size={16} /> {t('publicProfile.alreadyFriends')}
              </span>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-bold text-slate-700 dark:text-slate-200">{t('publicProfile.achievements')}</h2>
            {profile.achievements.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">{t('publicProfile.noAchievements')}</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {profile.achievements.map((a) => (
                  <div key={a.id} className="flex flex-col items-center gap-1 rounded-2xl border-2 border-glow-300 bg-glow-50 dark:bg-glow-900/30 p-4 text-center">
                    <span className="text-3xl">{a.icon}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{a.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
