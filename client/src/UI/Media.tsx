import { IoDocumentOutline } from 'react-icons/io5'

const Media: React.FC<{ fileUrl: string; type: string }> = ({
  fileUrl,
  type,
}) => {
  let content = <></>

  switch (type) {
    case 'image':
      content = <img src={fileUrl} alt='media' />
      break
    case 'video':
      content = <video className='mt-2' src={fileUrl} controls />
      break
    case 'audio':
      content = <audio className='mx-auto mt-2' src={fileUrl} controls />
      break
    case 'application':
      content = (
        <a
          className='flex items-center mt-2 mx-auto px-3 py-1 w-fit bg-[#303030] text-white dark:bg-white dark:text-black rounded-sm'
          href={fileUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <IoDocumentOutline className='mr-2' />
          Document
        </a>
      )
      break
  }

  return <>{content}</>
}

export default Media
