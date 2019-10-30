/* globals localStorage */
import axios from '@/../node_modules/axios';
import i18n from "@/i18n"
import Cookies from 'js-cookie'

const urlBase = "https://frs.analyticalplatform.com/rest-auth/"

const loginRoutine = (userName, email, pass) => new Promise ((resolve, reject) => {
  axios({url: urlBase + 'login/', data: { "username": userName, "email": email, "password": pass }, method: 'POST' })
  .then(resp => {
    const token = resp.data.token
    localStorage.setItem('token', token) // store the token in localstorage
    resolve(resp)
  })
  .catch(err => {
    localStorage.removeItem('token') // if the request fails, remove any possible user token if possible
    reject(err)
  })
});

const loginFacebookRoutine = (token, code) => new Promise ((resolve, reject) => {
  axios({url: urlBase + 'facebook/', data: { "access_token": token, "code": code }, method: 'POST' })
  .then(resp => {
    const token = resp.data.token
    localStorage.setItem('token', token) // store the token in localstorage
    resolve(resp)
  })
  .catch(err => {
    localStorage.removeItem('token') // if the request fails, remove any possible user token if possible
    reject(err)
  })
});

const loginTwitterRoutine = (token, secret) => new Promise ((resolve, reject) => {
  axios({url: urlBase + 'twitter/', data: { "access_token": token, "token_secret": secret }, method: 'POST' })
  .then(resp => {
    const token = resp.data.token
    localStorage.setItem('token', token) // store the token in localstorage
    resolve(resp)
  })
  .catch(err => {
    localStorage.removeItem('token') // if the request fails, remove any possible user token if possible
    reject(err)
  })
});

const logoutRoutine = () => new Promise ((resolve, reject) => {
  localStorage.removeItem('token')

  axios({url: urlBase + 'logout/', method: 'POST' })
  .then(resp => {
    resolve(resp)
  })
  .catch(err => {
    reject(err)
  })
});

const resetPassRoutine = email => new Promise ((resolve, reject) => {
  axios({url: urlBase + 'password/reset/', data: { "email": email }, method: 'POST' })
  .then(resp => {
    resolve(resp)
  })
  .catch(err => {
    reject(err)
  })
});

const registerRoutine = (userName, email, pass1, pass2) => new Promise ((resolve, reject) => {
  axios({url: urlBase + 'registration/', data: { "username": userName, "email": email, "password1": pass1, "password2": pass2 }, method: 'POST' })
  .then(resp => {
    resolve(resp)
  })
  .catch(err => {
    reject(err)
  })
});

const verifyRegisterRoutine = key => new Promise ((resolve, reject) => {
  axios({url: urlBase + 'registration/verify-email/', data: { "key": key }, method: 'POST' })
  .then(resp => {
    resolve(resp)
  })
  .catch(err => {
    reject(err)
  })
});

const verifyResetRoutine = (uid, token, pass1, pass2) => new Promise ((resolve, reject) => {
  axios({url: urlBase + 'password/reset/confirm/', data: { "new_password1": pass1, "new_password2": pass2, "uid": uid, "token": token }, method: 'POST' })
  .then(resp => {
    resolve(resp)
  })
  .catch(err => {
    reject(err)
  })
});


