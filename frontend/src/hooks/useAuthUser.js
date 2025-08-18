import { useQuery } from '@tanstack/react-query'
import { getAuthMe } from '~/lib/api'

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthMe,
    retry: false
  })
  // console.log('authuser', authUser)
  return { isLoading: authUser.isLoading, authData: authUser?.data?.user }
}

export default useAuthUser
