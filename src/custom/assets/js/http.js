import Vue from "vue";
import Cookies from 'js-cookie'
import axios from '@/../node_modules/axios';
import constants from '@/custom/assets/js/constants';
import Axios from 'axios'


const offline = false

const getOfflineRoutine = url => new Promise ((resolve, __) => {
    let data = null
    if (url.includes(constants.urls.patternLab.asset)) {
        data = {
                results: [{
                    id: 0, 
                    symbol: 'symbol',
                    name: 'name'
                },
                {
                    id: 1, 
                    symbol: 'symbol2',
                    name: 'name2'
                }]
                }
    } else if (url.includes(constants.urls.patternLab.pattern)) {
        data = [{
                    id: 0,
                    name: 'pattern'
                },
                {
                    id: 1,
                    name: 'pattern2'
                }]
    }

    resolve({
        data: data
    })
})

const getOnlineRoutine = (url, config) => new Promise ((resolve, reject) => {
    let response = {}
    Axios
    .get(url, config)
    .then(resp => response = resp)
    .catch(error => reject(error))
    .finally(() => resolve(response))
})

const postOnlineRoutine = (url, data, config) => new Promise ((resolve, reject) => {
    let response = {}
    Axios
    .post(url, data, config)
    .then(resp => response = resp)
    .catch(error => reject(error))
    .finally(() => resolve(response))
})

const putOnlineRoutine = (url, data, config) => new Promise ((resolve, reject) => {
    let response = {}
    Axios
    .put(url, data, config)
    .then(resp => response = resp)
    .catch(error => reject(error))
    .finally(() => resolve(response))
})

const patchOnlineRoutine = (url, data, config) => new Promise ((resolve, reject) => {
    let response = {}
    Axios
    .patch(url, data, config)
    .then(resp => response = resp)
    .catch(error => reject(error))
    .finally(() => resolve(response))
})

const deleteOnlineRoutine = (url, config) => new Promise ((resolve, reject) => {
    let response = {}
    Axios
    .delete(url, config)
    .then(resp => response = resp)
    .catch(error => reject(error))
    .finally(() => resolve(response))
})

const setCSRFToken = function() {
    if (process.env.NODE_ENV === 'production') {
      var cokieName = 'csrftoken'
    } else {
      cokieName = '_xsrf'
    }

    let csrfToken = Cookies.get(cokieName)        
    axios.defaults.headers.common = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': csrfToken
    }
}

export default { 
    // axios get routine with automatic offline detection and fabrication
    // const getRoutine = (url) => new Promise ((resolve, reject) => {
    //   let response = {}
    //   Axios
    //   .get(url)
    //   .then(resp => response = resp)
    //   .catch(error => {
    //     if (url) {
    //       response = {
    //         data: null
    //       }
    //     }

    //     if (true) {
    //       console.log('Fabricating data for ' + url + '... (' + error + ')')
    //     } else {  // cannot fabricate data
    //       reject(error)
    //     }
    //   })
    //   .finally(() => resolve(response))
    // })

    setCSRFToken() {
        setCSRFToken()
    },    
    
    setHttpPrototype() {
        Vue.prototype.$http = {
            get(url, config) {
                setCSRFToken()

                if (offline) {
                    console.log('Offline. Fabricating data for ' + url + ' ...')
                    var getRoutine = getOfflineRoutine
                } else {
                    getRoutine = getOnlineRoutine
                }

                return getRoutine(url, config)
            },
            post(url, data, config) {
                setCSRFToken()
                return postOnlineRoutine(url, data, config)
            },
            put(url, data, config) {
                setCSRFToken()
                return putOnlineRoutine(url, data, config)
            },
            patch(url, data, config) {
                setCSRFToken()
                return patchOnlineRoutine(url, data, config)
            },
            delete(url, config) {
                setCSRFToken()
                return deleteOnlineRoutine(url, config)
            }
        }
    }
}