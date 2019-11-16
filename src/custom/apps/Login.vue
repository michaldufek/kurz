<template>
  <div class="row">
    <SlideYUpTransition>
        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="p-0 px-lg-5 py-lg-5"
                class="modal-sm animated"
                :class="{ shake: isShaking }"
                style="margin: auto"
                v-if="cards.showLogin.value">
            <template>
                <div class="text-muted text-center mb-3">
                    {{$t('login.signIn') + " " + $t('login.with')}}
                </div>
                <div class="btn-wrapper text-center">
                    <base-button type="secondary" style="width: 50%;">
                        <img src="../assets/img/google-logo.png" style="width: 36px">
                        <!-- slot="icon" -->
                        &nbsp;&nbsp;&nbsp;&nbsp;Google
                    </base-button>                
                </div>
            </template>
            <template>
                <div class="text-center text-muted mb-4">
                    <small>{{$t('login.signInCredentials')}}</small>
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
                        <base-button v-if="error" type="link" @click="resetPass">{{$t('login.resetPass')}}</base-button>
                    </div>
                    <base-checkbox v-model="remember">
                        {{$t('login.remember')}}
                    </base-checkbox>
                    <div class="text-center">
                        <base-button type="primary" class="my-4" @click="logIn">{{$t('login.signIn')}}</base-button>
                        <small><p style="color: gray;">{{$t('login.lookingTo')}} <a href="#" @click="openRegisterModal">{{$t('login.createAccount')}}</a></p></small>
                    </div>
                </form>
            </template>
        </card>

        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="p-0 px-lg-5 py-lg-5"
                class="modal-sm animated"
                :class="{ shake: isShaking }"
                style="margin: auto"
                v-if="cards.showRegister.value">
            <template>
                <div class="text-center text-muted mb-4">
                    {{$t('login.register') + " " + $t('login.with')}}
                </div>
                <form role="form">
                    <base-input alternative
                                class="mb-3"
                                :placeholder="$t('login.emailExample')"
                                addon-left-icon="ni ni-email-83"
                                v-model="email"
                                @keyup.enter="register">
                    </base-input>
                    <base-input alternative
                                type="password"
                                :placeholder="$t('login.password')"
                                addon-left-icon="ni ni-lock-circle-open"
                                v-model="pass1"
                                @keyup.enter="register">
                    </base-input>
                    <base-input alternative
                                type="password"
                                :placeholder="$t('login.passwordAgain')"
                                addon-left-icon="ni ni-lock-circle-open"
                                v-model="pass2"
                                @keyup.enter="register">
                    </base-input>
                    <div class="text-center">
                        <p :class="[ error ? errorClass : noErrorClass , msgClass ]">{{message}}</p>                    
                        <base-button type="primary" class="my-4" @click="register">{{$t('login.register')}}</base-button>
                        <small><p style="color: gray;">{{$t('login.alreadyAccount')}} <a href="#" @click="openLoginModal">{{$t('login.login')}}</a></p></small>
                    </div>
                </form>
            </template>
        </card>

        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="p-0 px-lg-5 py-lg-5"
                class="modal-sm animated"
                :class="{ shake: isShaking }"
                style="margin: auto"
                v-if="cards.showResetPass.value">
            <template>
                <div class="text-center text-muted mb-4">
                    {{$t('login.resetPass') + " " + $t('login.with')}}
                </div>
                <form role="form">                    
                    <base-input alternative
                                type="password"
                                :placeholder="$t('login.password')"
                                addon-left-icon="ni ni-lock-circle-open"
                                v-model="pass1"
                                @keyup.enter="resetPassComplete">
                    </base-input>
                    <base-input alternative
                                type="password"
                                :placeholder="$t('login.passwordAgain')"
                                addon-left-icon="ni ni-lock-circle-open"
                                v-model="pass2"
                                @keyup.enter="resetPassComplete">
                    </base-input>
                    <div class="text-center">
                        <p :class="[ error ? errorClass : noErrorClass , msgClass ]">{{message}}</p>                    
                        <base-button type="primary" class="my-4" @click="resetPassComplete">{{$t('login.resetPass')}}</base-button>
                        <div class="text-center">
                            <p v-if="error" style="color: gray;">{{$t('login.lookingTo')}} <a href="#" @click="openRegisterModal">{{$t('login.createAccount')}}</a></p>
                            <p style="color: gray;"><a href="#" @click="openLoginModal">{{$t('login.login')}}</a></p>
                        </div>                                         
                    </div>
                </form>
            </template>
        </card>

        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="p-0 px-lg-5 py-lg-5"
                class="modal-sm animated"
                :class="{ shake: isShaking }"
                style="margin: auto"
                v-if="cards.showVerifyRegister.value">
            <template>
                <form role="form">                    
                    <div class="text-center">
                        <h4 :class="[ error ? errorClass : noErrorClass , msgClass ]">{{message}}</h4>   
                        <p v-if="error" style="color: gray;">{{$t('login.lookingTo')}} <a href="#" @click="openRegisterModal">{{$t('login.createAccount')}}</a></p>           
                        <p style="color: gray;"><a href="#" @click="openLoginModal">{{$t('login.login')}}</a></p>
                    </div>
                </form>
            </template>
        </card>
    </SlideYUpTransition>
  </div>
