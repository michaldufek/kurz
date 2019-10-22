<template>
  <div class="row">
    <!-- :show.sync="modals.loginModalShow" -->
    <modal :show="modals.loginModalShow.value"
           :showClose="false"    
           body-classes="p-0"
           modal-classes="modal-sm"
           :centered="false"
           class="animated"          
           :class="{ shake: isShaking }">
        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="px-lg-5 py-lg-5"
                class="border-0 mb-0">
            <template>
                <div class="text-muted text-center mb-3">
                    {{$t('login.signIn') + " " + $t('login.with')}}
                </div>
                <div class="btn-wrapper text-center">
                    <base-button type="secondary" style="width: 50%;">
                        <img src="../assets/img/f_logo_RGB-Blue_58.png" style="width: 36px">
                        <!-- slot="icon" -->
                        Facebook
                    </base-button>

                    <base-button type="secondary">
                        <img src="../assets/img/Twitter_Social_Icon_Circle_Color.svg" style="width: 36px">
                        <!-- slot="icon" -->
                        Twitter
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
                                :placeholder="$t('login.userName')"
                                addon-left-icon="ni ni-email-83"
                                v-model="userName"
                                @keyup.enter="logIn">
                    </base-input>
                    <base-input alternative
                                class="mb-3"
                                :placeholder="$t('login.email')"
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
                        <p style="color: red; white-space: pre-line;" :class="{ error: error }">{{message}}</p>                    
                        <!-- to-do: red color not working -->
                        <base-button v-if="error" type="link" @click="resetPass">{{$t('login.resetPass')}}</base-button>
                    </div>
                    <base-checkbox>
                        {{$t('login.remember')}}
                    </base-checkbox>
                    <div class="text-center">
                        <base-button type="primary" class="my-4" @click="logIn">{{$t('login.signIn')}}</base-button>
                        <small><p style="color: gray;">{{$t('login.lookingTo')}} <a href="#" @click="openRegisterModal">{{$t('login.createAccount')}}</a></p></small>
                    </div>
                </form>
            </template>
        </card>
    </modal>

    <modal :show="modals.registerModalShow.value"
           :showClose="false"    
           body-classes="p-0"
           modal-classes="modal-sm"
           :centered="false"
           class="animated"
           :class="{ shake: isShaking }"
           :onClose="logIn">
        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="px-lg-5 py-lg-5"
                class="border-0 mb-0">
            <template>
                <div class="text-center text-muted mb-4">
                    {{$t('login.register') + " " + $t('login.with')}}
                </div>
                <form role="form">
                    <base-input alternative
                                class="mb-3"
                                :placeholder="$t('login.userName')"
                                addon-left-icon="ni ni-email-83"
                                v-model="userName"
                                @keyup.enter="register">
                    </base-input>
                    <base-input alternative
                                class="mb-3"
                                :placeholder="$t('login.email')"
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
                        <p style="color: red; white-space: pre-line;" :class="{ error: error }">{{message}}</p>                    
                        <base-button type="primary" class="my-4" @click="register">{{$t('login.register')}}</base-button>
                        <small><p style="color: gray;">{{$t('login.alreadyAccount')}} <a href="#" @click="openLoginModal">{{$t('login.login')}}</a></p></small>
                    </div>
                </form>
            </template>
        </card>
    </modal>

    <modal :show="modals.resetPassModalShow.value"
           :showClose="false"    
           body-classes="p-0"
           modal-classes="modal-sm"
           :centered="false"
           class="animated"
           :class="{ shake: isShaking }"
           :onClose="logIn">
        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="px-lg-5 py-lg-5"
                class="border-0 mb-0">
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
                        <p style="color: red; white-space: pre-line;" :class="{ error: error }">{{message}}</p>                    
                        <base-button type="primary" class="my-4" @click="resetPassComplete">{{$t('login.resetPass')}}</base-button>
                        <div class="text-center">
                            <p v-if="error" style="color: gray;">{{$t('login.lookingTo')}} <a href="#" @click="openRegisterModal">{{$t('login.createAccount')}}</a></p>
                            <p style="color: gray;"><a href="#" @click="openLoginModal">{{$t('login.login')}}</a></p>
                        </div>                                         
                    </div>
                </form>
            </template>
        </card>
    </modal>

    <modal :show="modals.verifyRegisterModalShow.value"
           :showClose="false"    
           body-classes="p-0"
           modal-classes="modal-sm"
           :centered="false"
           class="animated"
           :class="{ shake: isShaking }"
           :onClose="logIn">
        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="px-lg-5 py-lg-5"
                class="border-0 mb-0">
            <template>
                <form role="form">                    
                    <div class="text-center">
                        <h4 style="color: red; white-space: pre-line;" :class="{ error: error }">{{message}}</h4>   
                        <p v-if="error" style="color: gray;">{{$t('login.lookingTo')}} <a href="#" @click="openRegisterModal">{{$t('login.createAccount')}}</a></p>           
                        <p style="color: gray;"><a href="#" @click="openLoginModal">{{$t('login.login')}}</a></p>
                    </div>
                </form>
            </template>
        </card>
    </modal>
  </div>
