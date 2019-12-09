<template>
  <div>
    <div class="col-lg-3 col-md-12">
      <fancy-table :title="$t('patternLab.chart.patternsHistory.title')"
                   :apiUrls="patternsHistoryUrl"
                   :columns="$t('patternLab.chart.patternsHistory.columns')"> 
                    <!--:titles="$t('terms.tradeTypes')"-->
      </fancy-table>
    </div>
  </div>
</template>
<script>
  import FancyTable from '@/custom/components/FancyTable';
  import helper from '@/custom/assets/js/helper';

  export default {
    components: {
      FancyTable
    },

    computed: {
      patternsHistoryUrl() {
        return [ "https://dev.analyticalplatform.com/api/pl/Backtests?patterns=1&symbols=MSFT&timeframe=1" ]
      }
    }
  };
</script>
<style>
</style>