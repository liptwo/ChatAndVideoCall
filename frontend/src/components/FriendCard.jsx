import React from 'react'
import { Link } from 'react-router-dom'
import { LANGUAGE_TO_FLAG } from '~/utils/constant'

const FriendCard = ({ key = '', friend = {} }) => {
    return (
        <div
            key={friend._id}
            className='card bg-base-200 hover:shadow-md transition-shadow'
        >
            <div className='card-body p-6'>
                {/* Avatar and Name */}
                <div className='flex items-center gap-7 mb-4'>
                    <div className='avatar size-12'>
                        <img
                            src={
                                friend?.profilePicture ||
                                'https://avatar.iran.liara.run/public/40'
                            }
                            alt=''
                        />
                    </div>
                    <h3 className='font-semibold truncate'>
                        {friend?.fullName || 'Liptwo'}
                    </h3>
                </div>

                {/* Actions */}
                <div className='flex flex-wrap gap-1.5 mb-3'>
                    <span className='badge badge-secondary text-xs'>
                        {getLanguageFlag(friend?.nativeLanguege || 'Vietnamese')}
                        Native: {friend?.nativeLanguege || 'Vietnamese'}
                    </span>
                    <span className='badge badge-outline text-xs'>
                        {getLanguageFlag(friend?.learningLanguege || 'English')}
                        Learning: {friend?.learningLanguege || 'English'}
                    </span>
                </div>

                {/* Button */}
                <Link to={`/chat/${friend._id}`} className={'btn btn-outline w-full'}>
                    Message
                </Link>
            </div>
        </div>
    )
}

export default FriendCard

export function getLanguageFlag(language) {
    if (!language) return null
    const langLower = language.toLowerCase()
    const countryCode = LANGUAGE_TO_FLAG[langLower]
    if (countryCode) {
        return (
            <img
                src={`https://flagcdn.com/24x18/${countryCode}.png`}
                alt={`${langLower} flag}`}
                className='h-3 mr-1 inline-block'
            />
        )
    }

    return null
}