<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card -->
      <div class="col-lg-6 col-md-12">
        <card class="card">
          <h4 class="card-title">Premium Strategies</h4>
          <li v-for="strategyName in premiumStrategies" style="list-style-type: none;">
            {{strategyName}}
            <base-button  type="secondary" size="1" fill>select</base-button>
            <!-- to-do: export to Portfolio manager/Designed portfolio -->
            <!-- to-do: v-if="strategies.enableLive" -->
            <base-button type="secondary" fill>remove</base-button>        
            <!-- v-if="strategies.enableStore" -->
            <br/>
          </li>
        </card>
      </div>
      <div class="col-lg-6 col-md-12">
        <card class="card">
          <h4 class="card-title">My Strategies</h4>
          <li v-for="strategyName in premiumStrategies" style="list-style-type: none;">
            {{strategyName}}
            <base-button  type="secondary" size="1" fill>select</base-button>
            <!-- v-if="strategies.enableLive" -->
            <base-button type="secondary" fill>remove</base-button>        
            <!-- v-if="strategies.enableStore" -->
            <br/>
          </li>
        </card>
      </div>
    <!-- </card> -->
  </div>
</template>
<script>
  import { BaseButton } from "@/components";

  var samplePortfolioNames = ["S1 with very very long title", "S2 with very very long title", "S3 with very very long title", "S4 with very very long title"];

  export default {
    components: {
      BaseButton        
    },
    data() {
      return {    
        premiumStrategies: samplePortfolioNames,  
        myStrategies: samplePortfolioNames
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