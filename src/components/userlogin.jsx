import React from 'react'
import AccounStart from './accounttemplate';
import "./css/login.css"
const userlogin = () => {
  return (
    <section className='Login'>
        <div className='Login-div'>
            <AccounStart text="Login" />
        </div>
      
    </section>
  )
}

export default userlogin
