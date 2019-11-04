<template>
  <div>
    <portfolio-card :title="$t('research.portfolioManager.designedPortfolio')"
                    :strategies="designedStrategies">
    </portfolio-card>
    <portfolio-card :title="$t('research.portfolioManager.livePortfolio')"
                    :strategies="liveStrategies"
                    :enableLive="false">
    </portfolio-card>
    <portfolio-card :title="$t('research.portfolioManager.optimalPortfolio')"
                    :strategies="optimalStrategies"
                    :enableLive="false"
                    :enableStore="false">
    </portfolio-card>
    <!-- to-do: stats as a source from Ware house? -->
  </div>
</template>
<script>
  import PortfolioCard from "@/custom/components/Cards/PortfolioCard.vue";
  import constants from '@/custom/assets/js/constants';

  export default {
    components: {
      PortfolioCard
    },

    computed: {
      designedStrategies() {
        return [Object.entries(constants.urls.chart)[0]]
      },
      liveStrategies() {
        return [Object.entries(constants.urls.chart)[1]]
      },
      optimalStrategies() {
        return Object.entries(constants.urls.chart)
      }
    }
  };
</script>
<style>
</style>