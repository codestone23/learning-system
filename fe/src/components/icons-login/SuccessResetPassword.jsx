import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

function SuccessResetPassword(){

    return (
    <>
        <div className="message">
            <div className='message-bg'>
            <FontAwesomeIcon className='message-bg__icon message-bg__icon--reset' icon={faCircleCheck} style={{color: "#b7b0fe",}} />
                <div className='message-bg__title'>Password Changed!</div>
                <div className='send-token-message'>Your password has been changed successfully.</div>
                <button type="button" className='message__change--password'>
                    <Link className='message__change--password__link' to="/login">Back Login</Link>
                </button>
            </div>
        </div>
    </>   
    )
}

export default SuccessResetPassword;