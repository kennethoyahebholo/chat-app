import { collection, getDocs, query, where } from 'firebase/firestore'
import React,{useState, useEffect} from 'react'
import { db } from '../Firebase-Config/FirebaseConfig'
import NavBar from '../NavBar/NavBar'
import Postprofile from '../posts/Post_profile'
import "./Userprofile.css"

const Userprofile = (props) => {
 let curruser = props.userdata[0]


 const [posts, setPosts] = useState([])



 useEffect(()=>{
  const getPosts = async () => {
   const postsArray = [];
   const postsref = collection( db, "posts")

   const q = query(postsref, where("post_user_id", "==", curruser.uid))

   const querySnapshot = await getDocs(q)
   querySnapshot.forEach((doc) => {
    postsArray.push({...doc.data(), id: doc.id})
   });
   setPosts(postsArray)
  }
  getPosts()
 },[])

  posts.sort((a, b) => {
  return b.date - a.date
 })


 console.log(posts)
  return (
    <>
    
    <div className="userprofile">
     {props?
     <div>
     <NavBar userdata={curruser}/>
     <div className="section1">
      <div className="left">
        <img className='userprofile-image' src={curruser.profilePic} alt="" />
      </div>
      <div className="right">
       <h1>{curruser.username}</h1>
       <h2>{curruser.email}</h2>
      </div>
     </div>
     <div className="userpost-head">
       <p>Your Posts</p>
     </div>
     <div className="section2">
       {posts.length > 0? <>
       {posts.map((post)=>{
         return <Postprofile key={post.id} postdata={post}/>
       })} 
       </>  
       : 
       <div className='big-haed'>
        No posts
       </div>
       }
     </div>
     </div>
     : 
     <div>
      <NavBar/>
      <div>Not Logged In</div>
     </div>
      }
    </div>
    </>
  )
}

export default Userprofile