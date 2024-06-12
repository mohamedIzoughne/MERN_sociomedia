import { useContext } from 'react'
import FriendList from '../components/FriendList'
import { context } from '../store/context'
import MainNavigation from '../components/MainNavigation'

const FriendsPage = () => {
  const { user, updateUser } = useContext(context)

  return (
    <>
      <MainNavigation />
      <div className='container'>
        <FriendList
          className='mt-10'
          updateUser={updateUser}
          friends={user.friends}
        />
      </div>
    </>
  )
}

export default FriendsPage