</template>
<script>
import { SlideYUpTransition } from "vue2-transitions";
import auth from '@/custom/assets/js/auth'
import '../assets/css/shake.css'
import constants from '@/custom/assets/js/constants'

export default {
    components: {
        SlideYUpTransition
    },
    data() {
      return {
        cards: {
            showLogin: { value: false },
            showRegister: { value: false },
            showResetPass: { value: false },
            showVerifyRegister: { value: false }
        },
        email: '',
        pass: '',
        pass1: '',
        pass2: '',
        remember: true,
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
            if (!('remember' in localStorage)) {
                localStorage.setItem('remember', true)
            } 
            this.remember = JSON.parse(localStorage.remember)

            auth.init()
        },

        logIn () {
            auth.login(this.email, this.pass, (loggedIn, err) => {
                this.error = !loggedIn
                if (!loggedIn) {                    
                    this.shakeModal()
                    this.message = err
                } else {
                    this.$router.replace(this.$route.query.redirect || '/')
                }
            })
        },
        resetPass () {
            auth.resetPass(this.email, (resetted, msg) => {
                this.error = !resetted
                if (!resetted) {
                    this.shakeModal()
                }
                this.message = msg
            })
        },
        resetPassComplete() {
            auth.verifyReset(this.$route.params.uid, this.$route.params.token, this.pass1, this.pass2, (success, msg) => {
                this.error = !success
                if (!success) {
                    this.shakeModal()
                }
                this.message = msg
            })
        },
        register () {
            auth.register(this.email, this.pass1, this.pass2, (registered, msg) => {
                this.error = !registered
                if (!registered) {
                    this.shakeModal()                    
                }
                this.message = msg
            })
        },
        shakeModal(){
            this.isShaking = true
            setTimeout(() => { 
                this.isShaking = false
            }, constants.shakeInterval );
            this.pass = ''
        },
        openLoginModal(){
            this.openModal(this.cards.showLogin)
        },
        openResetPassModal(){
            this.openModal(this.cards.showResetPass)
        },
        openRegisterModal(){
            this.openModal(this.cards.showRegister)
        },
        openVerifyRegisterModal(success){
            let msg = ''

            if (success) {
                msg = this.$i18n.t('login.registerSuccess')
            } else {
                this.shakeModal()
                msg = this.$i18n.t('login.registerFail')
            }
            
            this.openModal(this.cards.showVerifyRegister, msg, !success)
        },
        openResetPassModal(){
            this.openModal(this.cards.showResetPass)
        },
        openModal(card, msg, err){
            for (var otherCard in this.cards) {
                if (this.cards.hasOwnProperty(otherCard)) {           
                    this.cards[otherCard].value = false
                }
            }

            this.error = err ? err : false
            this.message = msg
            this.email = ''
            this.pass1 = ''
            this.pass2 = ''

            setTimeout(() => {
                card.value = true  
            }, constants.loginShowInterval );
        }
    },
    mounted() {
        this.init()

        if ("key" in this.$route.params) {
            auth.verifyRegister(this.$route.params.key, (success) => {  
                this.openVerifyRegisterModal(success)
            })
        } else if ("uid" in this.$route.params && "token" in this.$route.params) {
            this.openResetPassModal()
        } else {
            auth.logout()
            this.openLoginModal();
        }
    },
    watch: {
        remember(val) {
            localStorage.setItem('remember', val)
        }
    }
}
</script>
<style>
.message {
    white-space: pre-line;
}

.noError {
    color: gray;    
}

.error {
  color: red !important;
}
</style>