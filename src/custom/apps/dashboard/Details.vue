<template>
  <div>
    <ul style="list-style-type: none;">
      <li v-for="strategyData in strategiesData">
        <strategy-card :title="strategyData.title"
                       :apiUrls="strategyData.apiUrl"
                       :statsData="strategyData.statsData"
                       :loading="strategyData.loading"
                       :error="strategyData.error">
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
      loadStrategy(title, apiUrl, strategyNr) {
        let reportData = {
          title: title,
          loading: true,
          apiUrl: [apiUrl]
        }
        if (strategyNr === undefined) {          
          // push it so it appears in data (ie. in child component) and save its number to update it after loaded
          strategyNr = this.strategiesData.push(reportData) - 1;
        }

        axios
        .get(apiUrl)
        .then(response => {
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
          reportData.error = true
        })
        .finally(() => {
          reportData.loading = false;
          
          // data loaded OK so update child component
          this.strategiesData[strategyNr] = reportData;

          return strategyNr
        });
      },
      
      initStrategies() { 
        for (const [key, value] of Object.entries(constants.apiUrls)) {
          let strategyNr = this.loadStrategy(key, value + 2);

          // reload this strategy data in intervals
          setInterval(() => { 
            this.loadStrategy(key, value + 2);
          }, constants.dataReloadInterval );
        }
      }
    },
    mounted() {
      this.initStrategies();
    }
  }
</script>
<style>
</style>