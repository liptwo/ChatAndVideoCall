import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { logoutApi } from '~/lib/api'
import { toast } from 'react-hot-toast'

const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // const handleSuccess = () => {
  //   // Clear all queries from cache
  //   // queryClient.clear()
  //   // Or clear specific query
  //   queryClient.removeQueries({ queryKey: ['authUser'] })
  //   // Navigate to login page
  //   navigate('/login')
  //   toast.success('Logged out successfully')
  // }

  const handleSuccess = () => {
    // Clear auth user query
    queryClient.setQueryData(['authUser'], null)
    queryClient.invalidateQueries({ queryKey: ['authUser'] })
    // Navigate to login page
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const { mutate, isPending, error } = useMutation({
    mutationFn: logoutApi,
    onSuccess: handleSuccess,
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Logout failed')
    }
  })

  return { error, isPending, logoutMutation: mutate }
}

export default useLogout
