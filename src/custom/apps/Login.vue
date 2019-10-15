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
           :onClose="login">
        <card type="secondary"
                header-classes="bg-white pb-5"
                body-classes="px-lg-5 py-lg-5"
                class="border-0 mb-0">
            <template>
                <div class="text-muted text-center mb-3">
                    <small>{{$t('login.signIn') + " " + $t('login.with')}}</small>
                </div>
                <div class="btn-wrapper text-center">
                    <base-button type="default">
                        <img slot="icon" src="https://demos.creative-tim.com/argon-design-system/assets/img/icons/common/github.svg">
                        Github
                    </base-button>

                    <base-button type="danger">
                        <img slot="icon" src="https://demos.creative-tim.com/argon-design-system/assets/img/icons/common/google.svg">
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
                                :placeholder="$t('login.email')"
                                addon-left-icon="ni ni-email-83"
                                v-model="email"
                                @keyup.enter="login">
                    </base-input>
                    <base-input alternative
                                type="password"
                                :placeholder="$t('login.password')"
                                addon-left-icon="ni ni-lock-circle-open"
                                v-model="pass"
                                @keyup.enter="login">
                    </base-input>
                    <p v-if="error" style="color: red;">{{$t('login.badLogin')}}</p>
                    <base-checkbox>
                        {{$t('login.remember')}}
                    </base-checkbox>
                    <div class="text-center">
                        <base-button type="primary" class="my-4" @click="login">{{$t('login.signIn')}}</base-button>
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
            loginModalShow: false
        },
        email: 'joe@example.com',
        pass: '',
        error: false,
        isShaking: false
      };
    },
    methods: {
        login () {
            auth.login(this.email, this.pass, loggedIn => {
                if (!loggedIn) {
                    this.shakeModal()
                    this.error = true
                } else {
                    this.$router.replace(this.$route.query.redirect || '/')
                }
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
            setTimeout(() => {
                this.modals.loginModalShow = true  
            }, 230);
        }
    },
    mounted() {
      this.openLoginModal();
    }
}
</script>
<style>
</style>