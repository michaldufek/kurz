<template>
  <div>
    <ul>
      <li v-for="stockData in stocksData" style="list-style-type: none;">
        <stock-card :title="stockData.title"
                    :stats="stockData.statsData"
                    :chartData="stockData.chartData"                    
                    :errored="stockData.errored"
                    :loading="stockData.loading">
        </stock-card>
      </li>
    </ul>
  </div> 
</template>
<script>
  import StockCard from '@/custom/components/Cards/StockCard.vue';
  import axios from '@/../node_modules/axios';

  export default {
    components: {
      StockCard        
    },
    data() {
      return { 
        stocksData: []   
      }
    },
    methods: {        
      initStocksData() {
      }
    },    
    mounted() {
      this.initStocksData();
    }
  };
</script>
<style>
</style>