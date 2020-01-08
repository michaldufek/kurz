<template>
  <div class="row">

      <assets-patterns-picker :title="$t('research.patternLab.alerts.title')"
                              :btnText="$t('research.patternLab.alerts.addAlert')" 
                              :showDatePickers="false"
                              @btnClicked="addAlert" />

      <!-- alerts  -->
      <div class="col-lg-10 col-md-12">
      </div>

  </div>
</template>
<script>
  import AssetsPatternsPicker from '@/custom/components/AssetsPatternsPicker'

  export default {
    components: {
      AssetsPatternsPicker
    },

    data() {
      return {
      }
    },

    computed: {      
    },

    methods: {
      addAlert() {

      }
    }
  }  
</script>
<style>
</style>