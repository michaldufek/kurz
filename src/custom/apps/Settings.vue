<template>
  <div>
    <div class="row">
      <div class="col-md-4">
        <card>
          <h5 class="title">{{$t('research.stockPickingLab.metrics')}}</h5>
          <ul style="list-style-type: none; padding-left: 0px;">
            <li >
              <base-checkbox>{{$t('research.stockPickingLab.filters.currency')}}</base-checkbox>
            </li>
            <li >
              <base-checkbox>{{$t('research.stockPickingLab.filters.exchange') + "/" + $t('research.stockPickingLab.filters.index')}}</base-checkbox>
            </li>
            <li >
              <base-checkbox>{{$t('research.stockPickingLab.filters.dividend')}}</base-checkbox>
            </li>
            <li >
              <base-checkbox>{{$t('research.stockPickingLab.filters.riskProfile')}}</base-checkbox>
            </li>
            <li >
              <base-checkbox>{{$t('research.stockPickingLab.filters.sampleMetrics')}}</base-checkbox>
            </li>
          </ul>
        </card>
      </div>            
    </div>
    <div class="locale-changer">
      <!-- to-do: not working globally now -->
      <select v-model="$root.$i18n.locale">
        <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
      </select>
    </div>
    <base-checkbox style="margin-bottom: 30px;">{{$t('settings.darkMode')}}</base-checkbox>
    <base-button style="margin-left: 20px;" type="secondary" fill>{{$t('settings.save')}}</base-button>        
  </div>
</template>
<script>
  export default {
    components: {
    },
    data () {
      return { 
        langs: [ 'en', 'cs' ] 
      }
    }
    // methods: {
      // changeLocale() {
      //   // to-do: connect to a language switcher radio
      //   this.$i18n.locale = this.$i18n.locale === 'en' ? 'cs' : 'en'
      //   // $root.$i18n.locale
      // }
    // }
  }
</script>
<style>
</style>