export default {  
    init() {
      if (process.env.NODE_ENV === 'production') {
        var cokieName = 'csrftoken'
      } else {
        cokieName = '_xsrf'
      }

      let csrfToken = Cookies.get(cokieName)        
      axios.defaults.headers.common = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': csrfToken
      };
    },
  
    login (userName, email, pass, cb) {
      cb = arguments[arguments.length - 1]
      if (localStorage.token) {
        if (cb) cb(true)
        this.onChange(true)
        return
      }
      
      if (pass === 'frspass') { // to-do: temporary, delete in production !!!
        pretendRequest(email, pass, (res) => {
          if (res.authenticated) {
            localStorage.token = res.token
            if (cb) cb(true)
            this.onChange(true)
          } else {
            if (cb) cb(false)
            this.onChange(false)
          }
        })
      } else {
        loginRoutine(userName, email, pass)
        .then(() => {
          if (cb) cb(true)
          this.onChange(true)
        })
        .catch(err => {        
          if (cb) cb(false, this.parseError(err))
          this.onChange(false)        
        })
      }
    },

    loginFacebook (cb) {
      cb = arguments[arguments.length - 1]
      if (localStorage.token) {
        if (cb) cb(true)
        this.onChange(true)
        return
      }

      let token = ''
      let code = ''    
      // to-do: get token and code
      loginFacebookRoutine(token, code)
      .then(() => {
        if (cb) cb(true)
        this.onChange(true)
      })
      .catch(err => {        
        if (cb) cb(false, this.parseError(err))
        this.onChange(false)        
      })
    },

    loginTwitter (cb) {
      cb = arguments[arguments.length - 1]
      if (localStorage.token) {
        if (cb) cb(true)
        this.onChange(true)
        return
      }

      let token = ''
      let secret = ''
      // to-do: get token and secret
      loginTwitterRoutine(token, secret)
      .then(() => {
        if (cb) cb(true)
        this.onChange(true)
      })
      .catch(err => {        
        if (cb) cb(false, this.parseError(err))
        this.onChange(false)        
      })
    },
  
    getToken () {
      return localStorage.token
    },
  
    logout (cb) {
      cb = arguments[arguments.length - 1]
      logoutRoutine()
      .then(() => {
        if (cb) cb()
        this.onChange(true)
      })
    },
  
    loggedIn () {
      return !!localStorage.token
    },

    resetPass (email, cb) {
      resetPassRoutine(email)
      .then(res => {
        if (cb) cb(true, res.data.detail)
        this.onChange(true)
      })
      .catch(err => {
        if (cb) cb(false, this.parseError(err, false))
        this.onChange(false)        
      })
    },

    verifyReset (uid, token, pass1, pass2, cb) {
      cb = arguments[arguments.length - 1]
      verifyResetRoutine(uid, token, pass1, pass2)
      .then(res => {
        if (cb) cb(true, res.data.detail)
        this.onChange(true)
      })
      .catch(err => {
        if (cb) cb(false, this.parseError(err, false))
        this.onChange(false)        
      })
    },

    register (userName, email, pass1, pass2, cb) {
      cb = arguments[arguments.length - 1]
      registerRoutine(userName, email, pass1, pass2)
      .then(res => {
        if (cb) cb(true, i18n.t('login.registrationSent'))
        this.onChange(true)
      })
      .catch(err => {
        if (cb) cb(false, this.parseError(err))
        this.onChange(false)        
      })
    },

    verifyRegister (key, cb) {
      cb = arguments[arguments.length - 1]
      verifyRegisterRoutine(key)
      .then(res => {
        if (cb) cb(true)
        this.onChange(true)
      })
      .catch(err => {
        if (cb) cb(false)
        this.onChange(false)        
      })
    },

    parseError(err, verbose=true) {
      let msg = ''

      if ("username" in err.response.data) {
        if (verbose) {
          msg += i18n.t('login.userName') + ': ' 
        }
        msg += err.response.data.username[0] + '\n'
      }
      if ("email" in err.response.data) {
        if (verbose) {
          msg += i18n.t('login.email') + ': ' 
        }
        msg += err.response.data.email[0] + '\n'
      }
      if ("password" in err.response.data) {
        if (verbose) {
          msg += i18n.t('login.password') + ': ' 
        }
        msg += err.response.data.password[0] + '\n'
      }
      if ("password1" in err.response.data) {
        if (verbose) {
          msg += i18n.t('login.password') + ': ' 
        }
        msg += err.response.data.password1[0] + '\n'
      }
      if ("password2" in err.response.data) {
        if (verbose) {
          msg += i18n.t('login.passwordAgain') + ': ' 
        }
        msg += err.response.data.password2[0] + '\n'
      }
      if ("new_password1" in err.response.data) {
        if (verbose) {
          msg += i18n.t('login.password') + ': ' 
        }
        msg += err.response.data.new_password1[0] + '\n'
      }
      if ("new_password2" in err.response.data) {
        if (verbose) {
          msg += i18n.t('login.passwordAgain') + ': ' 
        }
        msg += err.response.data.new_password2[0] + '\n'
      }
      if ("non_field_errors" in err.response.data) {
        msg += err.response.data.non_field_errors[0] + '\n'
      }
      
      return msg
    },
  
    onChange () {}
  }
  
  function pretendRequest (email, pass, cb) {
    setTimeout(() => {
      // if (email === 'joe@example.com' && pass === 'frspass') {
        cb({
          authenticated: true,
          token: Math.random().toString(36).substring(7)
        })
      // } else {
      //   cb({ authenticated: false })
      // }
    }, 0)
  }