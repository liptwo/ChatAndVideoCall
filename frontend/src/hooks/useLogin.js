import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '~/lib/api'

const useLogin = () => {
  // const navigate = useNavigate()
  const querryClient = useQueryClient()
  const handleSuccess = () => {
    querryClient.invalidateQueries({ queryKey: ['authUser'] })
    // navigate('/')
  }
  const { mutate, isPending, error } = useMutation({
    mutationFn: loginApi,
    // onError:() => toast.error(error.responese.data.message),
    onSuccess: handleSuccess
  })
  return { error, isPending, loginMutation: mutate }
}

export default useLogin
