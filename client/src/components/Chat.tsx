import { LiaTimesSolid } from 'react-icons/lia'
import { SlArrowDown } from 'react-icons/sl'
import { LuSendHorizonal } from 'react-icons/lu'

import React, { useContext, useEffect, useState } from 'react'
import { context } from '../store/context'
import io from 'socket.io-client'
import useHttp from '../hooks/use-http'

const socket = io(import.meta.env.VITE_SERVER_API)
type messageType = {
  _id: string
  creator: string
  content: string
  recipient: string
}

const MessageItem: React.FC<{
  isUser: boolean
  message: string
}> = ({ isUser, message }) => {
  const { chattedTo, user } = useContext(context)
  const imageUrl =
    import.meta.env.VITE_SERVER_API +
    (isUser ? user.imageUrl : chattedTo.imageUrl)

  return (
    <li
      className={
        'flex gap-1 rounded-xs max-w-fit ' +
        (isUser ? 'flex-row-reverse ml-auto' : ' mr-auto')
      }
    >
      <div className='image-holder w-[30px] h-[30px] mt-1'>
        <img src={imageUrl} alt='' />
      </div>
      <div
        className={
          'message w-[245px]min-w-[61px] p-2 leading-none' +
          (isUser ? ' bg-main text-white ' : ' bg-[#E9EFFF]  text-black')
        }
      >
        {message}
      </div>
    </li>
  )
}

const Chat = () => {
  const [showChatBody, setShowChatBody] = useState(true)
  const { chatHandler, chattedTo, userId } = useContext(context)
  const [messages, setMessages] = useState<messageType[]>([])
  const [message, setMessage] = useState('')

  const { sendData } = useHttp()
  const toggleShowChat = () => {
    setShowChatBody((prev) => !prev)
  }

  const messageSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault()

    const fullMessage = {
      _id: Math.random().toString(),
      creator: userId,
      recipient: chattedTo.id,
      content: message,
    }
    setMessages((prev) => [...prev, fullMessage])
    socket.emit('chat', {
      msg: message,
      senderId: userId,
      receiverId: chattedTo.id,
    })
    setMessage('')
  }

  useEffect(() => {
    socket.emit('register', userId)
    socket.on('chat', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    sendData<{ messages: [] }>(
      `chat/messages?user1=${userId}&user2=${chattedTo.id}`,
      { method: 'GET' },
      (res) => {
        if (res) {
          setMessages(res.messages)
        }
      }
    )

    return () => {
      socket.off('chat')
    }
  }, [sendData, userId])

  return (
    <div
      className={
        'fixed bg-white dark:bg-[#303030] bottom-0 left-2 w-[331px] border border-solid border-gray-200 transition-all overflow-hidden ' +
        (showChatBody ? 'h-[642px]' : 'h-[64px]')
      }
    >
      <div className='head flex p-3'>
        <button
          className='remove pr-1 text-xl text-gray-500'
          onClick={chatHandler}
        >
          <LiaTimesSolid />
        </button>
        <div className='info flex'>
          <div className='image-holder w-[40px] h-[40px] rounded-full overflow-hidden'>
            <img
              src={import.meta.env.VITE_SERVER_API + chattedTo.imageUrl}
              alt=''
            />
          </div>
          <p className='ml-2'> {chattedTo.name}</p>
        </div>

        <button className='ml-auto pl-1 text-xl' onClick={toggleShowChat}>
          <SlArrowDown
            className={
              'transform duration-200' +
              (showChatBody ? ' rotate-180' : ' rotate-0')
            }
          />
        </button>
      </div>
      <div className='body h-[473px] pb-4 overflow-y-auto overflow-x-hidden border-y border-gray-100 border-solid pt-10 px-2 transform duration-200 origin-bottom'>
        <ul className='grid gap-3'>
          {messages.map((message) => (
            <MessageItem
              key={message._id}
              isUser={message.creator === userId}
              message={message.content}
            />
          ))}
          {/* <li className='flex gap-1 mb-3 rounded-xs'>
            <div className='image-holder w-[30px] h-[30px] mt-1'>
              <img src={image} alt='' />
            </div>
            <div className='message w-[245px] bg-main min-w-[61px] text-white p-2 leading-none'>
              Hello man How are you, are you very well
            </div>
          </li>
          <li className='flex flex-row-reverse gap-1 rounded-xs'>
            <div className='image-holder w-[30px] h-[30px] mt-1'>
              <img src={image} alt='' />
            </div>
            <div className='message w-[245px] bg-main bg-[#E9EFFF] min-w-[61px] text-black p-2 leading-none'>
              Hello man How are you, are you very well
            </div>
          </li> */}
        </ul>
      </div>
      <form
        className='chat-form pb-8 pt-5 px-2 flex items-center'
        onSubmit={messageSubmitHandler}
      >
        <input
          type='text'
          dir='auto'
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          className='bg-[#ECEEF4] w-[265px] h-[51px] pl-3 pr-1 outline-main'
          placeholder='write message'
        />
        <button
          type='submit'
          className='text-2xl p-3 text-main dark:text-white'
        >
          <LuSendHorizonal />
        </button>
      </form>
    </div>
  )
}

export default Chat
