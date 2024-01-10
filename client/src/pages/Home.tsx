import UserInfo from "../components/UserInfo"
import FriendList from "../components/FriendList"
import Posts from "../components/post/Posts"
import MainNavigation from "../components/MainNavigation"
import { useState, useContext, useEffect, useCallback } from "react"
import useHttp from "../hooks/use-http"
import { context } from "../store/context"
import { userType, postsType, friendType } from "../App"
import EditProfile from "../components/EditProfile"
import Overlay from "../UI/Overlay"
import EditSocialProfile from "../components/EditSocialProfile"

export type socialType = "twitter" | "linkedin" | ""

const Home = () => {
  const [user, setUser] = useState<userType>()
  const { userId, token } = useContext(context)
  const { sendData } = useHttp()
  const [posts, setPosts] = useState<postsType>([])
  const [friends, setFriends] = useState<friendType[] | []>([])
  const [editProfile, setEditProfile] = useState<boolean>(false)
  const [isEditSocial, setIsEditSocial] = useState<boolean>(false)
  const [profile, setProfile] = useState<socialType>("")

  const updatePosts = useCallback(() => {
    const options = {
      headers: {
        Authorization: "Bearer " + token,
      },
    }

    sendData<{ posts: postsType }>(`feed/posts`, options, (res) => {
      const posts = res?.posts
      setPosts(posts || [])
    })
  }, [sendData, token])

  const updateUser = useCallback(() => {
    const options = {
      headers: {
        Authorization: "Bearer " + token,
      },
    }

    sendData<{ user: userType }>(`profile/${userId}`, options, (res) => {
      const user = res?.user
      setUser(user)
      setFriends(user?.friends || [])
    })
  }, [sendData, userId, token])

  useEffect(() => {
    updateUser()
  }, [updateUser])

  useEffect(() => {
    updatePosts()
  }, [updatePosts])

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
      {editProfile && (
        <>
          <Overlay onClick={toggleEditPopup} />
          <EditProfile
            updateUser={updateUser}
            user={user}
            onClick={toggleEditPopup}
          />
        </>
      )}

      {isEditSocial && (
        <>
          <Overlay onClick={toggleSocialEdit} />
          <EditSocialProfile
            updateUser={updateUser}
            profiles={user?.socialProfiles}
            isReadOnly={false}
            profile={profile}
            onToggle={toggleSocialEdit}
          />
        </>
      )}
      <main className="container home-page flex justify-between pt-3 items-start gap-3">
        <UserInfo
          // isSettingsHidden={false}
          user={user}
          onDetails={toggleEditPopup}
          onSocial={toggleSocialEdit}
          onSetProfile={profileHandler}
        />
        <Posts
          posts={posts}
          friends={friends}
          updatePosts={updatePosts}
          updateUser={updateUser}
        />
        <FriendList friends={friends || []} updateUser={updateUser} />
      </main>
      {/* <footer className="w-full h-16 rounded-t-lg bg-[#6cb6fe] fixed bottom-0 left-0 flex sm:hidden justify-center">
        <button className="text-[5rem] text-[#10425d] absolute transform -translate-y-1/3 ">
          <IoAddCircle />
        </button>
      </footer> */}
    </>
  )
}

export default Home
