import React from "react"
// import {getUser} from '../services/auth'
import auth from '../utils/auth.js'

const Profile = () => (
  <>
    <h1>Your profile</h1>
    <ul>
      <li>Name: {auth.getUser().name}</li>
      <li>E-mail: {auth.getUser().email ? auth.getUser().email : 'Email not given'}</li>
    </ul>
  </>
)

export default Profile