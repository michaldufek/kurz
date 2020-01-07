<template>
  <div class="row">

      <assets-patterns-picker :title="$t('research.patternLab.backtestPatterns.title')"
                              :btnText="$t('research.patternLab.backtestPatterns.addPattern')" 
                              @btnClicked="addPattern" 
                              @timeframeChanged="timeframeChanged" />

      <!-- strategy settings  -->
      <div class="col-lg-2 col-md-12">
      </div>

      <!-- performance results  -->
      <div class="col-lg-8 col-md-12">
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
        timeframe: null,
        startDate: null,    
        endDate: null      
      }
    },

    computed: {      
    },

    methods: {
      addPattern() {

      },
      timeframeChanged() {

      }
    }
  }  
</script>
<style>
</style>