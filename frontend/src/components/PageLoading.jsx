import { LoaderIcon } from 'lucide-react'
import React from 'react'
import { useThemeStore } from '~/store/useThemeStore'

const PageLoading = () => {
  const { theme } = useThemeStore()
  return (
    <div
      data-theme={theme}
      className='min-h-screen flex items-center justify-center'
    >
      <LoaderIcon className='animate-spin size-10 text-primary' />
    </div>
  )
}

export default PageLoading
