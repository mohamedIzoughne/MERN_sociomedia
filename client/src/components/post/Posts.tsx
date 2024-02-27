import PostPublish from './PostPublish'
import Post from './Post'
import useHttp from '../../hooks/use-http'
import { useContext } from 'react'
import { context } from '../../store/context'
import { friendType, postsType } from '../../App'

type propsType = {
  posts: postsType
  updatePosts?: () => void
  updateUser?: () => void
  friends?: friendType[] | []
  userPage: undefined | true
}

const Posts: React.FC<propsType> = ({
  posts,
  updatePosts,
  updateUser,
  friends = [],
  userPage,
}) => {
  const { token } = useContext(context)
  const { sendData } = useHttp()

  let addFriendHandler: (id: string) => void
  if (!userPage) {
    addFriendHandler = (friendId) => {
      const options = {
        method: 'PUT',
        body: JSON.stringify({ friendId }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }

      sendData('profile/add-friend', options, () => {
        updateUser!()
      })
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
    </section>
  )
}

export default Posts
