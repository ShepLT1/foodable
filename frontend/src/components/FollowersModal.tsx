import { Modal } from './Modal'
import { UserAvatar } from './UserAvatar'
import {
  useFollowers,
  useFollowing,
  useUnfollowUser,
} from '../hooks/useFollows'

interface FollowersModalProps {
  userId: string
  type: 'followers' | 'following' | null
  onClose: () => void
}

export function FollowersModal({ userId, type, onClose }: FollowersModalProps) {
  const { data: followers = [], isLoading: loadingFollowers } = useFollowers(
    type === 'followers' ? userId : '',
  )
  const { data: following = [], isLoading: loadingFollowing } = useFollowing(
    type === 'following' ? userId : '',
  )
  const unfollowMutation = useUnfollowUser()

  const isLoading = type === 'followers' ? loadingFollowers : loadingFollowing
  const list = type === 'followers' ? followers : following
  const title = type === 'followers' ? 'Followers' : 'Following'

  return (
    <Modal open={!!type} onClose={onClose} title={title}>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-slate-500">No users found.</p>
      ) : (
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {list.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <UserAvatar name={u.display_name} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {u.display_name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Joined {new Date(u.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Show Unfollow button when viewing your "Following" list */}
              {type === 'following' && (
                <button
                  type="button"
                  disabled={unfollowMutation.isPending}
                  onClick={() => unfollowMutation.mutate(u.id)}
                  className="cursor-pointer rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Unfollow
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
