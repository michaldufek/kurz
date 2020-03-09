<template>
  <div class="row" style="margin-top: 20px">

    <SlideYUpTransition>
        
        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="p-0 px-lg-5 py-lg-5"
                class="modal-sm animated landingCard"
                :class="{ shake: isShaking }"
                v-if="showLogin">
            <DualRingLoader v-if="loading" :color="'#54f1d2'" :class="'loader'" style="top: 60px" />
            <template>
                <div v-if="!connected" class="text-center text-muted mb-4">
                    {{ `${$t('login.signIn')} ${$t('login.with')} ` }}<b>{{ `${$t('login.IB.title')} ` }}</b>{{ $t('login.IB.credentials') }}
                </div>
                <form role="form">
                    <base-input v-if="!connected"
                                alternative
                                class="mb-3"
                                :placeholder="$t('login.username')"
                                addon-left-icon="ni ni-email-83"
                                v-model="email"
                                @keyup.enter="logIn">
                    </base-input>
                    <base-input v-if="!connected"
                                alternative
                                type="password"
                                :placeholder="$t('login.password')"
                                addon-left-icon="ni ni-lock-circle-open"
                                v-model="pass"
                                @keyup.enter="logIn">
                    </base-input>
                    <div class="text-center">
                        <p :class="[ error ? errorClass : noErrorClass , msgClass ]">{{message}}</p>
                    </div>
                    <base-checkbox v-if="!connected" v-model="paper">
                        {{$t('login.IB.paper')}}
                    </base-checkbox>
                    <div class="text-center">
                        <base-button v-if="!connected" type="secondary" class="my-4" @click="logIn">{{$t('login.signIn')}}</base-button>
                        <base-button v-else type="secondary" class="my-4" @click="disconnect">{{$t('login.disconnect')}}</base-button>
                    </div>
                </form>
            </template>
        </card>

    </SlideYUpTransition>

  </div>
</template>
<script>
import { SlideYUpTransition } from "vue2-transitions";
import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';
import '../assets/css/shake.css'

import constants from '@/custom/assets/js/constants'
import helper from '@/custom/assets/js/helper'


export default {
    components: {
        SlideYUpTransition,
        DualRingLoader
    },
    data() {
      return {        
        loading: false,        
        connected: false,
        error: false,
        message: '',
        isShaking: false,

        showLogin: false,
        paper: true,
        email: '',
        pass: '',

        // css classes
        msgClass: 'message',
        noErrorClass: 'noError',
        errorClass: 'error'
      };
    },
    methods: {
        init() {
            let data = this.$store.getItem('IB connected')  // to-do: better check IB GW is running
            this.connected = data ? data : false
            this.openLoginModal()
        },

        logIn () {
            if (this.paper) {
                this.startGW()
            } else {
                this.$confirm(this.$t('login.IB.confirmLive'))
                .then(() => {
                    this.startGW()
                })
                .catch(() => {})
            }
        },        
        startGW() {
            this.loading = true

            this.$http
            .post(constants.urls.liveDepl.gwStart, {
                tradingMode: this.paper ? 'paper' : 'live',
                userid: this.email,
                password: this.pass
            })
            //, this.$store.getItem('headers')) // Authorization
            .then(response => {
                if ('error' in response.data) {
                    this.error = true
                    this.message = response.data.error
                } else {
                    this.error = false
                    this.message = response.data.message
                    this.connected = true
                }
            })
            .catch(error => {
                console.log(error)
                this.error = true
                this.message = error.message
                this.shakeModal()

                if (error.message === constants.strings.networkError) {
                    helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', `${this.$t('login.IB.title')} ${this.$t('login.IB.login')}`)
                }
            })
            .finally(() => this.loading = false)
        },
        disconnect() {

        },

        shakeModal(){
            this.isShaking = true
            setTimeout(() => { 
                this.isShaking = false
            }, constants.intervals.shake );
            this.pass = ''
        },
        
        openLoginModal(){
            this.error = false
            this.message = ''
            this.email = ''
            this.pass = ''

            setTimeout(() => {
                this.showLogin = true  
            }, constants.intervals.loginShow );
        }
    },

    mounted() {
        this.init()
    },

    watch: {
        connected(val) {
            this.$store.setItem('IB connected', val)
        }
    }
}
</script>
<style>
.landingCard {
    margin: auto;
    border-radius: 1rem;
    background: #2f3668;
}

.message {
    white-space: pre-line;
}

.noError {
    color: gray;    
}

.error {
  color: red !important;
}

.loader {
  width: 80px; 
  height: 80px;  
  position: absolute;
  left: 150px;
}
</style>