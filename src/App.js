import './App.css';
import {useState, useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SignUp from './Components/SignUp-Login/SignUp';
import Login from './Components/SignUp-Login/Login';
import MainPage from './Components/MainPage';
import Fof from './Components/Fof';
import { auth, db } from './Components/Firebase-Config/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import UserChats from './Components/userprofile-chat/UserChats';
import Userprofile from './Components/userprofile-chat/Userprofile';
import AddPost from './Components/posts/AddPost';
import FriendsProfile from './Components/friendsprofile/FriendsProfile';
import Ptopmsg from './Components/Chat-components/Ptopmsg';

function App() {

  const [user, setUser] = useState(' ')
   const [successMsg, setSuccessMsg] = useState('');
 const [errorMsg, setErrorMsg] = useState('');

 function GetCurrentUser(){
  useEffect(()=>{
  auth.onAuthStateChanged(userlogged => {
    if(userlogged){
      const getUser = async () => {
        const q = query(collection( db, "users"),where("uid","==",userlogged.uid))
        const data = await getDocs(q)
        setUser(data.docs.map((doc) => ({...doc.data() , id: doc.id})))
      };
      getUser();
    }
    else{
      setUser(null)
    }
  })
  },[])
  return user
 }
 GetCurrentUser()
//  console.log(user)
  return (
   <>
   <div>
    {user? 
    <div>
    <BrowserRouter>
     <Routes>
     <Route path="/signup" element={<SignUp/>} />
     <Route path="/login" element={<Login/>} />
     <Route path="/mainpage" element={<MainPage userdata={user}/>} />
     <Route path="/" element={<MainPage userdata={user}/>} />
     <Route path="/userchats" element={<UserChats userdata={user}/>} />
     <Route path="/userprofile" element={<Userprofile userdata={user}/>} />
     <Route path="/addpost" element={<AddPost userdata={user}/>} />
     <Route path="/searchedprofile/:fuseruid" element={<FriendsProfile userdata={user}/>}/>
     <Route path="/msgp2p/:fuseruid" element={<Ptopmsg userdata={user}/>}/>


     <Route path="/*" element={<Fof userdata={user}/>} />
    </Routes>
   </BrowserRouter>      
    </div> 
    :
   <BrowserRouter>
   <Routes>
    <Route path="/signup" element={<SignUp/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/*" element={<Login/>} />
    </Routes>
   </BrowserRouter>
    }
   </div>
   </>
  );
}

export default App;
