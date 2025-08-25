import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthUser from '~/hooks/useAuthUser'
import { getStreamToken } from '~/lib/api'

import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks
} from '@stream-io/video-react-sdk'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import ChatLoader from '~/components/ChatLoader'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const CallPage = () => {
  const { id: callId } = useParams()
  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)
  const [isConecting, setIsConecting] = useState(true)

  const { authData, isLoading } = useAuthUser()

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enable: !!authData
  })
  // console.log(tokenData)

  useEffect(() => {
    const initCall = async () => {
      console.log('Hehe')
      // if (!tokenData || !authData || callId) return
      try {
        const user = {
          id: authData._id,
          name: authData.fullName,
          image: authData.profilePicture
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData
        })

        const callInstance = videoClient.call('default', callId)

        await callInstance.join({ create: true })

        console.log('Join call successfully')

        setClient(videoClient)
        setCall(callInstance)
      } catch (error) {
        console.log(error)
        toast.error('Cant join video call')
      } finally {
        setIsConecting(false)
      }
    }
    initCall()
  }, [tokenData, authData, callId])

  if (isConecting || isLoading) return <ChatLoader type={'call'} />
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='relative'>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p>
              Could not initialize call. Please refresh or truy agian later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState()
  const navigate = useNavigate()

  if (callingState === CallingState.LEFT) return navigate('/')

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  )
}

export default CallPage
