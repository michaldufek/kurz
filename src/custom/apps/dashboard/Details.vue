<template>
  <div>
    <ul>
      <li v-for="strategyData in strategiesData" style="list-style-type: none;">
        <strategy-card :title="strategyData.title"
                       :chartData="strategyData.chartData"
                       :statsData="strategyData.statsData"
                       :live="strategyData.live"
                       :loading="strategyData.loading"
                       :updateTs="strategyData.updateTs">
        </strategy-card>
      </li>
    </ul>
  </div> 
</template>
<script>
  import StrategyCard from '@/custom/components/Cards/StrategyCard.vue';
  import axios from '@/../node_modules/axios';
  import helper from '@/custom/assets/js/helper';
  import constants from '@/custom/assets/js/constants';

  export default {
    components: {
      StrategyCard
    },
    data() {
      return {
        strategiesData: []
      };
    },
    methods: {
      loadStrategy(title, apiUrl, strategyNr, chartTimer) {
        let reportData = {
          title: title,
          loading: true
        }
        if (strategyNr === undefined) {          
          // push it so it appears in data (ie. in child component) and save its number to update it after loaded
          strategyNr = this.strategiesData.push(reportData) - 1;
        }

        axios
        .get(apiUrl)
        .then(response => {
          reportData.chartData = {
            datasets: [{
              data: response.data.equity
            }],
            labels: helper.formatDateTimes(response.data.time)
          }
          reportData.statsData = {
            ytd: response.data.ytd,
            cagr: response.data.cagr,
            sr: response.data.sharpe,
            maxdd: response.data.maxdd,
            equityOuts: -33.821
          }
        })
        .catch(error => {
          console.log(error);
          reportData.live = false;

          // if error reload this strategy data after shorter timeout
          setTimeout(() => { 
            this.loadStrategy(title, apiUrl, strategyNr)
          }, constants.dataReloadInterval / 2 );
        })
        .finally(() => {
          reportData.loading = false;
          reportData.live = true;
          reportData.updateTs = Date.now()
          
          // data loaded OK so update child component
          this.strategiesData[strategyNr] = reportData;

          // reload this strategy data after timeout
          setTimeout(() => { 
            this.loadStrategy(title, apiUrl, strategyNr)
          }, constants.dataReloadInterval );
        });
      },
      initStrategies() {        
        this.loadStrategy("MF Report", "https://app1.objectively.info/api/mfreport2");
        this.loadStrategy("UVXY Report", "https://app1.objectively.info/api/uvxyreport2");
      }
    },
    mounted() {
      this.initStrategies();
    }
  }
</script>
<style>
</style>