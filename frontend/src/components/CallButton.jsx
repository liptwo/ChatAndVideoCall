import { VideoIcon } from 'lucide-react'
import React from 'react'

const CallButton = ({ handleVideoCall }) => {
    return (
        <div className='p-4 border-b flex items-center justify-end max-w-10xl mx-auto w-full absolute top-0'>
            <button
                onClick={handleVideoCall}
                className='
      btn btn-success btn-sm text-white'
            >
                <VideoIcon className='size-5'></VideoIcon>
            </button>
        </div>
    )
}

export default CallButton