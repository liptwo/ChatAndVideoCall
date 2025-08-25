import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import FriendCard, { getLanguageFlag } from '~/components/FriendCard'
import NoFriendsFound from '~/components/NoFriendsFound'
import {
  getOutgoingFriendsReqs,
  getRecommentedUsers,
  getUserFriends,
  sendFriendRequest
} from '~/lib/api'
import { LANGUAGE_TO_FLAG } from '~/utils/constant'
// import { getLanguageFlag } from '~/utils/constant'

const Home = () => {
  const queryClient = useQueryClient()
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set())

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends
  })
  const { data: recommendedUers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getRecommentedUsers
  })

  const {
    data: outgoingFriendReqs = [],
    isLoading: loadingOutgoingFriendReqs
  } = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: getOutgoingFriendsReqs
  })

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendReqs'] }),
    onError: () => toast.error('Failed to send friend request'),
    retry: false
  })

  // useEffect(() => {
  //   const outgoingIds = new Set()
  //   if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
  //     outgoingFriendReqs.forEach((req) => {
  //       outgoingIds.add(req.id)
  //       console.log('outgoingIds', outgoingIds)
  //     })
  //     setOutgoingRequestsIds(outgoingIds)
  //   }
  // }, [outgoingFriendReqs])
  useEffect(() => {
    const outgoingIds = new Set()
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        // console.log('req', req)
        outgoingIds.add(req.receiver._id)
        // console.log('outgoingIds', outgoingIds)
      })
      setOutgoingRequestsIds(outgoingIds)
    }
  }, [outgoingFriendReqs])
  // console.log('recommendedUers', recommendedUers)

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        {/* Head your friends */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-wide'>
            Your Friends
          </h2>
          <Link
            to='/notifications'
            className='btn btn-secondary items-center flex btn-sm'
          >
            <UsersIcon className='size-5 mr-2 '></UsersIcon>
            Friends Request
          </Link>
        </div>

        {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 '>
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
        {/* Test Below */}
        {/* <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        <FriendCard friend={friends[0]} />
      </div> */}
        {/* Test Above  */}

        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              {/* Head title */}
              <div className='flex flex-col gap-2'>
                <h3 className='text-2xl sm:text-3xl font-bold tracking-wide'>
                  Recommended Users
                </h3>
                <p className=' opacity-70 '>
                  {' '}
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>
        </section>

        {loadingUsers ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : recommendedUers.length === 0 ? (
          <div className='card bg-base-200 p-6 text-center'>
            <h3 className='font-semibold text-lg mb-2'>No recommended users</h3>
            <p className='opacity-70'>
              Check back later for new language partners
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recommendedUers.map((user) => {
              const hasSentRequest = outgoingRequestsIds.has(user._id)
              // console.log('hasSentRequest', hasSentRequest)
              return (
                <div
                  key={user._id}
                  className='card bg-base-200 p-6 hover:shadow-lg transition-all duration-300'
                >
                  <div className='card-body p-5 space-y-4'>
                    <div className='flex items-center gap-3'>
                      <div className='avatar size-16 rounded-full'>
                        <img
                          src={
                            user?.avatar ||
                            'https://avatar.iran.liara.run/public/40'
                          }
                          alt=''
                        />
                      </div>

                      <div>
                        <h3 className='font-semibold text-lg'>
                          {user?.fullName}
                        </h3>
                        {user?.location && (
                          <div className='flex items-center text-sx opacity-70 mt-1'>
                            <MapPinIcon className='size-3 mr-1'></MapPinIcon>
                            {user?.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='flex flex-wrap gap-1.5 mb-3'>
                      <span className='badge badge-secondary text-xs'>
                        {getLanguageFlag(user?.nativeLanguege || 'Vietnamese')}
                        Native:{' '}
                        {capilialize(user?.nativeLanguege || 'Vietnamese')}
                      </span>
                      <span className='badge badge-outline text-xs'>
                        {getLanguageFlag(user?.learningLanguege || 'English')}
                        Learning:{' '}
                        {capilialize(user?.learningLanguege || 'English')}
                      </span>
                    </div>

                    {/* Bio */}
                    <div className='mb-3 max-h-5 min-h-5 overflow-y-auto'>
                      {user.bio && (
                        <p className='opacity-70 text-sm'>{user.bio}</p>
                      )}
                    </div>

                    {/* Action button */}
                    <button
                      className={`btn w-full mt-2 ${
                        hasSentRequest ? 'btn-disabled' : 'btn-primary'
                      }`}
                      onClick={() => sendRequestMutation({ id: user._id })}
                      disabled={isPending || hasSentRequest}
                    >
                      {hasSentRequest ? (
                        <>
                          <CheckCircleIcon className='size-4 mr-2' /> Request
                          Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className='size-4 mr-2' /> Send Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

export const capilialize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
