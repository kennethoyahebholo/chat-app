import React from 'react'
import NavBar from '../NavBar/NavBar'
import './Post_profile.css'

const Post_profile = (props) => {
 let currpost = props.postdata


  return (
    <>
    <div className="post-profile">
     <img src={currpost.postPic} alt="" />
    </div>
    </>
  )
}

export default Post_profile