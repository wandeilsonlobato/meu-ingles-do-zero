import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Search, UserPlus, X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { fetchPublicProfilesByIds, searchProfiles } from '../lib/supabaseSync'
import { useT } from '../lib/i18n'
import type { PublicProfile } from '../types'

function AvatarBadge({ profile }: { profile: { avatarEmoji: string; avatarPhotoUrl?: string } }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900/50 text-2xl">
      {profile.avatarPhotoUrl ? (
        <img src={profile.avatarPhotoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        profile.avatarEmoji
      )}
    </div>
  )
}

export default function Friends() {
  const navigate = useNavigate()
  const t = useT()
  const user = useAppStore((s) => s.currentUser())
  const friendships = useAppStore((s) => s.friendships)
  const loadFriendships = useAppStore((s) => s.loadFriendships)
  const sendFriendRequestAction = useAppStore((s) => s.sendFriendRequestAction)
  const respondToFriendRequestAction = useAppStore((s) => s.respondToFriendRequestAction)
  const removeFriendAction = useAppStore((s) => s.removeFriendAction)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PublicProfile[]>([])
  const [searching, setSearching] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [profilesById, setProfilesById] = useState<Record<string, PublicProfile>>({})

  useEffect(() => {
    loadFriendships()
  }, [loadFriendships])

  const otherIds = useMemo(() => {
    if (!user) return []
    return Array.from(new Set(friendships.map((f) => (f.requesterId === user.id ? f.addresseeId : f.requesterId))))
  }, [friendships, user])

  useEffect(() => {
    const missing = otherIds.filter((id) => !profilesById[id])
    if (missing.length === 0) return
    fetchPublicProfilesByIds(missing).then((profiles) => {
      setProfilesById((prev) => {
        const next = { ...prev }
        for (const p of profiles) next[p.id] = p
        return next
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherIds])

  useEffect(() => {
    if (!query.trim() || !user) {
      setResults([])
      return
    }
    setSearching(true)
    const timeout = setTimeout(() => {
      searchProfiles(query, user.id).then((r) => {
        setResults(r)
        setSearching(false)
      })
    }, 350)
    return () => clearTimeout(timeout)
  }, [query, user])

  if (!user) return null

  const incoming = friendships.filter((f) => f.status === 'pending' && f.addresseeId === user.id)
  const outgoing = friendships.filter((f) => f.status === 'pending' && f.requesterId === user.id)
  const accepted = friendships.filter((f) => f.status === 'accepted')

  const friendshipByOtherId = new Map(friendships.map((f) => [f.requesterId === user.id ? f.addresseeId : f.requesterId, f]))

  function flash(text: string) {
    setMessage(text)
    setTimeout(() => setMessage(null), 2500)
  }

  async function handleAddFriend(targetId: string) {
    const result = await sendFriendRequestAction(targetId)
    flash(result.ok ? t('friends.requestSent') : result.error ?? t('friends.requestError'))
  }

  function renderPersonRow(userId: string, actions: React.ReactNode) {
    const profile = profilesById[userId]
    return (
      <div key={userId} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
        <button className="flex flex-1 items-center gap-3 text-left" onClick={() => navigate(`/app/usuario/${userId}`)}>
          {profile ? <AvatarBadge profile={profile} /> : <div className="h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-800" />}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{profile?.name ?? t('friends.loadingProfile')}</span>
        </button>
        <div className="flex shrink-0 gap-2">{actions}</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-800 dark:text-slate-100">{t('friends.title')}</h1>

      {message && (
        <div className="mb-4 rounded-xl bg-brand-50 dark:bg-brand-900/30 px-4 py-2 text-center text-sm font-semibold text-brand-700 dark:text-brand-300">
          {message}
        </div>
      )}

      <Card className="mb-6 p-5">
        <div className="mb-3 flex items-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 px-3 py-2 focus-within:border-brand-400">
          <Search size={18} className="text-slate-400 dark:text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('friends.searchPlaceholder')}
            className="w-full text-sm outline-none"
          />
        </div>
        {searching && <p className="text-sm text-slate-400 dark:text-slate-500">{t('friends.searching')}</p>}
        {!searching && query.trim() && results.length === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500">{t('friends.noResults')}</p>
        )}
        <div className="flex flex-col gap-2">
          {results.map((r) => {
            const existing = friendshipByOtherId.get(r.id)
            return (
              <div key={r.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                <button
                  className="flex flex-1 items-center gap-3 text-left"
                  onClick={() => navigate(`/app/usuario/${r.id}`)}
                >
                  <AvatarBadge profile={r} />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{r.name}</span>
                </button>
                {!existing && (
                  <Button size="sm" variant="secondary" icon={<UserPlus size={14} />} onClick={() => handleAddFriend(r.id)}>
                    {t('friends.add')}
                  </Button>
                )}
                {existing?.status === 'pending' && <span className="text-xs text-slate-400 dark:text-slate-500">{t('friends.pending')}</span>}
                {existing?.status === 'accepted' && <span className="text-xs text-progress-600 dark:text-progress-400">{t('friends.alreadyFriends')}</span>}
              </div>
            )
          })}
        </div>
      </Card>

      {incoming.length > 0 && (
        <Card className="mb-6 p-5">
          <h2 className="mb-3 font-bold text-slate-700 dark:text-slate-200">{t('friends.incomingTitle')}</h2>
          <div className="flex flex-col gap-2">
            {incoming.map((f) =>
              renderPersonRow(
                f.requesterId,
                <>
                  <Button size="sm" icon={<Check size={14} />} onClick={() => respondToFriendRequestAction(f.id, true)}>
                    {t('friends.accept')}
                  </Button>
                  <Button size="sm" variant="ghost" icon={<X size={14} />} onClick={() => respondToFriendRequestAction(f.id, false)}>
                    {t('friends.decline')}
                  </Button>
                </>,
              ),
            )}
          </div>
        </Card>
      )}

      {outgoing.length > 0 && (
        <Card className="mb-6 p-5">
          <h2 className="mb-3 font-bold text-slate-700 dark:text-slate-200">{t('friends.outgoingTitle')}</h2>
          <div className="flex flex-col gap-2">
            {outgoing.map((f) =>
              renderPersonRow(
                f.addresseeId,
                <Button size="sm" variant="ghost" onClick={() => removeFriendAction(f.id)}>
                  {t('friends.cancelRequest')}
                </Button>,
              ),
            )}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h2 className="mb-3 font-bold text-slate-700 dark:text-slate-200">{t('friends.myFriendsTitle', { count: accepted.length })}</h2>
        {accepted.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-500">{t('friends.noFriendsYet')}</p>}
        <div className="flex flex-col gap-2">
          {accepted.map((f) => {
            const otherId = f.requesterId === user.id ? f.addresseeId : f.requesterId
            return renderPersonRow(
              otherId,
              <Button size="sm" variant="ghost" onClick={() => removeFriendAction(f.id)}>
                {t('friends.remove')}
              </Button>,
            )
          })}
        </div>
      </Card>
    </div>
  )
}
