<template>
  <div>
     <div>      
      <div style="margin-left: 40px;">
       
        <base-dropdown style="float: left; width: 15%" title-classes="btn btn-secondary" :title="(!selectedCurrency) ? $t('research.stockPickingLab.filters.currency') : selectedCurrency">
          <ul>
            <li v-for="currency in getCurrencies">
              <a class="dropdown-item" @click="selectCurrency(currency)" href="#">{{currency}}</a>
            </li>
          </ul>
        </base-dropdown>
  
        <base-dropdown style="float: left; width: 15%" title-classes="btn btn-secondary" :title="(!selectedExchange) ? $t('research.stockPickingLab.filters.exchange') : selectedExchange">
          <ul>
            <li v-for="exchange in getExchanges">
              <a class="dropdown-item" @click="selectExchange(exchange)" href="#">{{exchange}}</a>
            </li>
          </ul>
        </base-dropdown>
  
        <base-checkbox style="float: left; width: 10%" v-model="isIndex">{{$t('research.stockPickingLab.filters.index')}}</base-checkbox>
  
        <base-checkbox style="float: left; width: 10%" v-model="isDividend">{{$t('research.stockPickingLab.filters.dividend')}}</base-checkbox>
  
        <base-dropdown style="float: left; width: 15%" title-classes="btn btn-secondary" :title="(!selectedRiskProfile) ? $t('research.stockPickingLab.filters.riskProfile') : selectedRiskProfile">
          <ul>
            <li v-for="riskProfile in getRiskProfiles">
              <!-- <div class="dropdown-divider"></div> / to-do: use this for dividing All option -->
              <a class="dropdown-item" @click="selectRiskProfile(riskProfile)" href="#">{{riskProfile}}</a>
            </li>
          </ul>
        </base-dropdown>
  
        <base-dropdown style="float: left; width: 15%" title-classes="btn btn-secondary" :title="$t('research.stockPickingLab.filters.sector')">
          <!-- <ul>
            <li v-for="currency in $t('research.stockPickingLab.filters.exchanges')">
              <a class="dropdown-item" href="#">{{exchange}}</a>
            </li>
          </ul> -->
        </base-dropdown>
      </div>
    </div> 
    <div style="float: left;margin-top: 100px;">
      <ul>
        <li v-for="stockData in filteredStocksData" style="list-style-type: none;">
          <stock-card :title="stockData.title"
                      :stats="stockData.statsData"
                      :chartData="stockData.chartData"                    
                      :errored="stockData.errored"
                      :loading="stockData.loading">
          </stock-card>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { BaseRadio } from "@/components";
  import StockCard from '@/custom/components/Cards/StockCard.vue';
  import axios from '@/../node_modules/axios';

  export default {
    name: "filters",
    components: {
      BaseRadio,
      StockCard
    },
    data() {
      return { 
        stocksData: [],
        selectedCurrency: null,
        selectedExchange: null,
        selectedRiskProfile: null,
        isDividend: false,
        isIndex: false
      }
    },
    methods: {        
      initStocksData() {
        axios
        .get("https://app1.objectively.info/sp/Ticker")
        .then(response => {
          response.data.results.forEach(result => {
            this.stocksData.push({
              title: result.symbol + " (" + result.info.shortName + ")",
              filterData: {
                currency: result.info.currency,
                exchange: result.info.exchange,
                hasDividend: result.info.dividendDate !== null
              },              
              statsData: {
                cagr: result.compute.cagr,
                stdDev: result.compute.stddev,
                sharpeRatio: result.compute.sharpe_ratio,
                recoveryDDtime: result.compute.recovery_dd_time,
                maxDD: result.compute.max_dd
              },
              chartData: {
                datasets: [{
                  data: null //response.data.equity
                }],
                labels: null //response.data.time
              },
              loading: false
            });
          });          
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          // this.stocksData = data;
        });
      }, // to-do: add comments
      selectCurrency(currency) {
        this.selectedCurrency = currency;
        if (currency === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedCurrency = null          
        }
      },
      selectExchange(exchange) {
        this.selectedExchange = exchange;
        if (exchange === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedExchange = null          
        }
      },
      selectRiskProfile(riskProfile) {
        this.selectedRiskProfile = riskProfile;
        if (riskProfile === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedRiskProfile = null          
        }
      }
    },    
    computed: {
      filteredStocksData() {
        return this.stocksData.filter(stockData => {
          if (this.selectedCurrency && stockData.filterData.currency !== this.selectedCurrency) {
            return false
          }
          if (this.selectedExchange && stockData.filterData.exchange !== this.selectedExchange) {
            return false
          }
          if (this.isDividend && !stockData.filterData.hasDividend) {
            return false
          }

          return true
        })
      },
      getExchanges() {
        return this.selectedExchange 
               ? [this.$t('research.stockPickingLab.filters.all')].concat(this.$t('research.stockPickingLab.filters.exchanges')) 
               : this.$t('research.stockPickingLab.filters.exchanges')
      },
      getCurrencies() {
        return this.selectedCurrency 
               ? [this.$t('research.stockPickingLab.filters.all')].concat(this.$t('research.stockPickingLab.filters.currencies'))
               : this.$t('research.stockPickingLab.filters.currencies')
      },
      getRiskProfiles() {
        return this.selectedRiskProfile
               ? [this.$t('research.stockPickingLab.filters.all')].concat(this.$t('research.stockPickingLab.filters.riskProfiles'))
               : this.$t('research.stockPickingLab.filters.riskProfiles')
      }
    },
    mounted() {
      this.initStocksData();
    }
  };
</script>
<style>
</style>