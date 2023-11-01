import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../Firebase-Config/FirebaseConfig'
import NavBar from '../NavBar/NavBar'
import './Ptopmsg.css'

const Ptopmsg = (props) => {
 const loggeduser = props.userdata[0]

 const { fuseruid } = useParams()
 const [user, setUser] = useState('');

 useEffect(()=>{
   const getUser = async () => {
    const q = query(collection(db, "users"), where("uid", "==", fuseruid));

    getDocs(q).then((data) => {
     setUser(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    })
   }
   getUser()
 },[])

 let curruser = user[0]; 
 let msgdocp2p;

 useEffect(()=>{
   if(loggeduser.uid > fuseruid){
    msgdocp2p = `${loggeduser.uid}_${fuseruid}`
   }
   if(loggeduser.uid < fuseruid){
    msgdocp2p = `${fuseruid}_${loggeduser.uid}`
   }
 },[])


 const [typedmsg, setTypedmsg] = useState("");
 const [p2pmsgs, setP2pmsgs] = useState([]);

 useEffect(()=>{
  const getMessages = async () => {
   const postsArray = []
     const postsref = collection(db, `chats-${msgdocp2p}`);
     const q = query(postsref, orderBy("date", "asc"));
     const querySnapshot = await getDocs(q)

     querySnapshot.forEach((doc) => {
      postsArray.push({...doc.data(), id: doc.id})
     });
     setP2pmsgs(postsArray)
  }
  getMessages()
 },[p2pmsgs])

  var dateObj = new Date();
 var month = dateObj.getUTCMonth() + 1; //months from 1-12
 var day = dateObj.getUTCDate();
 var year = dateObj.getUTCFullYear();
 var hours = dateObj.getHours();
 var mins = dateObj.getMinutes();
 var seconds = dateObj.getSeconds();

 const sendmsg = (e) => {
   e.preventDefault();

    let newdate = `${year}${month}${day}${hours}${mins}${seconds}`;

    addDoc(collection(db, `chats-${msgdocp2p}`), {
     typedmsg, from: loggeduser.uid, date: newdate
    })
    .then(()=>{
      console.log("Msg saved to db successfully")
      setTypedmsg('')
    })
    .catch(()=>{
     console.log("Msg not saved")
    })

 }


  return (
    <div>
     {/* <p>hello world</p> */}
     {curruser? 
     <div>
      <NavBar userdata={loggeduser}/>
      <div className="p2p-section-1">
       <div className="p2p-section-1">
        <img src={curruser.profilePic} className="nav-profile-pic" alt="" />
        <p>{curruser.username}</p>
       </div>
      </div>
      <div className="p2p-section-2">

        {p2pmsgs.length > 0? 
        <>
         {p2pmsgs.map((msg)=>{
          return <div key={msg.id}>
             {msg.from == loggeduser.uid?
             <div className="right-msg">
              <p>{msg.typedmsg}</p>
             </div>
             :
             <div className="left-msg">
              <p>{msg.typedmsg}</p>
             </div>
            }
          </div>
         })}
        </>
       
        : 
        <div className='big-head'>No Messages</div>
        }

      </div>
      <div className="p2p-section-3">
       <input value={typedmsg} type="text" onChange={(e) => {setTypedmsg(e.target.value)}}/>
       <button onClick={sendmsg}>Send</button>
      </div>
     </div>
      : 
      <div>
        <NavBar />
        <div className="big-head">
         Loading...
        </div>
      </div>
      }
    </div>
  )
}

export default Ptopmsg