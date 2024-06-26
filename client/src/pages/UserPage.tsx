import UserInfo from '../components/UserInfo'
import MainNavigation from '../components/MainNavigation'
import Posts from '../components/post/Posts'
import { useEffect, useState, useCallback, useContext } from 'react'
import useHttp from '../hooks/use-http'
import { context } from '../store/context'
import { useParams } from 'react-router-dom'
import EditProfile from '../components/EditProfile'
import Overlay from '../UI/Overlay'
import EditSocialProfile from '../components/EditSocialProfile'
import { socialType,  userType, postsType } from '../types'
import ReactDOM from 'react-dom'

const UserPage = () => {
  const [user, setUser] = useState<userType>()
  const { token, userId } = useContext(context)
  const { sendData } = useHttp()
  const [posts, setPosts] = useState<postsType>([])
  const { targetId } = useParams()
  const [isEditSocial, setIsEditSocial] = useState<boolean>(false)
  const [editProfile, setEditProfile] = useState<boolean>(false)
  const [profile, setProfile] = useState<socialType>('')
  const isHimself = userId === targetId

  const updatePosts = useCallback(() => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }

    sendData<{ posts: postsType }>(`feed/posts/${targetId}`, options, (res) => {
      const posts = res?.posts
      setPosts(posts || [])
    })
  }, [sendData, token, targetId])

  useEffect(() => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }

    sendData<{ user: userType }>(`profile/${targetId}`, options, (res) => {
      const user = res?.user
      setUser(user)
    })
  }, [sendData, targetId, token])

  useEffect(() => {
    updatePosts()
  }, [updatePosts])

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
      <section className='container flex justify-between pt-3 items-start gap-3 flex-col sm:flex-row'>
        {editProfile &&
          ReactDOM.createPortal(
            <>
              <Overlay onClick={toggleEditPopup} />
              <EditProfile user={user} onClick={toggleEditPopup} />
            </>,
            document.getElementById('modals')!
          )}
        {isEditSocial &&
          ReactDOM.createPortal(
            <>
              <Overlay onClick={toggleSocialEdit} />
              <EditSocialProfile
                profiles={user?.socialProfiles}
                isReadOnly={!isHimself}
                profile={profile}
                onToggle={toggleSocialEdit}
              />
            </>,
            document.getElementById('modals')!
          )}
        <UserInfo
          userPage
          user={user}
          onDetails={toggleEditPopup}
          onSocial={toggleSocialEdit}
          onSetProfile={profileHandler}
          isHimself={isHimself}
        />
        <Posts userPage posts={posts} />
      </section>
    </>
  )
}

export default UserPage
