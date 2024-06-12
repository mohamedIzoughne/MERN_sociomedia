import React, { useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import AddComment from './AddCommnets'
import ReactDOM from 'react-dom'
import Overlay from '../../UI/Overlay'
import { postType , commentsType} from '../../types'

type propTypes = {
  comments: commentsType
  postId: string
  userId: string
  onComment: ({ post }: { post: postType }) => void
}

const Comment: React.FC<{
  content: string
  name: string
  imageUrl: string
}> = ({ content, name, imageUrl }) => {
  return (
    <li className='border-b border-gray-200 border-solid mb-2 p-2 flex gap-2 font-bold last:border-none mx-3'>
      <div className='image-holder aspect-square w-[33px] h-[33px] rounded-full overflow-hidden'>
        <img className='w-full h-full object-cover' src={(import.meta.env.VITE_SERVER_API || '') + imageUrl} alt='' />
      </div>
      <div className='info'>
        <h5 className='name text-sm'>{name}</h5>
        <p className='text-xs font-light'>{content}</p>
      </div>
    </li>
  )
}

const Comments: React.FC<propTypes> = ({
  comments,
  postId,
  userId,
  onComment,
}) => {
  const [commentAddIsShown, setCommentAddIsShown] = useState<boolean>(false)

  const toggleCommentAdd = () => {
    setCommentAddIsShown((prev) => !prev)
  }

  return (
    <section className='relative'>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => {
            return (
              <Comment
                key={comment._id}
                content={comment.content}
                name={comment.creatorName}
                imageUrl={comment.creatorImageUrl}
              />
            )
          })}
        </ul>
      ) : (
        <p className='text-center p-3 font-semibold'>There is no comments !</p>
      )}
      <button
        onClick={toggleCommentAdd}
        className='bg-main text-white text-lg p-2 absolute -bottom-7 left-1/2 transform -translate-x-1/2 rounded-full'
      >
        <BiPlus />
      </button>
      {commentAddIsShown &&
        ReactDOM.createPortal(
          <>
            <Overlay onClick={toggleCommentAdd} />{' '}
            <AddComment
              userId={userId}
              onComment={onComment}
              onToggle={toggleCommentAdd}
              postId={postId}
            />
          </>,
          document.getElementById('modals')!
        )}
    </section>
  )
}

export default Comments
