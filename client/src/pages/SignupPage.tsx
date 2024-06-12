import Login from '../components/Login'
import Signup from '../components/Signup'
const SignUpPage = (props: { hasAccount: boolean }) => {
  return (
    <>
      <header className='bg-white dark:bg-[#303030]'>
        <h1 className='text-center text-lg p-[15px] text-main font-bold'>
          SocioMedia{' '}
        </h1>
      </header>
      {props.hasAccount ? <Login /> : <Signup />}
    </>
  )
}

export default SignUpPage
