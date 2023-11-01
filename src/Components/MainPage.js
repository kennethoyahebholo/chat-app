import React, {useState, useEffect} from 'react'
import NavBar from './NavBar/NavBar'
import Post_mainpage from './posts/Post_mainpage';
import './MainPage.css'
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './Firebase-Config/FirebaseConfig';

const MainPage = (props) => {
 let curruser = props.userdata[0]

 const [posts, setPosts] = useState([])

 useEffect(()=>{
  const getPosts = async () => {
    const postsArray = [];
    const postsref = collection(db, "posts")
    const q = query(postsref);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      postsArray.push({...doc.data(), id: doc.id})
    });
    setPosts(postsArray)
  }
  getPosts()
 },[])
 // console.log(curruser)

 function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--){

    //generate random number
    var j = Math.floor(Math.random() * (i + 1))

    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
 }

 shuffleArray(posts)
  return (
    <>
    {props? 
    <div>
    <NavBar userdata={curruser}/>
    <div className='Mainpage-outer'>
      {posts.length > 0 ? 
      <div>
       {posts.map((post) => {
        return <Post_mainpage key={post.id} postdata={post}/>
      })}
      </div>
        :
        <div className='big-head'>
          Try Refreshing the Page
        </div>
      }
    </div>
    </div>
     : 
     <div>
      <NavBar/>
     <div> Main Page  </div>
      </div>
      }    
    </>
  )
}

export default MainPage