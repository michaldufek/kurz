/* globals localStorage */
import axios from '@/../node_modules/axios';

const loginRoutine = credentials => new Promise ((resolve, reject) => {
  axios({url: 'authLogin', data: credentials, method: 'POST' })
  .then(resp => {
    const token = resp.data.token
    localStorage.setItem('user-token', token) // store the token in localstorage
    resolve(resp)
  })
  .catch(err => {
    localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
    reject(err)
  })
});

const logoutRoutine = () => new Promise ((resolve, reject) => {
  axios({url: 'authLogout', method: 'GET' })
  .then(resp => {
    delete localStorage.token
    resolve(resp)
  })
  .catch(err => {
    reject(err)
  })
});

const resetPassRoutine = email => new Promise ((resolve, reject) => {
  axios({url: 'authResetPass', data: email, method: 'POST' })
  .then(resp => {
    resolve(resp)
  })
  .catch(err => {
    reject(err)
  })
});

const registerRoutine = credentials => new Promise ((resolve, reject) => {
  axios({url: 'authRegister', data: credentials, method: 'POST' })
  .then(resp => {
    resolve(resp)
  })
  .catch(err => {
    reject(err)
  })
});

export default {    
    login (credentials, cb) {
      cb = arguments[arguments.length - 1]
      if (localStorage.token) {
        if (cb) cb(true)
        this.onChange(true)
        return
      }
      loginRoutine(credentials)
      .then(() => {
        if (cb) cb(true)
        this.onChange(true)
      })
      .catch(err => {
        if (cb) cb(false, err)
        this.onChange(false)        
      })
    },
  
    getToken () {
      return localStorage.token
    },
  
    logout (cb) {
      logoutRoutine(credentials)
      .then(() => {
        if (cb) cb()
        this.onChange(false)
      })
    },
  
    loggedIn () {
      return !!localStorage.token
    },

    resetPass (email, cb) {
      resetPassRoutine(email)
      .then(res => {
        if (cb) cb(res)
        this.onChange(false)
      })
      .catch(err => {
        if (cb) cb(err)
        this.onChange(false)        
      })
    },

    register (credentials, cb) {
      registerRoutine(credentials)
      .then(res => {
        if (cb) cb(res)
        this.onChange(false)
      })
      .catch(err => {
        if (cb) cb(err)
        this.onChange(false)        
      })
    },
  
    onChange () {}
  }
  
  function pretendRequest (email, pass, cb) {
    setTimeout(() => {
      if (email === 'joe@example.com' && pass === 'frspass') {
        cb({
          authenticated: true,
          token: Math.random().toString(36).substring(7)
        })
      } else {
        cb({ authenticated: false })
      }
    }, 0)
  }