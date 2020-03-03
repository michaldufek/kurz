<template>
  <div class="row" style="margin-top: 20px">

    <SlideYUpTransition>
        
        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="p-0 px-lg-5 py-lg-5"
                class="modal-sm animated landingCard"
                :class="{ shake: isShaking }"
                v-if="showLogin">
            <DualRingLoader v-if="loading" :color="'#54f1d2'" :class="'loader'" style="top: 150px" />
            <template>
                <div class="text-center text-muted mb-4">
                    {{$t('login.IB.signIn')}}
                </div>
                <form role="form">
                    <base-input alternative
                                class="mb-3"
                                :placeholder="$t('login.emailExample')"
                                addon-left-icon="ni ni-email-83"
                                v-model="email"
                                @keyup.enter="logIn">
                    </base-input>
                    <base-input alternative
                                type="password"
                                :placeholder="$t('login.password')"
                                addon-left-icon="ni ni-lock-circle-open"
                                v-model="pass"
                                @keyup.enter="logIn">
                    </base-input>
                    <div class="text-center">
                        <p :class="[ error ? errorClass : noErrorClass , msgClass ]">{{message}}</p>                    
                        <base-button v-if="error" style="color: #00f2c3" type="link" @click="resetPass">{{$t('login.resetPass')}}</base-button>
                    </div>
                    <base-checkbox v-model="paper">
                        {{$t('login.IB.paper')}}
                    </base-checkbox>
                    <div class="text-center">
                        <base-button type="secondary" class="my-4" @click="logIn">{{$t('login.signIn')}}</base-button>
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


export default {
    components: {
        SlideYUpTransition,
        DualRingLoader
    },
    data() {
      return {
        showLogin: false,
        loading: false,
        paper: true,

        email: '',
        pass: '',
        error: false,
        message: '',
        isShaking: false,

        // css classes
        msgClass: 'message',
        noErrorClass: 'noError',
        errorClass: 'error'
      };
    },
    methods: {
        init() {
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
            var msg = {
                tradingMode: this.paper ? 'paper' : 'live',
                userid: this.email,
                password: this.pass
            }
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