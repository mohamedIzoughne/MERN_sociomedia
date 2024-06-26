import useHttp from '../hooks/use-http'
import { BsPersonDash } from 'react-icons/bs'
import { context } from '../store/context'
import { useContext } from 'react'
import { friendType } from '../types'
import { Link } from 'react-router-dom'

interface propsType {
  friends: friendType[] | []
  updateUser: () => void
  className?: string
}

const FriendList: React.FC<propsType> = ({
  friends,
  updateUser,
  className = '',
}) => {
  const { sendData, isLoading } = useHttp()
  const { token } = useContext(context)

  const removeFriendHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const friendId = e.currentTarget.dataset.friend_id
    const options = {
      method: 'PUT',
      body: JSON.stringify({ friendId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }

    sendData('profile/remove-friend', options, () => {
      updateUser()
    })
  }

  return (
    <section
      className={
        'bg-white dark:bg-[#303030] p-4 rounded-sm min-w-[250px] sticky top-[100px] ' +
        className
      }
    >
      <h3 className='font-bold'>Friend list</h3>
      <ul>
        {friends?.length > 0 &&
          friends.map((friend) => {
            return (
              <li key={friend.friendId} className='pb-3 items-center py-3 flex'>
                <Link to={'/user/' + friend.friendId} className='flex'>
                  <div className='image w-14 h-14 overflow-hidden rounded-full'>
                    <img
                      className='w-full'
                      src={`${
                        import.meta.env.VITE_SERVER_API + friend?.imageUrl
                      }`}
                      alt=''
                    />
                  </div>
                  <div className='info'>
                    <a href='' className='inline-block ml-3'>
                      <h3 className='-mb-1 leading-none'>{friend.name}</h3>
                      <small className='text-gray-400'>{friend.location}</small>
                    </a>
                  </div>
                </Link>
                <div className='ml-auto cursor-pointer rounded-full duration-75 bg-[#f4fbffa0] hover:bg-[#e9f5fd] dark:bg-[#595959] dark:hover:bg-[#1b1b1b]'>
                  <button
                    className='p-2'
                    data-friend_id={friend.friendId}
                    onClick={removeFriendHandler}
                  >
                    {isLoading ? '...' : <BsPersonDash />}
                  </button>
                </div>
              </li>
            )
          })}
      </ul>
    </section>
  )
}

export default FriendList
