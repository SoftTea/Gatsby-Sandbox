// src/utils/auth.js
import auth0 from 'auth0-js';
import { navigate } from "gatsby-link";


const AUTH0_DOMAIN = 'dev-8b38gedz.auth0.com';
const AUTH0_CLIENT_ID = 'UoKWqkNS8P9otjfsFTM6kCbeksevrgw6';

class Auth {

  accessToken
  idToken
  expiresAt
  userProfile

  auth0 = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: 'http://localhost:8000/callback',
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getUserName = this.getUserName.bind(this)
    this.getUser = this.getUser.bind(this)
    this.setSession = this.setSession.bind(this)
    this.renewSession = this.renewSession.bind(this);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
    //  Remove tokens and expiry time
    //  this.accessToken = null
    //  this.idToken = null
    //  this.expiresAt = 0
    //  this.userProfile = null

    //    // Remove isLoggedIn flag from localStorage
    // localStorage.removeItem('isLoggedIn');
  }

  handleAuthentication() {
    if (typeof window !== 'undefined') {
       this.auth0.parseHash(  (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
           this.setSession(authResult);
        } else if (err) {
          console.log(err);
        }

        // // Return to the homepage after authentication.
        // This was from someone else's code that tried to go fix the code block issue
        // navigate('/');
        // setTimeout(() => {
        //   navigate('/')
        // }, 1500);
      });
    }
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      console.log(authResult)
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  // setSession(authResult) {
  //   // Set isLoggedIn flag in localStorage
  //   localStorage.setItem('isLoggedIn', 'true')

  //   // Set the time that the access token will expire at
  //   let expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

  //   this.accessToken = authResult.accessToken
  //   this.idToken = authResult.idToken
  //   this.expiresAt = expiresAt

  //   this.auth0.client.userInfo(this.accessToken, (err, profile) => {
  //     if (profile) {
  //       this.userProfile = profile
  //     }
  //     // navigateTo to the home route
  //     navigate('/')
  //   })
  // }

  // getUser() {
  //   return this.userProfile
  // }

  // getUserName() {
  //   if (this.getUser()) {
  //     return this.getUser().name
  //   }
  // }

  
  // isAuthenticated() {
  //   // Check whether the current time is past the
  //   // access token's expiry time
  //   let expiresAt = this.expiresAt
  //   return new Date().getTime() < expiresAt
  // }

    setSession(authResult) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.auth0.client.userInfo(authResult.accessToken,  (err, user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      navigate('/')
       
    })
  }

     getUser() {
    if (localStorage.getItem('user')) {
      return  JSON.parse(localStorage.getItem('user'));
    }
  }

  getUserName() {
    if (this.getUser()) {
      return this.getUser().name;
    }
  }

   isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }





  login() {
    this.auth0.authorize();
  }
}

const auth = new Auth()
export default auth


// Version from a guide which had data saved into local storage -- believe this is a no no?

 