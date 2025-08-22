import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useAuthUser from '~/hooks/useAuthUser'
import { onboardingUpdateApi } from '~/lib/api'
import {
    CameraIcon,
    EarthIcon,
    Globe,
    LoaderCircle,
    MapPinIcon,
    Shuffle
} from 'lucide-react'
import { LANGUAGES } from '~/utils/constant'
const OnBoarding = () => {
    const navigate = useNavigate()
    const querryClient = useQueryClient()
    const { isLoading, authData } = useAuthUser()
    const authUser = authData
    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || '',
        bio: authUser?.bio || '',
        profilePicture: authUser?.profilePicture || '',
        nativeLanguage: authUser?.nativeLanguage || '',
        learningLanguage: authUser?.learningLanguage || '',
        location: authUser?.location || ''
    })
    // console.log('formstate', formState)

    const { mutate: onboardingMutation, isPending } = useMutation({
        mutationFn: onboardingUpdateApi,
        onSuccess: () => {
            toast.success('Onboarding successfully')
            querryClient.invalidateQueries({ queryKey: ['authUser'] })
            navigate('/')
        },
        onError: (err) => {
            toast.error(err.response.data.message)
        },
        retry: false
    })

    const handleOnboarding = (e) => {
        e.preventDefault()
        onboardingMutation(formState)
    }
    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 100) + 1
        setFormState({
            ...formState,
            profilePicture: `https://avatar.iran.liara.run/public/${idx}.png`
        })
        toast.success('Avatar change successfully')
        // console.log(formState.profilePicture)
    }
    if (isLoading) return <PageLoading />

    return (
        <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
            <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
                <div className='card-body p-6 sm:p-8'>
                    <h1 className='flex items-center justify-center font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider text-3xl '>
                        Complete your profile
                    </h1>

                    <form onSubmit={handleOnboarding} className='space-y-6'>
                        {/* Profile Picture */}
                        <div className='flex flex-col items-center justify-center space-y-4'>
                            {/* Image Preview */}
                            <div className='size-32 rounded-full bg-base-400 overflow-hidden'>
                                {formState?.profilePicture ? (
                                    <img
                                        src={formState?.profilePicture}
                                        className='w-full h-full object-cover'
                                        alt=''
                                    />
                                ) : (
                                    <div className='flex items-center justify-center w-full h-full'>
                                        <CameraIcon className='size-12 text-base-content opacity-40' />
                                    </div>
                                )}
                            </div>
                            {/* Button random avatar */}
                            <div className='flex items-center justify-center gap-2'>
                                <button
                                    onClick={handleRandomAvatar}
                                    type='button'
                                    className='btn btn-primary rounded-3xl'
                                >
                                    <Shuffle size={20} /> Generate Radom Avatar
                                </button>
                            </div>
                        </div>

                        {/* Full name */}
                        <div className='form-control w-full'>
                            <label className='label'>
                                <span className='label-text'>Full Name</span>
                            </label>
                            <input
                                // placeholder='Liptwo'
                                name='fullName'
                                className='input input-bordered w-full'
                                value={formState.fullName}
                                placeholder='Your Full Name'
                                onChange={(e) =>
                                    setFormState({ ...formState, fullName: e.target.value })
                                }
                                type='text'
                                required
                            />
                        </div>
                        {/* Bio  */}
                        <div className='form-control w-full'>
                            <label className='label'>
                                <span className='label-text'>Bio</span>
                            </label>
                            <textarea
                                name='bio'
                                placeholder='Let write something about yourself'
                                className='textarea textarea-bordered h-24'
                                value={formState.bio}
                                onChange={(e) =>
                                    setFormState({ ...formState, bio: e.target.value })
                                }
                                type='text'
                                required
                            ></textarea>
                            {/*  Language */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {/* Native language */}
                                <div className='form-control w-full max-w-xs'>
                                    <label className='label'>
                                        <span className='label-text'>Native Language</span>
                                    </label>
                                    <select
                                        className='select select-bordered'
                                        name='nativeLanguage'
                                        value={formState.nativeLanguage || ''}
                                        onChange={(e) =>
                                            setFormState({
                                                ...formState,
                                                nativeLanguage: e.target.value
                                            })
                                        }
                                    >
                                        <option value='' disabled>
                                            Select your native language
                                        </option>
                                        {LANGUAGES.map((language) => (
                                            <option
                                                key={`native-${language}`}
                                                value={language.toLowerCase()}
                                            >
                                                {language}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Learning language */}
                                <div className='form-control w-full max-w-xs'>
                                    <label className='label'>
                                        <span className='label-text'>Learning Language</span>
                                    </label>
                                    <select
                                        className='select select-bordered '
                                        name='learningLanguage'
                                        defaultValue={formState.learningLanguage || ''}
                                        onChange={(e) =>
                                            setFormState({
                                                ...formState,
                                                learningLanguage: e.target.value
                                            })
                                        }
                                    >
                                        <option value='' disabled>
                                            Select your learing language
                                        </option>
                                        {LANGUAGES.map((language) => (
                                            <option
                                                key={`learning-${language}`}
                                                value={language.toLowerCase()}
                                            >
                                                {language}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* location */}
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Location</span>
                                </label>
                                <div className='relative'>
                                    <MapPinIcon
                                        className='size-5 absolute top-1/2 transform -translate-y-1/2 left-3
                  text-base-content opacity-70'
                                    />
                                    <input
                                        type='text'
                                        name='location'
                                        className='input input-bordered w-full pl-10'
                                        placeholder='City, Country'
                                        value={formState.location || ''}
                                        onChange={(e) =>
                                            setFormState({ ...formState, location: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            className='btn btn-primary w-full'
                            disabled={isPending}
                            type='submit'
                        >
                            {isPending ? (
                                <>
                                    <LoaderCircle className='size-6 animate-spin mr-2' />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Globe className='size-6' />
                                    Update Profile
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default OnBoarding