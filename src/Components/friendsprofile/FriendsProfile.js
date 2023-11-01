import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import React,{ useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../Firebase-Config/FirebaseConfig';
import NavBar from '../NavBar/NavBar';
import Postprofile from '../posts/Post_profile';
import './friendsprofile.css'


const FriendsProfile = (props) => {

 const { fuseruid } = useParams();
 const [user, setUser] = useState('')
 const [posts , setPosts] = useState([])
 const loggeduser = props.userdata[0]

 const getUser = async () => {
  const q = query(collection( db, "users"), where("uid", "==", fuseruid));

  getDocs(q).then((data)=>{
    setUser(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));

    const getPosts = async () => {
     const postsArray = [];
     const postsref = collection( db, "posts")
     const q = query(postsref, where("post_user_uid", "==", user[0].uid));
     const querySnapshot = await getDocs(q)

     querySnapshot.forEach((doc) => {
       postsArray.push({...doc.data(), id: doc.id})
      });
      
      setPosts(postsArray);

    }
    getPosts()
  })

 }

 getUser();


 let curruser = user[0];

 posts.sort((a, b) => {
  return b.date - a.date;
 })


 const addToUserChats = () => {
  const addftologged = () => {
     const q = query(collection(db, `allchat-${loggeduser.uid}`),where("fuseruid", "==", fuseruid))

     getDocs(q).then((data) => {
      console.log(data.docs)
      if(data.docs.length != 0 ){
       console.log("user already added to chat list")
      }else{
       addDoc(collection(db, `allchat-${loggeduser.uid}`),{
        fuseruid: curruser.uid,
        fprofpic: curruser.profimage,
        fusername: curruser.username
       })
       .then(()=>{
        console.log("user added to chat section")
       })
       .catch(()=>{
        console.log("user not added to chat section")
       })
      }
     })
  }

  const addloggedtof= () => {
     const q = query(collection(db, `allchat-${fuseruid}`),where("fuseruid", "==", loggeduser.uid))

     getDocs(q).then((data) => {
      console.log(data.docs)
      if(data.docs.length != 0 ){
       console.log("user already added to chat list")
      }else{
       addDoc(collection(db, `allchat-${fuseruid}`),{
        fuseruid: loggeduser.uid,
        fprofpic: loggeduser.profilePic,
        fusername: loggeduser.username
       })
       .then(()=>{
        console.log("user added to chat section")
       })
       .catch(()=>{
        console.log("user not added to chat section")
       })
      }
     })
  }

  addftologged()
  addloggedtof()


 }

  return (
    <div className='userprofile'>
     {user? 
     <div>
      <NavBar userdata={loggeduser}/>

      <div className="section1">
      <div className="left">
        <img className='userprofile-image' src={curruser.profilePic} alt="" />
      </div>
      <div className="right">
       <h1>{curruser.username}</h1>
       <h2>{curruser.email}</h2>
      </div>

      {loggeduser.uid != curruser.uid? 
      <Link to={`/msgp2p/${curruser.uid}`}><button 
      onClick={addToUserChats}
       className="msg-btn-profile">
       message
      </button></Link>
      :
      <></>
      }

     </div>

     <div className="userpost-head">
       <p>{curruser.username} Posts</p>
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
      <div className="big-head">Loading...</div>
      </div>
      }
    </div>
  )
}

export default FriendsProfile