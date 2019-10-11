<template>
  <div>
    <router-link class="navbar-brand" to="/stockPickingLab/filters">{{$t("dashboard.title")}}</router-link>
    <router-link class="navbar-brand" to="/stockPickingLab/results" style="margin-left: 140px;">{{$t("research.title")}}</router-link>    
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