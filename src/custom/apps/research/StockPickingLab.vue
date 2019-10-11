<template>
  <nav class="navbar navbar-expand-lg navbar-absolute"
       :class="{'bg-white': showMenu, 'navbar-transparent': !showMenu}">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div class="navbar-toggle d-inline" :class="{toggled: $sidebar.showSidebar}">
          <button type="button"
                  class="navbar-toggler"
                  aria-label="Navbar toggle button"
                  @click="toggleSidebar">
            <span class="navbar-toggler-bar bar1"></span>
            <span class="navbar-toggler-bar bar2"></span>
            <span class="navbar-toggler-bar bar3"></span>
          </button>
        </div>
        <router-link class="navbar-brand" to="/stockPickingLab/filters">{{$t("research.stockPickingLab.filters.title")}}</router-link>
        <router-link class="navbar-brand" to="/stockPickingLab/results" style="margin-left: 140px;">{{$t("research.stockPickingLab.results.title")}}</router-link>        
      </div>
    </div>
  </nav>
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