import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheck } from 'lucide-react'
import React from 'react'
import { getLanguageFlag } from '~/components/FriendCard'
import { acceptRequest, getFriendRequests, rejectRequest } from '~/lib/api'
import { capilialize } from './Home'
import toast from 'react-hot-toast'
import moment from 'moment'
import NoNotificationsFound from '~/components/NoNotificationsFound'

const Notifications = () => {
  const queryClient = useQueryClient()
  const { data: friendRequests = [], isLoading: loadingFriendRequests } =
    useQuery({
      queryKey: ['friendRequests'],
      queryFn: getFriendRequests
    })

  const { mutate: acceptRequestMutation, isPending: isAcceptPending } =
    useMutation({
      mutationFn: acceptRequest,
      onSuccess: () => {
        toast.success('Request accepted successfully')
        queryClient.invalidateQueries({ queryKey: ['friendRequests'] })
        queryClient.invalidateQueries({ queryKey: ['friends'] })
      }
    })

  const { mutate: rejectRequestMutation, isPending: isRejectPending } =
    useMutation({
      mutationFn: rejectRequest,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['friendRequests'] })
    })

  const incomingRequests = friendRequests?.incomingReqs || []
  const acceptedRequests = friendRequests?.acceptedReqs || []
  console.log(friendRequests)
  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10 max-w-4xl'>
        <h2 className='text-2xl sm:text-3xl font-bold tracking-wide'>
          Notifications
        </h2>
        {loadingFriendRequests ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : (
          <>
            {incomingRequests.length === 0 ? (
              // <div className='card bg-base-200 p-6 text-center'>
              //   <h3 className='font-semibold text-lg mb-2'>No notifications</h3>
              //   <p className='opacity-70'>
              //     Check back later for new notifications
              //   </p>
              // </div>
              <></>
            ) : (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2  mb-2'>
                  <UserCheck className='size-5 mr-2 inline-block text-primary' />
                  Friends Requests
                  <span className='badge badge-primary rounded-lg ml-2'>
                    {incomingRequests.length}
                  </span>
                </h2>
                <div className='space-y-3'>
                  {/* User Sent to me */}
                  {incomingRequests.map((req) => (
                    <div
                      key={req._id}
                      className='card bg-base-200 hover:shadow-lg transition-all duration-300'
                    >
                      <div className='card-body p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='avatar size-16 bg-base-300 rounded-full'>
                              <img
                                src={'https://avatar.iran.liara.run/public/40'}
                                alt=''
                              />
                            </div>
                            <div className='ml-3 items-start justify-center flex flex-col'>
                              <p className='font-semibold '>Liptwo</p>
                              {/* Actions */}
                              <div className='flex flex-wrap gap-1.5 mb-3'>
                                <span className='badge badge-secondary text-xs'>
                                  {getLanguageFlag('Vietnamese')}
                                  Native: {capilialize('Vietnamese')}
                                </span>
                                <span className='badge badge-outline text-xs'>
                                  {getLanguageFlag('English')}
                                  Learning: {capilialize('English')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className='space-x-2'>
                            <button
                              className='btn btn-primary btn-sm'
                              onClick={() =>
                                acceptRequestMutation({ id: req._id })
                              }
                              disabled={isAcceptPending}
                            >
                              Accept
                            </button>
                            <button
                              className='btn btn-outline btn-sm'
                              onClick={() =>
                                rejectRequestMutation({ id: req._id })
                              }
                              disabled={isRejectPending}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Acctept reqs notifications */}
            {acceptedRequests.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-lg font-semibold mb-2'>
                  <BellIcon className='size-5 mr-2 inline-block text-primary' />
                  New Connections
                  {/* <span className='badge badge-primary rounded-lg mx-2'>2</span> */}
                </h2>

                <div className='space-y-3'>
                  {acceptedRequests.map((req) => (
                    <div key={req._id} className='card bg-base-200'>
                      <div className='card-body p-4'>
                        <div className='flex items-start  gap-3'>
                          <div className='avatar size-10 mt-1 rounded-full'>
                            <img
                              src={
                                req.receiver.profilePicture ||
                                'https://avatar.iran.liara.run/public/40'
                              }
                              alt=''
                            />
                          </div>

                          <div className='flex-1'>
                            <h3 className='font-semibold'>
                              {req.receiver.fullName}
                            </h3>
                            <p className='opacity-70 text-sm'>
                              {req.receiver.fullName} accepted your friend
                              request.
                            </p>
                            <p className='text-xs flex items-center gap-2 opacity-70'>
                              <ClockIcon className='size-3 mr-1' />
                              {moment(req.updatedAt).fromNow()}
                            </p>
                          </div>
                          <div className='badge badge-success p-2 rounded-xl'>
                            <MessageSquareIcon className='size-5 mr-1'></MessageSquareIcon>
                            New Friend
                          </div>
                        </div>

                        <div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Notifications
