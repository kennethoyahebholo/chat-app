import React,{useState} from 'react'
import NavBar from '../NavBar/NavBar'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {db, auth, storage} from "../Firebase-Config/FirebaseConfig"
import { addDoc, collection,query,onSnapshot, serverTimestamp, orderBy} from 'firebase/firestore';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth'
import { useNavigate } from 'react-router';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import './loginsignupform.css'

const Login = () => {

 const [initialState, setInitialState] = useState({ email:"", password:"", confirmPassword:"", errors:{
   email:"", password:"", confirmPassword:""
 }})


 const [isSubmitting, setIsSubmitting] = useState(false)
 const [visible, setVisibility] = useState(true);
 const [successMsg, setSuccessMsg] = useState('');
 const [errorMsg, setErrorMsg] = useState('');

 const handleChange = (e) => {
  e.preventDefault()
  const {name, value} = e.target
  
  let errors = initialState.errors
  const Regex = RegExp(/^\s?[A-Z0–9]+[A-Z0–9._+-]{0,}@[A-Z0–9._+-]+\.[A-Z0–9]{2,4}\s?$/i);
   switch (name) {
    case "email":
       errors.email =  Regex.test(value)? '': 'Email is not valid!'
     break;
    case  "password":
      errors.password = value.length <= 5?  'Password should be at least 6 characters!':'';
      break;
     case 'confirmPassword':
       errors.confirmPassword=  value !== initialState.password?  'Passwords dont match ':'';
       break;
      default:
      break;
  }

  setInitialState({...initialState,errors, [name]:value})
  console.log(initialState.errors);
 }

 const navigate = useNavigate()

 const handleSubmit = (e) => {
  e.preventDefault();
   setIsSubmitting(true)
       if(initialState.email === "" === ""|| initialState.password === "" || initialState.errors.email  || initialState.errors.password){
        setIsSubmitting(false)
        setErrorMsg('Please fill all required fields')
        setTimeout(()=>{
     setErrorMsg('')
    }, 3000)
   }else{
     signInWithEmailAndPassword(auth ,initialState.email, initialState.password)
   .then((userCredentials)=>{
    const user = userCredentials.user;
    console.log(user);     
    setErrorMsg('')
    setSuccessMsg('successfull,redirecting to login page.')
    //set inputs back to string
    initialState.email=''
    initialState.password=''
    setIsSubmitting(false)
    setTimeout(()=>{
     setSuccessMsg('')
     navigate("/")
    }, 2000)    
   }) 
.catch((error) => {
   console.log(error.message)
   const errorCode = error.code;
  if(error.message == 'Firebase: Error(auth/wrong-password).')
   {
    setErrorMsg('Wrong Password')
   }
  if (error.message == "Firebase: Error (auth/invalid-email).")
  {
   setSuccessMsg('')
   setErrorMsg('Invalid Eamil')
  }
  if (error.message == "Firebase: Error (auth/user-not-found).")
  {
   setSuccessMsg('')
   setErrorMsg('User not registered, please Sign up first')
  }
  if (error.message == "Firebase: Error (auth/missing-email)." || error.message == "Firebase: Error (auth/internal-error)")
  {
   setSuccessMsg('')
   setErrorMsg("Fields can't be empty")
  }
  setTimeout(()=>{
   setErrorMsg('');
  }, 2000);
 })
   }   
}
  return (
    <>
     <NavBar/>
     <div className='form-outermost'>
      <h1>Login</h1> 
      <form  className="form-inner">
       {successMsg && 
        <>
         <div className='success-msg'>
          {successMsg}
         </div>
        </>
        }
        {errorMsg && <>
         <div className='error-msg'>
          {errorMsg}
         </div>
        </>}
       <input name="email" value={initialState.email} onChange={handleChange} type="text" placeholder='Enter your email'/>
       {initialState.errors.email.length >= 0 && <span className="error-msg-onchange">{initialState.errors.email}</span>}

       {/* <input name="username" value={initialState.username} onChange={handleChange} type="text" placeholder='Enter your username'/>
       {initialState.errors.username.length >= 0 && <span className="error-msg-onchange">{initialState.errors.username}</span>}

       <input name="profilePic" value={profilePic} onChange={(e)=>{setProfilePic(e.target.value)}} accept="image/png , image/jpg, image/gif, image/jpeg" type="file" placeholder='Choose a Profile Picture'/>

       <input name="date" value={dob} onChange={(e)=>{setDob(e.target.value)}} type="date" placeholder='Choose Date of Birth'/>

       <input name="phonenumber" value={initialState.phonenumber} onChange={handleChange} type="number" placeholder='Enter your phonenumber'/>
       {initialState.errors.phonenumber.length >= 0 && <span className="error-msg-onchange">{initialState.errors.phonenumber}</span>}       
        */}
       <div className='signUp_input_con2'>
       <div className="password-icon" onClick={ () => setVisibility( visibility => !visibility)} >
          <i className="password-toggle-icon">{ !visible? <RemoveRedEyeIcon/> : <VisibilityOffIcon/>}</i>
         </div>  
       <input name="password" value={initialState.password} onChange={handleChange} type={!visible? "text" : "password"} placeholder='Choose a password'/>
       {initialState.errors.password.length >= 0 && <span className="error-msg-onchange">{initialState.errors.password}</span>}
       </div>


       {/* <input name="confirmPassword" value={initialState.confirmPassword} onChange={handleChange} type={!visible? "text" : "password"} placeholder='Cofirm password'/>
       {initialState.errors.confirmPassword !== initialState.password && <span className="error-msg-onchange">{initialState.errors.confirmPassword}</span>}  */}

       <div className='main_btn_con '>
       {isSubmitting? 
       <button className='main_btn' onClick={handleSubmit} type="button" >Submitting...</button>
        :
       <button className='main_btn' onClick={handleSubmit} type="button" >Submit</button>
         }
       
      </div>
      </form>
     </div>
    </>
  )
}

export default Login