import PostPublish from './PostPublish'
import Post from './Post'
import useHttp from '../../hooks/use-http'
import { useContext } from 'react'
import { context } from '../../store/context'
import { friendType, postsType } from '../../types'
import { IoReloadOutline } from 'react-icons/io5'

type propsType = {
  posts: postsType
  updatePosts?: () => void
  updateUser?: () => void
  friends?: friendType[] | []
  userPage?: true
  getPagePosts?: () => void // after, it will be obligatory
}

const Posts: React.FC<propsType> = ({
  posts,
  updatePosts,
  friends = [],
  userPage,
  getPagePosts,
}) => {
  const { token } = useContext(context)
  const { sendData } = useHttp()

  const addFriendHandler: (id: string) => void = (id) => {
    if (!userPage) {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }

      sendData(`chat/invitation/${id}`, options)
      window.alert('invitation sent')
    }
  }

  const checkIfExists = (creatorId: string) => {
    return !!friends.find((fr) => fr.friendId === creatorId)
  }

  return (
    <section className={userPage ? 'flex-grow-2' : 'flex-grow'}>
      {!userPage && <PostPublish updatePosts={updatePosts!} />}
      <ul>
        {posts.map((post) => {
          return (
            <Post
              friends={friends}
              addFriendHandler={addFriendHandler}
              key={post._id}
              post={post}
              isFriendAdded={checkIfExists(post.creator.id)}
            />
          )
        })}
      </ul>
      <button
        className='bg-red block mx-auto cursor-pointer mb-3'
        onClick={getPagePosts}
      >
        <IoReloadOutline className='text-4xl' />
      </button>
    </section>
  )
}

export default Posts
