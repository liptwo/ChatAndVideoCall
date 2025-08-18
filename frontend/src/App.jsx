import './App.css'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import OnBoarding from './pages/OnBoarding'
// import Chat from './pages/ChatPage'
import Call from './pages/CallPage'
import PageLoading from './components/PageLoading'
import useAuthUser from './hooks/useAuthUser'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import Friends from './pages/Friends'
import Notifications from './pages/Notifications'
import { useThemeStore } from './store/useThemeStore'
import ChatPage from './pages/ChatPage'

function App() {
  // const [data, setData] = useState(null)
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState(null)
  // useEffect(() => {
  //   setIsLoading(true)
  //   const getData = async () => {
  //     try {
  //       // Simulate fetching data
  //       const response = await fetch('https://jsonplaceholder.typicode.com/todos')
  //       const result = await response.json()
  //       setData(result)
  //     } catch (err) {
  //       setError(err)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   getData()
  //   // Fetch user data or perform any initial setup here
  //   // Example: fetchUserData().then(setData).catch(setError)
  // }, [])
  // phương pháp thay thế là useQuery từ react-query
  // tankstack query crash course
  // delete => post, put, delete
  const { isLoading, authData } = useAuthUser()
  const [isAuth, setIsAuth] = useState(false)
  const [isOnboarded, setIsOnboarded] = useState(false)
  const { theme } = useThemeStore()
  useEffect(() => {
    setIsOnboarded(authData?.isOnboarded || false)
    setIsAuth(Boolean(authData))
  }, [authData])
  console.log(
    'isAuth',
    isAuth,
    'isOnboarded',
    isOnboarded,
    'isLoading',
    isLoading
  )
  if (isLoading) return <PageLoading />

  const ProtectedRoute = ({ isAuth }) => {
    if (!isAuth) {
      return <Navigate to='/login' replace={true} />
    } else {
      return <Outlet />
    }
  }
  const IsOnBoarding = ({ isOnboarded }) => {
    if (!isOnboarded) {
      return <Navigate to='/onboarding' replace={true} />
    } else {
      return <Outlet />
    }
  }

  return (
    <div
      className='h-screen overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
      data-theme={theme}
    >
      <Routes>
        {/* Define your routes here */}
        <Route element={<ProtectedRoute isAuth={isAuth} />}>
          <Route element={<IsOnBoarding isOnboarded={isOnboarded} />}>
            <Route
              path='/'
              element={
                <Layout showSideBar={true}>
                  <Home />
                </Layout>
              }
            />
            <Route
              path='/chat/:id'
              element={
                <Layout showSideBar={false}>
                  {' '}
                  <ChatPage />{' '}
                </Layout>
              }
            />
            <Route
              path='/friends'
              element={
                <Layout showSideBar={true}>
                  <Friends />
                </Layout>
              }
            />
            <Route
              path='/notifications'
              element={
                <Layout showSideBar={true}>
                  <Notifications />
                </Layout>
              }
            />
          </Route>
        </Route>
        <Route path='/call/:id' element={<Call />} />
        {/* <Route path='/call' element={<Call />} /> */}
        <Route
          path='/onboarding'
          element={
            isAuth ? <OnBoarding /> : <Navigate to='/login' replace={true} />
          }
        />

        <Route
          path='/signup'
          element={isAuth ? <Navigate to='/' replace={true} /> : <SignUp />}
        />
        <Route
          path='/login'
          element={isAuth ? <Navigate to='/' replace={true} /> : <Login />}
        />

        {/* <Route path="/about" element={<About />} /> */}
        {/* Add more routes as needed */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster
        toastOptions={{
          className: 'bg-primary/20',
          style: {
            border: '1px solid #713200',
            color: '#713200'
          }
        }}
        position='bottom-right'
        reverseOrder={false}
      />
    </div>
  )
}

export default App
