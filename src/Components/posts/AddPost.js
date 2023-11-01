import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../Firebase-Config/FirebaseConfig';
import NavBar from '../NavBar/NavBar'

const AddPost = (props) => {
 let curruser = props.userdata[0]
 const [isSubmitting, setIsSubmitting] = useState(false)

 var dateObj = new Date();
 var month = dateObj.getUTCMonth() + 1; //months from 1-12
 var day = dateObj.getUTCDate();
 var year = dateObj.getUTCFullYear();
 var hours = dateObj.getHours();
 var mins = dateObj.getMinutes();
 var seconds = dateObj.getSeconds();

 // let newdate = `${year}${month}${day}${hours}${mins}${seconds}`;
 // console.log(newdate)

  const [postPic, setPostPic] = useState()
  const [description, setDescription] = useState()

  const [successMsg, setSuccessMsg] = useState('');
 const [errorMsg, setErrorMsg] = useState('');

 const navigate = useNavigate()
 const auth = getAuth()

  const handleProductImg = (e) =>{
  let selectedFile = e.target.files[0]; 
  if(selectedFile){
   setPostPic(selectedFile)
  }else{
   setErrorMsg("Pleasse select your post")
  }
  
 }

  const handleSubmit = (e) => {
   e.preventDefault();
   setIsSubmitting(true)
   const user = curruser;
   let newdate = `${year}${month}${day}${hours}${mins}${seconds}`;

   const storageRef = ref(storage, `posts/${newdate}`);
   uploadBytes(storageRef, postPic)
   .then(()=>{
    getDownloadURL(storageRef).then(url => {
     addDoc(collection(db, `posts`), {
      email: user.email, description, name: user.username, profilePic: user.profilePic, postPic: url, post_user_id: user.uid, date: parseInt(newdate)
     })
     .then(()=>{
      setSuccessMsg('posted successfully');
      setIsSubmitting(false)
      setDescription('')
      setTimeout(()=>{
       setSuccessMsg('');
      }, 2000)
     })
     .catch((error)=>{
       setErrorMsg(error.message)
       setIsSubmitting(false)
       setTimeout(()=>{
        setErrorMsg('');
       },4000)
     });
    })
   })
   .catch((error) => {
    setIsSubmitting(false)
    console.log(error.message)
   })
  }



  return (
   <>
    {props? 
    <div>
    <NavBar userdata={curruser}/>
    <div className="form-outermost">
     <h1>Add Post</h1>
     <form className="form-inner">
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

        <input name="profilePic"  onChange={handleProductImg} accept="image/png , image/jpg, image/gif, image/jpeg" type="file" placeholder='Choose a Profile Picture'/>

        <input onChange={(e)=> {setDescription(e.target.value)}} type="text" placeholder='Enter Description'/>

        <div className='main_btn_con '>
       {isSubmitting? 
       <button className='main_btn' onClick={handleSubmit} type="button" >Submitting...</button>
        :
       <button className='main_btn' onClick={handleSubmit} type="button" >Submit</button>
         }
       
      </div>

     </form>
    </div>
    </div>
     : 
     <div>
      <NavBar/>
     <div> Not Logged In </div>
      </div>
      }    
    </>
  )
}

export default AddPost