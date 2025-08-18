import axiosInstance from './axios'

export const getAuthMe = async () => {
  const response = await axiosInstance.get('/auth/me')
  // console.log('api', response.data)
  return response.data
}
export const loginApi = async (data) => {
  const response = await axiosInstance.post('/auth/login', data)
  return response.data
}
export const logoutApi = async (data) => {
  try {
    const response = await axiosInstance.delete('/auth/logout', data)
    return response.data
  } catch (error) {
    return null
  }
}

export const signUpApi = async (data) => {
  const response = await axiosInstance.post('/auth/signup', data)
  return response.data
}
export const onboardingUpdateApi = async (data) => {
  const response = await axiosInstance.post('/auth/onboarding', data)
  return response.data
}
export const getUserFriends = async () => {
  const response = await axiosInstance.get('/user/friends')
  return response.data
}
export const getRecommentedUsers = async () => {
  const response = await axiosInstance.get('/user')
  return response.data
}
export const getFriendRequests = async () => {
  const response = await axiosInstance.get('/user/friend-request')
  return response.data
}
export const getOutgoingFriendsReqs = async () => {
  const response = await axiosInstance.get('/user/outgoing-friend-request')
  return response.data
}
export const getStreamToken = async () => {
  const response = await axiosInstance.get('/chat/token')
  return response.data
}
export const sendFriendRequest = async ({ id: receiptId }) => {
  console.log('receiptId', receiptId)
  const response = await axiosInstance.post(`/user/friend-request/${receiptId}`)
  return response.data
}
export const acceptRequest = async ({ id: receiptId }) => {
  console.log('receiptId', receiptId)
  const response = await axiosInstance.put(
    `/user/friend-request/${receiptId}/accept`
  )
  return response.data
}
export const rejectRequest = async ({ id: receiptId }) => {
  console.log('receiptId', receiptId)
  const response = await axiosInstance.put(
    `/user/friend-request/${receiptId}/reject`
  )
  return response.data
}
