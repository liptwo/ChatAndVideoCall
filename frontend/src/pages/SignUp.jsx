import React, { useState } from 'react'
import { LoaderCircle, Slack } from 'lucide-react'
import signImg from '~/assets/signup.png'
// import axiosInstance from '~/lib/axios'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
// import { signUpApi } from '~/lib/api'
import useSignUp from '~/hooks/useSignUp'
const SignUp = () => {
  // const navigate = useNavigate()
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const { error, isPending, signUpMutation } = useSignUp()
  const handleSignUp = (e) => {
    e.preventDefault()
    signUpMutation(signUpData)
  }
  // console.log('error', error)
  if (error) toast.error(error.response.data.message)

  return (
    <div
      className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8'
      data-theme='sunset'
    >
      <div
        className='border boder-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100
      rounded-xl shadow-lg overflow-hidden'
      >
        {/* Sign Up form -left side */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
          {/* Logo */}
          <div className='mb-4 flex items-center jusity-start gap-3'>
            <Slack className='size-9 text-primary' />
            <span
              className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary
            tracking-wider'
            >
              Chat Video App
            </span>
          </div>
          {/* {error && (
            <div className='alert alert-error mb-4'> 
              <span>{error?.response?.data?.message}</span>
            </div>
          )} */}
          <div className='w-full'>
            <form onSubmit={handleSignUp}>
              <div>
                <h2 className='text-xl font-semibold'>Create An Account</h2>
                <p>Join Chat Video App and start your journey</p>
              </div>

              <div className='space-y-3'>
                {/* Full name */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Full Name</span>
                  </label>
                  <input
                    placeholder='Enter your name'
                    className='input input-bordered w-full'
                    value={signUpData.fullName}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, fullName: e.target.value })
                    }
                    type='text'
                    required
                  />
                </div>
                {/* Email */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input
                    placeholder='liptwo@example.com'
                    className='input input-bordered w-full'
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                    type='email'
                    required
                  />
                </div>
                {/* Password */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Password</span>
                  </label>
                  <input
                    placeholder='********'
                    className='input input-bordered w-full'
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, password: e.target.value })
                    }
                    type='password'
                    required
                  />
                  <p className='text-xs opacity-70 mt-1'>
                    Password must be at least 8 characters
                  </p>
                </div>
                {/* Password */}
                <div className='form-control'>
                  <label className='label cursor-pointer justify-start gap-2'>
                    {/* <span className='label-text'>Password</span> */}

                    <input
                      type='checkbox'
                      className='checkbox checkbox-sm'
                      required
                    />
                    <span className='text-xs leading-tight'>
                      I agree to the{' '}
                      <span className='text-primary hover:underline'>
                        terms of service
                      </span>{' '}
                      and{' '}
                      <span className='text-primary hover:underline'>
                        privacy policy
                      </span>
                    </span>
                  </label>
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
                      {/* <Globe className='size-6' /> */}
                      Sign Up
                    </>
                  )}
                </button>

                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Already have an account?{' '}
                    <Link to='/login' className='text-primary hover:underline'>
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Signup Form - right Side */}
        <div className='hidden lg:flex w-full lg:w-1/2 items-center justify-center bg-primary/30'>
          <div className='max-w-md p-8'>
            {/* Illustration */}
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img className=' pointer-events-none' src={signImg} alt='' />
            </div>

            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>
                {' '}
                Connect with another people around the wolrd
              </h2>
              <p className='opacity-70'>
                Practice conversations, make friends, and improve your languages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
