<template>
  <div>
    <ul style="list-style-type: none;">
      <li v-for="strategyData in strategiesData">
        <strategy-card :title="strategyData.title"
                       :apiUrl="strategyData.apiUrl">
        </strategy-card>
      </li>
    </ul>
  </div> 
</template>
<script>
  import StrategyCard from '@/custom/components/Cards/StrategyCard.vue';
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
      initStrategies() { 
        for (const [key, value] of Object.entries(constants.urls.chart)) {
          this.strategiesData.push({
            title: key,
            apiUrl: value
          })
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