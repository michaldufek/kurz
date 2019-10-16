<template>
  <div class="row">
    <!-- :show.sync="modals.loginModalShow" -->
    <modal id="loginModal"
           :show="modals.loginModalShow"
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
                <div class="text-muted text-center mb-3">
                    <small>{{$t('login.signIn') + " " + $t('login.with')}}</small>
                </div>
                <div class="btn-wrapper text-center">
                    <base-button type="secondary">
                        <!-- <img src="../assets/img//Twitter_Social_Icon_Circle_Color.svg"> -->
                        <!-- slot="icon" -->
                        Twitter
                    </base-button>

                    <base-button type="secondary">
                        <img src="https://demos.creative-tim.com/argon-design-system/assets/img/icons/common/google.svg">
                        <!-- slot="icon" -->
                        Google
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
                    <p v-if="error" style="color: red;">{{errorMsg}}</p>
                    <base-checkbox>
                        {{$t('login.remember')}}
                    </base-checkbox>
                    <div class="text-center">
                        <base-button type="primary" class="my-4" @click="logIn">{{$t('login.signIn')}}</base-button>
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
            loginModalShow: false,
            resetPassModalShow: false,
            registerModalShow: false
        },
        userName: '',
        email: 'joe@example.com',
        pass: '',
        pass1: '',
        pass2: '',
        error: false,
        errorMsg: this.$t('login.badLogin'),
        resetMsg: '',
        registerMsg: '',
        isShaking: false
      };
    },
    methods: {
        logIn () {
            auth.login(this.userName, this.email, this.pass, (loggedIn, err) => {
                if (!loggedIn) {                    
                    this.shakeModal()
                    this.errorMsg = err
                    this.error = true
                } else {
                    this.$router.replace(this.$route.query.redirect || '/')
                }
            })
        },
        // resetPass () {
        //     auth.resetPass(this.email, res => {
        //         this.resetMsg = res
        //     })
        // },
        // register () {
        //     auth.register(this.userName, this.email, this.pass1, this.pass2, res => {
        //         this.registerMsg = res
        //     })
        // },
        shakeModal(){
            this.isShaking = true
            setTimeout(() => { 
                this.isShaking = false
            }, 1000 );
            this.pass = ''
        },
        openLoginModal(){
            // this.openModal(this.modals.loginModalShow)
            setTimeout(() => {
                this.modals.loginModalShow = true  
            }, 230);
        },
        // openResetPassModal(){
        //     this.openModal(this.modals.resetPassModalShow)
        // },
        // openRegisterModal(){
        //     this.openModal(this.modals.registerModalShow)
        // },
        // openModal(modal){
        //     setTimeout(() => {
        //         modal = true  
        //     }, 230);
        // }
    },
    mounted() {
      this.openLoginModal();
    }
}
</script>
<style>
</style>