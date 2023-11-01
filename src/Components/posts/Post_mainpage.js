import React from 'react'
import './Post_mainpage.css'

const Post_mainpage = (props) => {

  const currpost = props.postdata
  return (
    <div className='post-mainpage'>
      <div className='section-row'>
        <img className='prp' src={currpost.profilePic} alt="" />
    <div className="section-col">
      <h1>{currpost.name}</h1>
      <h2>{currpost.email}</h2>
     </div>
     </div>
     <hr/>
     <img className='pop' src={currpost.postPic} alt="" />
     <hr/>
     <p><span>{currpost.name } &nbsp;</span>{currpost.description}</p>
      </div>
    // </div>
  )
}

export default Post_mainpage