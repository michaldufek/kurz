<template>
  <div class="row">
    <!-- <base-button block type="default" class=" mb-3" @click="modals.modal3 = true">
        Form
    </base-button> -->
    <p v-if="error" class="error">Bad login information</p>
    <!-- :show.sync="modals.loginModal" -->
    <modal :show="true"
           :showClose="false"    
           body-classes="p-0"
           modal-classes="modal-dialog-centered modal-sm"
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

export default {
    components: {
      Modal
    },
    data() {
      return {
        modals: {
            loginModal: true
        },
        email: 'joe@example.com',
        pass: '',
        error: false
      };
    },
    methods: {
        login () {
            auth.login(this.email, this.pass, loggedIn => {
                if (!loggedIn) {
                    this.error = true
                } else {
                    this.$router.replace(this.$route.query.redirect || '/')
                }
            })
        },
        // shakeModal(){
        //     $('#loginModal .modal-dialog').addClass('shake');
        //             $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
        //             $('input[type="password"]').val('');
        //             setTimeout( function(){ 
        //                 $('#loginModal .modal-dialog').removeClass('shake'); 
        //     }, 1000 );
        // }
    }
}
</script>
<style>
</style>