import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpApi } from '~/lib/api'

const useSignUp = () => {
  // const navigate = useNavigate()
  const handleSuccess = () => {
    querryClient.invalidateQueries({ queryKey: ['authUser'] })
    // navigate('/')
  }
  const querryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: signUpApi,
    // onError:() => toast.error(error.responese.data.message),
    onSuccess: handleSuccess
  })
  return { error, isPending, signUpMutation: mutate }
}

export default useSignUp
