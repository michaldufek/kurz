<template>
  <div>
    <div class="row">
      <div class="col-md-4">
        <card>
          <h5 class="title">{{$t('research.stockPickingLab.metrics')}}</h5>
          <ul style="list-style-type: none; padding-left: 0px;">
            <li >
              <base-checkbox v-model="currency">{{$t('research.stockPickingLab.filters.currency')}}</base-checkbox>
            </li>
            <li >
              <base-checkbox v-model="exchange">{{$t('research.stockPickingLab.filters.exchange')}}</base-checkbox>
            </li>
            <li >
              <base-checkbox v-model="index">{{$t('research.stockPickingLab.filters.index')}}</base-checkbox>
            </li>
            <li >
              <base-checkbox v-model="dividend">{{$t('research.stockPickingLab.filters.dividend')}}</base-checkbox>
            </li>
            <li >
              <base-checkbox v-model="riskProfile">{{$t('research.stockPickingLab.filters.riskProfile')}}</base-checkbox>
            </li>
            <li >
              <base-checkbox v-model="sector">{{$t('research.stockPickingLab.filters.sector')}}</base-checkbox>
            </li>
          </ul>
        </card>
      </div>            

      <div class="col-md-4">
        <card>
          <h5 class="title">{{$t('settings.general')}}</h5>
          <div class="locale-changer">
            <!-- to-do: working globally except landing pages -->
            <p style="float: left; margin-right: 10px;">{{$t('settings.language')}}:</p>
            <select v-model="$root.$i18n.locale">
              <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
            </select>
          </div>
          <base-checkbox v-model="darkMode" style="margin-top: 20px;">{{$t('settings.darkMode')}}</base-checkbox>
        </card>
      </div>
    </div>
    <base-button @click="clearSettings" style="margin-left: 20px;" type="secondary" fill>{{$t('settings.clearAll')}}</base-button>        
  </div>
</template>
<script>
  export default {
    components: {
    },
    methods: {
      init() {
        if (!('currencyEnabled' in localStorage)) {
          localStorage.setItem('currencyEnabled', true)
        } 
        this.currency = JSON.parse(localStorage.currencyEnabled)

        if (!('exchangeEnabled' in localStorage)) {
          localStorage.setItem('exchangeEnabled', true)
        }
        this.exchange = JSON.parse(localStorage.exchangeEnabled)
        
        if (!('indexEnabled' in localStorage)) {
          localStorage.setItem('indexEnabled', true)
        }
        this.index = JSON.parse(localStorage.indexEnabled)
        
        if (!('dividendEnabled' in localStorage)) {
          localStorage.setItem('dividendEnabled', true)
        }
        this.dividend = JSON.parse(localStorage.dividendEnabled)

        if (!('riskProfileEnabled' in localStorage)) {
          localStorage.setItem('riskProfileEnabled', true)
        }
        this.riskProfile = JSON.parse(localStorage.riskProfileEnabled)
        
        if (!('sectorEnabled' in localStorage)) {
          localStorage.setItem('sectorEnabled', true)
        }
        this.sector = JSON.parse(localStorage.sectorEnabled)
        
        // if (!('currentLang' in localStorage)) {
        //   localStorage.setItem('currentLang', 'en')
        // } 
        // this.currentLang = localStorage.currentLang

        if (!('darkMode' in localStorage)) {
          localStorage.setItem('darkMode', true)
        } 
        this.darkMode = JSON.parse(localStorage.darkMode)
      },
      clearSettings() {
        let token = localStorage.token
        localStorage.clear()
        localStorage.setItem('token', token)
        this.init()
      }
    },
    data () {
      return {
        currency: true,
        exchange: true,
        index: true,
        dividend: true,
        riskProfile: true,
        sector: true,

        langs: [ 'en', 'cs' ],
        // currentLang: 'en',
        darkMode: true
      }
    },
    mounted() {
      this.init()
    },
    watch: {
      currency(val) {
        localStorage.currencyEnabled = val
      },
      exchange(val) {
        localStorage.exchangeEnabled = val
      },
      index(val) {
        localStorage.indexEnabled = val
      },
      dividend(val) {
        localStorage.dividendEnabled = val
      },
      riskProfile(val) {
        localStorage.riskProfileEnabled = val
      },
      sector(val) {
        localStorage.sectorEnabled = val
      },

      // currentLang(val) {
      //   localStorage.currentLang = val
      // },
      darkMode(val) {
        localStorage.darkMode = val
      }
    }
  }
</script>
<style>
</style>
