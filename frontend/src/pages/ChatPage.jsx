import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuthUser from '~/hooks/useAuthUser'
import { getStreamToken } from '~/lib/api'

import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient
} from 'stream-chat-react'
import 'stream-chat-react/dist/css/v2/index.css'
import { StreamChat } from 'stream-chat'
import ChatLoader from '~/components/ChatLoader'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import CallButton from '~/components/CallButton'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const { id: targetUserId } = useParams()
  const [loading, setLoading] = useState(true)
  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const { authData } = useAuthUser()
  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enable: !!authData
  })

  useEffect(() => {
    const initChat = async () => {
      // setLoading(true)
      console.log('tokenData', tokenData, 'authUser', authData)
      if (!tokenData || !authData) return
      try {
        console.log('initChat')

        const client = StreamChat.getInstance(STREAM_API_KEY)
        await client.connectUser(
          {
            id: authData._id,
            name: authData.fullName,
            image: authData.profilePicture
          },
          tokenData
        )
        //create channel
        const channelId = [authData._id, targetUserId].sort().join('-')
        //you and me
        // => who first that is who create chat first
        const channel = client.channel('messaging', channelId, {
          members: [authData._id, targetUserId]
        })

        await channel.watch()
        setChatClient(client)
        setChannel(channel)
      } catch (error) {
        console.log(error)
        toast.error('Something went wrong, cant connect!')
      } finally {
        setLoading(false)
      }
    }
    initChat()
  }, [tokenData, authData, targetUserId])
  // console.log(loading)
  if (loading || !chatClient || !channel) return <ChatLoader />

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`
      // window.open(callUrl)
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`
      })
      toast.success('Video call link sent!')
    }
  }
  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              {/* <ChannelList />
              <ChannelHeader /> */}
              <ChannelHeader />
              <MessageList></MessageList>
              <MessageInput focus></MessageInput>
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
