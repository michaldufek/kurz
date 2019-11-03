<template>
  <div>
    <portfolio-card :title="$t('research.portfolioManager.designedPortfolio')"
                    :strategies="[Object.entries(constants.urls.stats)[0]]">
    </portfolio-card>
    <portfolio-card :title="$t('research.portfolioManager.livePortfolio')"
                    :strategies="[Object.entries(constants.urls.stats)[1]]"
                    :enableLive="false">
    </portfolio-card>
    <portfolio-card :title="$t('research.portfolioManager.optimalPortfolio')"
                    :strategies="[ Object.entries(constants.urls.stats)[0], Object.entries(constants.urls.stats)[1] ]"
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
    }
  };
</script>
<style>
</style>