import Login from '../components/Login'
import Signup from '../components/Signup'
const SignUpPage = (props: { hasAccount: boolean }) => {
  return (
    <>
      <header>
        <h1 className='text-center text-lg p-[15px] bg-white text-main font-bold'>
          SocioMedia{' '}
        </h1>
      </header>
      {props.hasAccount ? <Login /> : <Signup />}
    </>
  )
}

export default SignUpPage
