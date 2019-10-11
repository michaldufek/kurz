<template>
  <div>
    <ul>
      <li v-for="strategyData in strategiesData" style="list-style-type: none;">
        <strategy-card :chartData="strategyData.chartData"
                       :stats="strategyData.statsData"
                       :errored="strategyData.errored"
                       :loading="strategyData.loading">
        </strategy-card>
      </li>
    </ul>
  </div> 
</template>
<script>
  import StrategyCard from '@/custom/components/Cards/StrategyCard.vue';
  import axios from '@/../node_modules/axios';

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
      // to-do: generalize axios call
      // getStrategy(apiUrl, transformResponse) {
      //   axios
      //   .get(apiUrl)
      //   .then(response => {
      //     this.strategyData = transformResponse(response);          
      //   })
      //   .catch(error => {
      //     console.log(error);
      //     this.strategyData.errored = true;
      //   })
      //   .finally(() => {
      //     console.log("finally");
      //     this.strategyData.loading = false;
      //     this.strategiesData.push(this.strategyData);
      //   });
      // },
      initStrategy(title, apiUrl) {
        axios
        .get(apiUrl)
        .then(response => {
          this.reportData = {
            chartData: {
              title: title,
              chartData: {
                datasets: [{
                  data: response.data.equity
                }],
                labels: response.data.time
              }
            },
            statsData: {
              ytd: response.data.ytd,
              cagr: response.data.cagr,
              sr: response.data.sharpe,
              maxdd: response.data.maxdd,
              equityOuts: -33.821
            }
          };
        })
        .catch(error => {
          console.log(error);
          this.reportData.errored = true;
        })
        .finally(() => {
          this.reportData.loading = false;
          this.strategiesData.push(this.reportData);
        });
      },
      initStrategiesData() {
        this.initStrategy("MF Report", "https://app1.objectively.info/api/mfreport2");
        this.initStrategy("UVXY Report", "https://app1.objectively.info/api/uvxyreport2");
        // to-do: generalized axios call
        // this.getStrategy("https://app1.objectively.info/api/mfreport2", (response) => { 
        //   return {
        //     chartData: {
        //       title: "MF Report",
        //       chartData: {
        //       datasets: [{
        //         data: response.data.equity
        //       }],
        //       labels: response.data.time
        //     },
        //     statsData: {
        //       ytd: response.data.ytd,
        //       cagr: response.data.cagr,
        //       sr: response.data.sharpe,
        //       maxdd: response.data.maxdd,
        //       equityOuts: -33.821
        //     }
        //     }
        //   };
        // });
      }
    },
    mounted() {
      this.initStrategiesData();
    }
  }
</script>
<style>
</style>