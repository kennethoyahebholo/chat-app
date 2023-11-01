import React,{useState, useEffect} from 'react'
import { Link } from "react-router-dom"
import "./NavBar.css"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../Firebase-Config/FirebaseConfig';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import ChatIcon from '@mui/icons-material/Chat';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HomeIcon from '@mui/icons-material/Home';

const NavBar = (props) => {
 const navigate = useNavigate()

 const [findUser, setFindUser] = useState('')

 const [findUserDoc, setFindUserDoc] = useState('')
 
 const searchUser = (e) => {
   e.preventDefault()

   const getUser = async () => {
    const q = query(collection( db, "users"),where("email", "==", findUser));

    const data = await getDocs(q);

    setFindUserDoc(data.docs.map((doc) => (
      {...doc.data(), id: doc.id})))
    // console.log(findUserDoc)

    if(findUserDoc.length != 0){
      navigate(`/searchedprofile/${findUserDoc[0].uid}`)
    }
   }
   getUser()
 }
  const handleLogOut = (e) => {
  e.preventDefault()
    signOut(auth)
   .then((response) => {
    alert('user logged out')
    console.log("user logged out")
    navigate('/login')   
   })
   .catch((error) => console.log(error.message))

 }

 let curruser = props.userdata
  return (
    <>
     <nav>
      <div className='left_nav_con'>
       <Link to="/"><button>Logo</button></Link>
      </div>


      {curruser != undefined ? 
      <div className='center'>
        <input type="text" placeholder='search a friend by email...' onChange={(e) => {setFindUser(e.target.value)}} className='search-user' />
        <button onClick={searchUser}>&gt;</button>
      </div>
      :
      <>
      
      </>}



      {curruser != undefined? 
      <div className='right_nav_con'>
        <Link to="/mainpage"><HomeIcon className='nav-profile-pic  add-icon'/></Link>
       <Link to="/addpost"><AddCircleOutlineIcon className='nav-profile-pic  add-icon'/></Link>
      <Link to="/userchats"><ChatIcon className='nav-profile-pic'/></Link>
      <Link to="/userprofile"><img className='nav-profile-pic' src={curruser.profilePic} alt="" /></Link>      
      <Link to="/login"><button type="button" onClick={handleLogOut}>Logout</button></Link>
      </div>
       : 
       <div className='right_nav_con'>
      <Link to="/signup"><button>Signup</button></Link>
      <Link to="/login"><button>Login</button></Link>
      {/* <Link to="/login"><button type="button" onClick={handleLogOut}>Logout</button></Link> */}
      </div>
       }
     </nav>
     <hr 
     className='nav-hr'
     />
    </>
  )
}

export default NavBar