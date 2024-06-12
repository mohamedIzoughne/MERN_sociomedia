import ReactDOM from 'react-dom'
import UserInfo from '../components/UserInfo'
import FriendList from '../components/FriendList'
import Posts from '../components/post/Posts'
import MainNavigation from '../components/MainNavigation'
import { useState, useContext, useEffect, useCallback } from 'react'
import useHttp from '../hooks/use-http'
import { context } from '../store/context'
import { postsType, socialType } from '../types'
import EditProfile from '../components/EditProfile'
import Overlay from '../UI/Overlay'
import EditSocialProfile from '../components/EditSocialProfile'
import Loader from '../UI/Loader'

const Home = () => {
  const { token, user, updateUser } = useContext(context)
  const { sendData, isLoading } = useHttp()
  const [posts, setPosts] = useState<postsType>([])
  const [editProfile, setEditProfile] = useState<boolean>(false)
  const [isEditSocial, setIsEditSocial] = useState<boolean>(false)
  const [profile, setProfile] = useState<socialType>('')
  let page = 1
  let pageCount = 1
  const updatePosts = useCallback(() => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }

    sendData<{ posts: postsType }>(
      `feed/posts?page=1&count=${pageCount}`,
      options,
      (res) => {
        const posts = res?.posts
        setPosts(posts || [])
      }
    )
  }, [sendData, token])

  const getPagePosts = useCallback(() => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }
    pageCount++
    sendData<{ posts: postsType }>(
      `feed/posts?page=${++page}`,
      options,
      (res) => {
        const posts = res?.posts
        if (posts?.length) {
          setPosts((prevPosts) => [...prevPosts, ...posts])
        }
      }
    )
  }, [sendData, token])

  useEffect(() => {
    updateUser()
    updatePosts()
  }, [updateUser, updatePosts])


  // handlers
  const toggleEditPopup = () => {
    setEditProfile((prev) => !prev)
  }

  const toggleSocialEdit = () => {
    setIsEditSocial((prev) => !prev)
  }

  const profileHandler = (profile: socialType) => {
    setProfile(profile)
  }

  return (
    <>
      <MainNavigation />
      {isLoading && <Loader />}
      {editProfile &&
        ReactDOM.createPortal(
          <>
            <Overlay onClick={toggleEditPopup} />
            <EditProfile
              updateUser={updateUser}
              user={user}
              onClick={toggleEditPopup}
            />
          </>,
          document.getElementById('modals')!
        )}

      {isEditSocial &&
        ReactDOM.createPortal(
          <>
            <Overlay onClick={toggleSocialEdit} />
            <EditSocialProfile
              updateUser={updateUser}
              profiles={user?.socialProfiles}
              isReadOnly={false}
              profile={profile}
              onToggle={toggleSocialEdit}
            />
          </>,
          document.getElementById('modals')!
        )}
      <main className='container home-page flex justify-between pt-3 items-start gap-3'>
        <UserInfo
          isHimself={true}
          user={user}
          onDetails={toggleEditPopup}
          onSocial={toggleSocialEdit}
          onSetProfile={profileHandler}
        />
        <Posts
          posts={posts}
          friends={user.friends}
          updatePosts={updatePosts}
          updateUser={updateUser}
          getPagePosts={getPagePosts}
        />
        <FriendList
          friends={user.friends || []}
          updateUser={updateUser}
          className='hidden md:block'
        />
      </main>
    </>
  )
}

export default Home
