<template>
  <div>
  </div>
</template>
<script>
  import { BaseButton } from "@/components";

  export default {
    components: {
      BaseButton        
    },
    data() {
      return {    
      }
    },
    methods: {        
      initPremiumStrategiesData() {
      },
      initLivePortfolioData() {
      },
      initPortfoliosData() {
        this.initPremiumStrategiesData();
        this.initMyStrategiesData();
      }
    },    
    mounted() {
      this.initStategiesData();
    }
  };
</script>
<style>
</style>