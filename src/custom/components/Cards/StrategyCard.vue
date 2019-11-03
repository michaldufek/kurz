<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card --> 
      <div class="col-lg-8 col-md-12">
        <fancy-chart :title="title"
                     :showTitle="true"
                     :apiUrls="[apiUrl]">
        </fancy-chart>
      </div>

      <div class="col-lg-4 col-md-12">
        <fancy-card :title="$t('dashboard.performanceStatistics')"
                    :apiUrl="apiUrl" 
                    :items="[$t('ytd'), $t('cagr'), $t('sharpeRatio'), $t('maxDD'), $t('equityOuts')]"
                    :valuesCreator="statsCreator"                    
                    :titles="$t('terms.perfStats')">
        </fancy-card>
      </div>
  </div>
</template>
<script>
import FancyChart from '@/custom/components/FancyChart';
import FancyCard from "@/custom/components/Cards/FancyCard.vue";

export default {
  name: "strategy-card",
  components: {
    FancyChart,
    FancyCard    
  }, 

  props: {
    title: {
      type: String,
      description: "Chart title"
    },
    apiUrl: {
      type: String,
      default: null,
      description: "URL to API data source"
    } 
  },

  methods: {
    statsCreator(responseData) {
      return [
        responseData.ytd,
        responseData.cagr,
        responseData.sharpe,
        responseData.maxdd,
        -33.821
      ]
    }
  }
};
</script>
<style>
</style>