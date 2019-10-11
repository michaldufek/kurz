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
        this.stocksData = [
          {
            title: "AAPL (Apple Inc.)",
            statsData: {
              cagr: 4.3,
              stdDev: 7.64,
              sharpeRatio: 5,
              recoveryDDtime: 5345,
              maxDD: 45
            },
            chartData: null,
            loading: false
          }
        ];
      }
    },    
    mounted() {
      this.initStocksData();
    }
  };
</script>
<style>
</style>