import { LoaderIcon } from 'lucide-react'
import React from 'react'

const ChatLoader = ({ type = 'chat' }) => {
    return (
        <div className='p-4 h-[90vh] flex flex-col items-center justify-center'>
            <LoaderIcon className='animate-spin size-10 text-primary'></LoaderIcon>
            <p className='mt-4 text-center text-lg'>
                {type === 'call' ? 'Connecting Video' : 'Connecting to chat....'}
            </p>
        </div>
    )
}

export default ChatLoader