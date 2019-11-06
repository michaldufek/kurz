<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card --> 
      <div class="col-lg-4 col-md-12">
        <fancy-card :title="this.$t('research.stockPickingLab.stock').toLowerCase()"
                    :fullTitle="symbol + ' (' + name + ')'"
                    :showTitle="true"
                    :items="[$t('cagr'), $t('sharpeRatio'), $t('stdDev'), $t('recoveryDDtime'), $t('maxDD')]"
                    :values="stats"                    
                    :titles="$t('terms.perfStats')">
        </fancy-card>
      </div>

      <div class="col-lg-8 col-md-12">
        <fancy-chart :title="$t('sidebar.stockPickingLab') + ' - ' + symbol"
                     :fullTitle="$t('research.stockPickingLab.chart').toLowerCase()"
                     :apiUrls="chartApiUrl">
        </fancy-chart>
      </div>      
     <!-- </card> -->
  </div>
</template>
<script>
import FancyCard from '@/custom/components/Cards/FancyCard.vue';
import FancyChart from '@/custom/components/FancyChart';
import constants from '@/custom/assets/js/constants';

export default {
  name: "stock-card",
  components: {
    FancyCard,
    FancyChart
  },

  props: {
    symbol: {
      type: String,
      description: "Stock symbol"
    },
    name: {
      type: String,
      description: "Stock name"
    },
    stats: {
      type: Array,
      default: () => [],
      description: "Statistics data in same shape and order as items"
    }
  },

  computed: {
    chartApiUrl() {
      return [ constants.urls.ticker.stock + this.symbol ]
    }
  }
};
</script>
<style>
</style>