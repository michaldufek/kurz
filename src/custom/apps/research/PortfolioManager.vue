<template>
  <div>
    <portfolio-card :title="$t('research.portfolioManager.designedPortfolio')"
                    :strategies="designedPortfolioData.strategies"
                    :stats="designedPortfolioData.stats"
                    :errored="designedPortfolioData.errored"
                    :loading="designedPortfolioData.loading">
    </portfolio-card>
    <portfolio-card :title="$t('research.portfolioManager.livePortfolio')"
                    :strategies="livePortfolioData.strategies"
                    :stats="livePortfolioData.stats"
                    :errored="livePortfolioData.errored"
                    :loading="livePortfolioData.loading">
    </portfolio-card>
    <portfolio-card :title="$t('research.portfolioManager.optimalPortfolio')"
                    :strategies="optimalPortfolioData.strategies"
                    :stats="optimalPortfolioData.stats"
                    :errored="optimalPortfolioData.errored"
                    :loading="optimalPortfolioData.loading">
    </portfolio-card>
    <!-- to-do: stats as a source from Ware house? -->
  </div>
</template>
<script>
  import PortfolioCard from "@/custom/components/Cards/PortfolioCard.vue";
  import axios from '@/../node_modules/axios';

  var samplePortfolioNames = ["S1 with very very long title", "S2 with very very long title", "S3 with very very long title", "S4 with very very long title"];

  export default {
    components: {
      PortfolioCard
    },
    data() {
      return {    
        designedPortfolioData: {},  
        livePortfolioData: {},
        optimalPortfolioData: {}
      }
    },
    methods: {  
      initPortfolioData(apiUrl, portfolioData) {
        axios
        .get(apiUrl)
        .then(response => {
          this.reportData = {
            strategies: {
              names: samplePortfolioNames
            },
            stats: {
              cagr: response.data.cagr,
              sr: response.data.sharpe,
              equityOuts: "5345",
              maxDD: response.data.maxdd,
              beta: "43",
              alfa: "43",
              missProposal: "__miss.proposal"
            }
          };
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          portfolioData.strategies = this.reportData.strategies;
          portfolioData.stats = this.reportData.stats;
        });
      },
      initDesignedPortfolioData() {
        this.initPortfolioData("https://app1.objectively.info/api/mfreport2", this.designedPortfolioData);
        // this.designedPortfolioData.enableStore = true;
      },
      initLivePortfolioData() {
        this.initPortfolioData("https://app1.objectively.info/api/uvxyreport2", this.livePortfolioData);     
        this.livePortfolioData.strategies.enableLive = false;
      },
      initOptimalPortfolioData(){
        // this.initPortfolioData("https://app1.objectively.info/api/mfreport2", this.optimalPortfolioData);
        // this.optimalPortfolioData.strategies.enableLive = false;
        // this.optimalPortfolioData.strategies.enableStore = false;
      },
      initPortfoliosData() {
        this.initDesignedPortfolioData();
        this.initLivePortfolioData();
        this.initOptimalPortfolioData();
      }
    },    
    mounted() {
      this.initPortfoliosData();
    }
  };
</script>
<style>
</style>