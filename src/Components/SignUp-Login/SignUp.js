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

const SignUp = () => {

  const [initialState, setInitialState] = useState({username:"", email:"",phonenumber:"", password:"", confirmPassword:"", errors:{
  username:"", email:"",phonenumber:"", password:"", confirmPassword:""
 }})
 const [dob, setDob] = useState()
 const [profilePic, setProfilePic] = useState()

 const [isSubmitting, setIsSubmitting] = useState(false);
 const [visible, setVisibility] = useState(true);
 const [successMsg, setSuccessMsg] = useState('');
 const [errorMsg, setErrorMsg] = useState('');

 const handleChange = (e) => {
  e.preventDefault()
  const {name, value} = e.target
  
  let errors = initialState.errors
  const Regex = RegExp(/^\s?[A-Z0–9]+[A-Z0–9._+-]{0,}@[A-Z0–9._+-]+\.[A-Z0–9]{2,4}\s?$/i);
   switch (name) {
    case 'username':
       errors.username =  value.length <=0 ?  'Username is required!':'';
       break;
    case "email":
       errors.email =  Regex.test(value)? '': 'Email is not valid!'
     break;
      case 'phonenumber':
       errors.phonenumber =  value.length <=0 ?  'Phone Number is required!':'';
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


 const handleProductImg = (e) =>{
  let selectedFile = e.target.files[0];

  if(selectedFile){
   setProfilePic(selectedFile)
  }else{
   setErrorMsg("Please select your profile picture")
  }
  
 }

 const navigate = useNavigate()

 const handleSubmit = (e) => {
  e.preventDefault();
   setIsSubmitting(true)
       if(initialState.username === "" || initialState.email === "" === "" || initialState.phonenumber === "" || initialState.password === "" || initialState.confirmPassword === "" || initialState.errors.username || initialState.errors.email || initialState.errors.confirmPassword || initialState.errors.phonenumber || initialState.errors.password){
        setIsSubmitting(false)
        setErrorMsg('Please fill all required fields')
        setTimeout(()=>{
     setErrorMsg('')
    }, 3000)
   }else{
     createUserWithEmailAndPassword(auth ,initialState.email, initialState.password)
   .then((userCredentials)=>{
    const user = userCredentials.user;
    console.log(user);
    const storageRef = ref(storage, `profile-images/${Date.now()}`);
     uploadBytes(storageRef, profilePic)
     .then(()=>{
     getDownloadURL(storageRef)
     .then(url => {
    addDoc(collection(db, "users"), {
     username: initialState.username, email: initialState.email, dob: dob, phonenumber: initialState.phonenumber, password: initialState.password, profilePic: url, uid: user.uid
    }).then(()=>{
     
    setErrorMsg('')
    setSuccessMsg('New user added successfully,redirecting to login page.')
    //set inputs back to string
    initialState.username=''
    initialState.confirmPassword=''
    initialState.email=''
    initialState.password=''
    setProfilePic('')
    setDob('')
    initialState.phonenumber=''
    setIsSubmitting(false)
    setTimeout(()=>{
     setSuccessMsg('')
     navigate("/login")
    }, 2000)    
   }) 
   .catch((error) => {  
  setIsSubmitting(false)
  setTimeout(()=>{
     setErrorMsg('')
     // navigate("/login")
    }, 2000) 
   }) 
   })
  })
  .catch((error) => {
   console.log(error.message)
  })
 })
.catch((error) => {
   console.log(error.message)
  if (error.message == "Firebase: Error (auth/invalid-email)." || error.message == ' Firebase: Error (auth/ admin-restricted-operation).')
  {
   setSuccessMsg('')
   setErrorMsg('Please fill all required fields')
  }
  if (error.message == "Firebase: Error (auth/email-already-in-use).")
  {
   setSuccessMsg('')
   setErrorMsg('User already exists')
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
      <h1>Signup</h1> 
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

       <input name="username" value={initialState.username} onChange={handleChange} type="text" placeholder='Enter your username'/>
       {initialState.errors.username.length >= 0 && <span className="error-msg-onchange">{initialState.errors.username}</span>}

       <input name="profilePic"  onChange={handleProductImg} accept="image/png , image/jpg, image/gif, image/jpeg" type="file" placeholder='Choose a Profile Picture'/>

       <input name="date" value={dob} onChange={(e)=>{setDob(e.target.value)}} type="date" placeholder='Choose Date of Birth'/>

       <input name="phonenumber" value={initialState.phonenumber} onChange={handleChange} type="number" placeholder='Enter your phonenumber'/>
       {initialState.errors.phonenumber.length >= 0 && <span className="error-msg-onchange">{initialState.errors.phonenumber}</span>}       
       
       <div className='signUp_input_con2'>
       <div className="password-icon" onClick={ () => setVisibility( visibility => !visibility)} >
          <i className="password-toggle-icon">{ !visible? <RemoveRedEyeIcon/> : <VisibilityOffIcon/>}</i>
         </div>  
       <input name="password" value={initialState.password} onChange={handleChange} type={!visible? "text" : "password"} placeholder='Choose a password'/>
       {initialState.errors.password.length >= 0 && <span className="error-msg-onchange">{initialState.errors.password}</span>}
       </div>


       <input name="confirmPassword" value={initialState.confirmPassword} onChange={handleChange} type={!visible? "text" : "password"} placeholder='Cofirm password'/>
       {initialState.errors.confirmPassword !== initialState.password && <span className="error-msg-onchange">{initialState.errors.confirmPassword}</span>} 

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

export default SignUp