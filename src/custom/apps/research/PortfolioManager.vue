<template>
  <div>
    <DualRingLoader v-if="loading" :color="'#54f1d2'" style="margin-left: 250px" />
    <portfolio-card v-else 
                    :title="$t('research.portfolioManager.designedPortfolio')"
                    :strategies="designedStrategies"
                    @wentLive="goLive"
                    @stored="stored">
    </portfolio-card>
    <portfolio-card v-if="!loading"
                    :title="$t('research.portfolioManager.livePortfolio')"
                    :strategies="liveStrategies"
                    :enableStop="true"
                    @stoped="stoped">
    </portfolio-card>
    <portfolio-card :title="$t('research.portfolioManager.optimalPortfolio')"
                    :strategies="optimalStrategies"
                    @wentLive="goLive"
                    @stored="stored">
    </portfolio-card>
    <!-- to-do: stats as a source from Ware house? -->
  </div>
</template>
<script>
  import PortfolioCard from "@/custom/components/Cards/PortfolioCard.vue";
  import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';

  import constants from '@/custom/assets/js/constants';
  import helper from '@/custom/assets/js/helper';


  export default {
    components: {
      PortfolioCard,
      DualRingLoader
    },

    data() {
      return {
        designedStrategies: [],
        liveStrategies: [],

        loading: false
      }
    },

    computed: {
      optimalStrategies() {
        let id = 0
        return Object.entries(constants.urls.chart).map(entry => {
          return {
            id: id++,
            name: entry[0],
            url: entry[1]
          }
        })
      }
    },

    methods: {
      initStrategies() {
        this.loading = true

        this.designedStrategies = []
        this.liveStrategies = []
        this.$http
        .get(constants.urls.datawarehouse.results)
        .then(response => response.data.forEach(datum => {
          if (datum.in_portfolio && !datum.live) {
            this.designedStrategies.push({
               id: datum.original_result_id,
               name: datum.name, 
               url: null    // to-do: get url of statistics of the strategy instead of null
            }) 
          }

          if (datum.live) {
            this.liveStrategies.push({
               id: datum.original_result_id,
               name: datum.name, 
               url: null    // to-do: get url of statistics of the strategy instead of null
            }) 
          }
        }))
        .catch(error => {
          console.log(error)
          if (error.message === constants.strings.networkError) {
            helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', this.$t(constants.storeKeys.portfolioManager))
          }
        })
        .finally(() => this.loading = false)
      },

      // emitted events
      goLive(id) {        
        this.$http
        .patch(constants.urls.datawarehouse.result + '/' + id, { live: true })
        .catch(error => {
            console.log(error)
            if (error.message === constants.strings.networkError) {
                helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', `${this.$t(this.warehouseKey)} ${this.$t('research.portfolioManager.live')}`)
            }
        })
        .finally(() => this.initStrategies())
      },
      stored(id) {        
        this.$http
        .patch(constants.urls.datawarehouse.result + '/' + id, { in_portfolio: false })
        .catch(error => {
            console.log(error)
            if (error.message === constants.strings.networkError) {
                helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', `${this.$t(this.warehouseKey)} ${this.$t('research.portfolioManager.live')}`)
            }
        })
        .finally(() => this.initStrategies())
      },
      stoped(id) {        
        this.$http
        .patch(constants.urls.datawarehouse.result + '/' + id, { live: false })
        .catch(error => {
            console.log(error)
            if (error.message === constants.strings.networkError) {
                helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', `${this.$t(this.warehouseKey)} ${this.$t('research.portfolioManager.live')}`)
            }
        })
        .finally(() => this.initStrategies())
      }
    },

    mounted() {
      this.initStrategies()
    }
  };
</script>
<style>
</style>