import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope  } from '@fortawesome/free-solid-svg-icons'

function SuccessForgotPassword(){
    return (
        <>
            <div className="message">
                <div className='message-bg'>
                    <FontAwesomeIcon className='message-bg__icon' icon={faEnvelope} style={{color: "#b7b0fe",}} />
                    <div className='message-bg__title'>Successful!</div>
                    <div className='send-token-message'> An reset password link has been sent to your email</div>
                </div>
            </div>
        </>
    )
}
export default SuccessForgotPassword;