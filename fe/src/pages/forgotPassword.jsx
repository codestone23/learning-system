import '../assets/styles/root.css'
import '../assets/styles/login.css'
import '../assets/styles/resetPassword.css'
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { Link,useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react';
import { useFormik } from "formik";
import { ToastContainer } from 'react-toastify';
import { notifySuccess } from '../components/notify/NotifySuccess';
import { notifyError } from '../components/notify/NotifyError';
import AuthService from "../services/auth.service";
import SuccessForgotPassword from '../components/icons-login/SuccessForgotPassword'



function ForgotPassword(){
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();
    useEffect(() => {
        if(user){
        console.log(user);
        const relRoles = user.roles.map(role => role.name);
        if(relRoles.includes("Admin")){
            navigate("/configuration/account")
        }else{
            navigate("/courses")
        }
    }
    })
    const formik = useFormik({
        initialValues: {
          email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
              .email("Invalid email format")
              .required("Required!")
          }),
        onSubmit: values => {
            // console.log(values);
            AuthService.forgotPassword(values.email, window.location.host).then((response) => {
                console.log(response.data);
                if (response.data.passwordResetToken) {
                    localStorage.removeItem("resetToken");
                    localStorage.removeItem("passwordResetExpires");
                    localStorage.setItem("resetToken", JSON.stringify(response.data.passwordResetToken));
                    localStorage.setItem("passwordResetExpires", JSON.stringify(response.data.passwordResetExpires));
                }
                console.log(response.data.email);

                if(!response.data.email){ 
                    notifyError(response.data.message);
                }else{
                    
                    setIsSubmit(true);
                    console.log(response.data.message)
                    notifySuccess(response.data.message);
                   
                }
                return response.data;   
            });  
        }
    });
    
    return user ? null : (
        <>
        <div className='login login__change__password'>
            <div className='login__left'> 
                <span className='pass__title-bg'>Welcome to <span className='pass__title-sm pass__title-sm__change--pasword'>BlueOC Internship Program</span></span> 
                <img className='login__img login__img--password' src="/src/assets/images/new-password-avatar.jpg"/>
            </div>
            <div className='login__right'>  
            {isSubmit && <SuccessForgotPassword />}
            {!isSubmit && (
                <form onSubmit={formik.handleSubmit} className='login--form login--form__forgot--password'>
                    <div className='login__content'>
                        <h2 className='form__title'>Forgot Password</h2>
                        <div className='login--input'>
                            <label htmlFor="email" className='form__title__sm'>Email</label>
                            <input 
                                className='email' 
                                type="text" 
                                name="email" 
                                placeholder='Enter your email'
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                />
                                {formik.errors.email && formik.touched.email && (
                                    <p>{formik.errors.email}</p>
                                )}
                        </div>
                
                        <button className='submit__form submit__form--send--email' type='submit'>Send me an email</button>
                        <div className='login__forgot--password login__forgot--password__or'>or</div>
                        <button className='submit__form submit__form--sign--in' type='button'>
                            <Link className='link__login' to="/login">Sign in</Link></button>
                    </div>
                </form>
                )}
                <ToastContainer/>
            
                                
            </div>
            
        </div>
    </>
    )
}

export default ForgotPassword