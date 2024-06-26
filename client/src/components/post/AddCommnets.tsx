import { useRef, useContext } from 'react'

import { context } from '../../store/context'
import useHttp from '../../hooks/use-http'
import { postType } from '../../types'

const AddComment: React.FC<{
  onToggle: () => void
  postId: string
  userId: string
  onComment: ({ post }: { post: postType }) => void
}> = ({ onToggle, postId, userId, onComment }) => {
  const { sendData } = useHttp()
  const commentInputRef = useRef<HTMLInputElement | null>(null)
  const { token } = useContext(context)
  const commentSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault()
    const comment = commentInputRef.current!.value
    const options = {
      method: 'PUT',
      body: JSON.stringify({ comment, userId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }

    sendData(
      `feed/add-comment/${postId}`,
      options,
      (result?: { post: postType }) => {
        onToggle()
        if (result) onComment(result)
      }
    )
  }

  return (
    <div className='add-comment p-3 fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-30 bg-white shadow-md dark:bg-[#303030]'>
      <p>Add your comment</p>
      <form action='' onSubmit={commentSubmitHandler}>
        <input
          type='text'
          ref={commentInputRef}
          className='border outline-none p-2'
          autoFocus
        />
      </form>
    </div>
  )
}

export default AddComment
