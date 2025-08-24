import { BellIcon, HomeIcon, Slack, UsersIcon } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
// import { use } from 'react'
import useAuthUser from '~/hooks/useAuthUser'

const SideBar = () => {
  const { authData } = useAuthUser()
  const location = useLocation()
  const currentPath = location.pathname
  console.log('currentPath', currentPath)
  return (
    <aside className='w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0'>
      {/* Logo */}
      <div className='p-5 border-b border-base-300'>
        <Link to='/' className='flex items-center gap-3'>
          <Slack className='size-9 min-w-6 text-primary' />
          <span
            className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary
              tracking-wider'
          >
            Chat & Video
          </span>
        </Link>
      </div>
      {/* Menu */}
      <nav className='flex-1 p-4 space-y-1'>
        {/* Home */}
        <Link
          to='/'
          className={`btn btn-ghost rounded-2xl justify-start w-full gap-3 px-3 normal-case ${
            currentPath === '/' ? 'btn-active' : ''
          }`}
        >
          <HomeIcon className='size-5 text-base-content opacity-70' />
          <span>Home</span>
        </Link>
        {/* Friends */}
        <Link
          to='/friends'
          className={`btn btn-ghost rounded-2xl justify-start w-full gap-3 px-3 normal-case ${
            currentPath === '/friends' ? 'btn-active' : ''
          }`}
        >
          <UsersIcon className='size-5 text-base-content opacity-70' />
          <span>Friends</span>
        </Link>
        {/* Notifications */}
        <Link
          to='/notifications'
          className={`btn btn-ghost rounded-2xl justify-start w-full gap-3 px-3 normal-case ${
            currentPath === '/notifications' ? 'btn-active' : ''
          }`}
        >
          <BellIcon className='size-5 text-base-content opacity-70' />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* User profile */}
      <div className='p-4 border-t border-base-300 mt-auto'>
        <div className='flex items-center gap-4'>
          <div className='avatar'>
            <div className='w-10 rounded-full'>
              <img src={authData?.profilePicture} alt='' />
            </div>
          </div>
          <div className='flex-1'>
            <p className='font-semibold text-sm'>{authData?.fullName}</p>
            <p className='text-success flex items-center text-xs gap-1'>
              <span className='size-2 rounded-full bg-success inline-block'></span>
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SideBar
