import { collection, getDocs, query } from 'firebase/firestore'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../Firebase-Config/FirebaseConfig'
import NavBar from '../NavBar/NavBar'
import './UserChats.css'

const UserChats = (props) => {
  let curruser = props.userdata[0]
 let loggeduser = props.userdata[0]
 const [chats, setChats] = useState([])

 const getchatlist = async () => {
  const chatlistArray = []

  const q = query(collection( db, `allchat-${loggeduser.uid}`));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    chatlistArray.push({...doc.data(), id: doc.id})
  });
  setChats(chatlistArray)
 }

 getchatlist()

//  console.log(chats)


  return (
    <>
    <div>
     {props? 
     <div>
      <NavBar userdata={curruser}/>
      <div className='big-head-1'>Userchats</div>
      <div className="chat-list">
        {chats.length > 0 ? 
        <div>
          {chats.map((chat) => {
            <Link style={{textDecoration: "none"}} to={`/msgp2p/${chat.fuseruid}`}>
               <div className="chat-single">
                <img src={chat.fprofpic} alt="" className="nav-profile-pic" />
                <p>{chat.fusername}</p>
               </div>
            </Link>
          })}
        </div> 
        : 
        <div>No Chats    </div>
      }
      </div>
       </div> 
        :
        <div>
         <NavBar/>
         <div>You are not Logged in</div>
         </div>
         }
    </div>
    {/* <NavBar/> */}
    </>
  )
}

export default UserChats