</template>
<script>
import { Modal } from '@/components';
import auth from '@/custom/assets/js/auth'
import '../assets/css/shake.css'

export default {
    components: {
      Modal
    },
    data() {
      return {
        modals: {
            loginModalShow: { value: false },
            registerModalShow: { value: false },
            resetPassModalShow: { value: false },
            verifyRegisterModalShow: { value: false }
        },
        userName: '',
        email: 'joe@example.com',
        pass: '',
        pass1: '',
        pass2: '',
        error: false,
        message: '',
        isShaking: false
      };
    },
    methods: {
        logIn () {
            auth.login(this.userName, this.email, this.pass, (loggedIn, err) => {
                if (!loggedIn) {                    
                    this.shakeModal()
                    this.message = err
                    this.error = true
                } else {
                    this.$router.replace(this.$route.query.redirect || '/')
                }
            })
        },
        resetPass () {
            auth.resetPass(this.email, (resetted, msg) => {
                if (!resetted) {
                    this.shakeModal()
                    this.error = true
                }
                this.message = msg
            })
        },
        resetPassComplete() {
            auth.verifyReset(this.$route.params.uid, this.$route.params.token, this.pass1, this.pass2, (success, msg) => {
                this.error = false
                if (!success) {
                    this.shakeModal()
                    this.error = true
                }
                this.message = msg
            })
        },
        register () {
            auth.register(this.userName, this.email, this.pass1, this.pass2, (registered, msg) => {
                if (!registered) {
                    this.shakeModal()
                    this.error = true
                }
                this.message = msg
            })
        },
        shakeModal(){
            this.isShaking = true
            setTimeout(() => { 
                this.isShaking = false
            }, 500 ); // half minute
            this.pass = ''
        },
        openLoginModal(){
            this.openModal(this.modals.loginModalShow)
        },
        openResetPassModal(){
            this.openModal(this.modals.resetPassModalShow)
        },
        openRegisterModal(){
            this.openModal(this.modals.registerModalShow)
        },
        openVerifyRegisterModal(success){
            let msg = ''
            let err = false

            if (success) {
                msg = this.$i18n.t('login.registerSuccess')
            } else {
                this.shakeModal()
                err = true
                msg = this.$i18n.t('login.registerFail')
            }
            
            this.openModal(this.modals.verifyRegisterModalShow, msg, err)
        },
        openResetPassModal(){
            this.openModal(this.modals.resetPassModalShow)
        },
        openModal(modal, msg, err){
            for (var otherModal in this.modals) {
                if (this.modals.hasOwnProperty(otherModal)) {           
                    this.modals[otherModal].value = false
                }
            }

            this.error = err ? err : false
            this.message = msg
            this.pass1 = ''
            this.pass2 = ''

            setTimeout(() => {
                modal.value = true  
            }, 230);
        }
    },
    mounted() {
        if (process.env.NODE_ENV === 'production') {
            this.$csrf.set(Math.floor(Math.random() * 1000000000) + 1)
            auth.init(this.$csrf.get())
        } else {
            console.log('In Dev Mode - CSRF token not set')
        }

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
    }
}
</script>
<style>
.error {
  color: red;
}
</style>