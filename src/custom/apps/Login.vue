<template>
  <div class="row">
    <!-- :show.sync="modals.loginModalShow" -->
    <modal :show="modals.loginModalShow.value"
           :showClose="false"    
           body-classes="p-0"
           modal-classes="modal-dialog-centered modal-sm"
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
                        <p :class="{ error: error }">{{message}}</p>                    
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
           modal-classes="modal-dialog-centered modal-sm"
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
                        <p :class="{ warning: error }">{{message}}</p>                    
                        <base-button type="primary" class="my-4" @click="register">{{$t('login.register')}}</base-button>
                        <small><p style="color: gray;">{{$t('login.alreadyAccount')}} <a href="#" @click="openLoginModal">{{$t('login.login')}}</a></p></small>
                    </div>
                </form>
            </template>
        </card>
    </modal>
  </div>
</template>
<script>
import { Modal } from '@/components';
import auth from '@/router/auth'
import '../assets/css/shake.css'

export default {
    components: {
      Modal
    },
    data() {
      return {
        modals: {
            loginModalShow: { value: false },
            resetPassModalShow: { value: false },
            registerModalShow: { value: false }
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
            }, 1000 );
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
        openModal(modal){
            for (var otherModal in this.modals) {
                if (this.modals.hasOwnProperty(otherModal)) {           
                    this.modals[otherModal].value = false
                }
            }
            this.error = false
            this.message = ''

            setTimeout(() => {
                modal.value = true  
            }, 230);
        }
    },
    mounted() {
      this.openLoginModal();
    }
}
</script>
<style>
.error {
  color: red;
}
</style>