import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BellIcon, LogOutIcon, Slack } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuthUser from '~/hooks/useAuthUser'
import useLogout from '~/hooks/useLogout'
import ThemeSelector from './ThemeSelector'

const NavBar = () => {
  const { authData } = useAuthUser()
  const location = useLocation()
  const isChatPage = location.pathname?.startsWith('/chat')
  // const isNotifications = location.pathname?.startsWith('/notifications')
  const { isPending, logoutMutation } = useLogout()

  return (
    <div className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div
          className={`flex items-center ${
            isChatPage ? ' justify-between' : 'justify-end'
          } w-full`}
        >
          {/* Logo  if in chat page */}
          {isChatPage && (
            <div className='pl-5 justify-self-start'>
              <Link to='/' className='flex items-center gap-3'>
                <Slack className='size-9 min-w-6 max-w-7 text-primary' />
                <span
                  className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary
              tracking-wider'
                >
                  Chat & Video
                </span>
              </Link>
            </div>
          )}

          <div className='flex items-center gap-3 sm:gap-4'>
            <Link
              to='/notifications'
              // className={`btn btn-ghost rounded-2xl justify-start w-full gap-3 px-3 normal-case`}
            >
              <button className='btn btn-ghost btn-circle'>
                <BellIcon className='size-6 text-base-content opacity-70' />
              </button>
            </Link>
            <ThemeSelector />

            <div className='avatar mx-2'>
              <div className='w-9 rounded-full'>
                <img
                  src={authData?.profilePicture}
                  alt='User Avatar'
                  rel='noreferrer'
                />
              </div>
            </div>

            <button
              className='btn btn-ghost btn-circle'
              onClick={logoutMutation}
            >
              <LogOutIcon className='size-5 text-base-content opacity-70' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
