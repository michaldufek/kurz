<template>
  <div class="wrapper">
     <div>      
      <div style="margin-left: 40px;">
       
        <base-dropdown v-if="showCurrency" style="float: left; width: 15%" menu-classes="dropdown-black" title-classes="btn btn-secondary" :title="(!selectedCurrency) ? $t('research.stockPickingLab.filters.currency') : selectedCurrency">
          <ul style="list-style-type: none;">
            <li v-for="currency in getCurrencies">
              <a class="dropdown-item" @click="selectCurrency(currency)" href="#">{{currency}}</a>
            </li>
          </ul>
        </base-dropdown>
  
        <base-dropdown v-if="showExchange" style="float: left; width: 15%" menu-classes="dropdown-black" title-classes="btn btn-secondary" :title="(!selectedExchange) ? $t('research.stockPickingLab.filters.exchange') : selectedExchange">
          <ul style="list-style-type: none;">
            <li v-for="exchange in getExchanges">
              <a class="dropdown-item" @click="selectExchange(exchange)" href="#">{{exchange}}</a>
            </li>
          </ul>
        </base-dropdown>
  
        <base-checkbox v-if="showIndex" style="float: left; width: 10%" v-model="index">{{$t('research.stockPickingLab.filters.index')}}</base-checkbox>
  
        <base-checkbox v-if="showDividend" style="float: left; width: 10%" v-model="dividend">{{$t('research.stockPickingLab.filters.dividend')}}</base-checkbox>
  
        <base-dropdown v-if="showRiskProfile" style="float: left; width: 15%" menu-classes="dropdown-black" title-classes="btn btn-secondary" :title="(!selectedRiskProfile) ? $t('research.stockPickingLab.filters.riskProfile') : selectedRiskProfile">
          <ul style="list-style-type: none;">
            <li v-for="riskProfile in getRiskProfiles">
              <!-- <div class="dropdown-divider"></div> / to-do: use this for dividing All option -->
              <a class="dropdown-item" @click="selectRiskProfile(riskProfile)" href="#">{{riskProfile}}</a>
            </li>
          </ul>
        </base-dropdown>
  
        <base-dropdown v-if="showSector" style="float: left; width: 15%" menu-classes="dropdown-black" title-classes="btn btn-secondary" :title="(!selectedSector) ? $t('research.stockPickingLab.filters.sector') : selectedSector">
          <ul style="list-style-type: none;">
            <li v-for="sector in getSectors">
              <a class="dropdown-item" @click="selectSector(sector)" href="#">{{sector}}</a>
            </li>
          </ul>
        </base-dropdown>
      </div>
    </div> 

    <div style="float: left;margin-top: 100px;">
      <ul style="list-style-type: none;">
        <li v-for="stockData in filteredStocksData">
          <stock-card :title="stockData.title"
                      :stats="stockData.statsData"
                      :errored="stockData.errored"
                      :loading="stockData.loading"
                      :live="stockData.live"
                      :updateTs="stockData.updateTs">
                      <!-- to-do: :chartData="stockData.chartData"                     -->
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
        selectedCurrency: null,
        selectedExchange: null,
        selectedRiskProfile: null,  
        selectedSector: null,      
        index: false,
        dividend: false,

        stocksData: []
      }
    },
    methods: {
      initSelectors() {
        if (this.selectedCurrency && !('currency' in localStorage)) {
          localStorage.setItem('currency', this.selectedCurrency)
        } else {
          this.selectedCurrency = localStorage.currency
        }

        if (this.selectedExchange && !('exchange' in localStorage)) {
          localStorage.setItem('exchange', this.selectedExchange)
        } else {
          this.selectedExchange = localStorage.exchange
        }

        if (this.selectedRiskProfile && !('riskProfile' in localStorage)) {
          localStorage.setItem('riskProfile', this.selectedRiskProfile)
        } else {
          this.selectedRiskProfile = localStorage.riskProfile
        }

        if (this.selectedSector && !('sector' in localStorage)) {
          localStorage.setItem('sector', this.selectedSector)
        } else {
          this.selectedSector = localStorage.sector
        }

        if (!('index' in localStorage)) {
          localStorage.setItem('index', this.index)
        } else {
          this.index = JSON.parse(localStorage.index)
        }

        if (!('dividend' in localStorage)) {
          localStorage.setItem('dividend', this.dividend)
        } else {
          this.dividend = JSON.parse(localStorage.dividend)
        }        
      },

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
                  data: [] //response.data.equity
                }],
                labels: [] //response.data.time
              },
              loading: false,
              live: true,
              updateTs: Date.now()
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
        if (currency === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedCurrency = null
          localStorage.removeItem('currency')
        } else {
          this.selectedCurrency = currency
          localStorage.setItem('currency', currency)
        }
      },
      selectExchange(exchange) {
        if (exchange === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedExchange = null
          localStorage.removeItem('exchange')
        } else {
          this.selectedExchange = exchange
          localStorage.setItem('exchange', exchange)
        }
      },
      selectRiskProfile(riskProfile) {
        if (riskProfile === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedRiskProfile = null
          localStorage.removeItem('riskProfile')
        } else {
          this.selectedRiskProfile = riskProfile
          localStorage.setItem('riskProfile', riskProfile)
        }
      },
      selectSector(sector) {
        if (sector === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedSector = null
          localStorage.removeItem('sector')
        } else {
          this.selectedSector = sector
          localStorage.setItem('sector', sector)
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
          // if (this.selectedSector && stockData.filterData.sector !== this.selectedSector) {
          //   return false
          // }

          return true
        })
      },

      showCurrency() {
        if (!('currencyEnabled' in localStorage)) {
          localStorage.setItem('currencyEnabled', true)
        } 
        return JSON.parse(localStorage.currencyEnabled)
      },
      showExchange() {
        if (!('exchangeEnabled' in localStorage)) {
          localStorage.setItem('exchangeEnabled', true)
        } 
        return JSON.parse(localStorage.exchangeEnabled)
      },
      showIndex() {
        if (!('indexEnabled' in localStorage)) {
          localStorage.setItem('indexEnabled', true)
        } 
        return JSON.parse(localStorage.indexEnabled)
      },
      showDividend() {
        if (!('dividendEnabled' in localStorage)) {
          localStorage.setItem('dividendEnabled', true)
        } 
        return JSON.parse(localStorage.dividendEnabled)
      },
      showRiskProfile() {
        if (!('riskProfileEnabled' in localStorage)) {
          localStorage.setItem('riskProfileEnabled', true)
        } 
        return JSON.parse(localStorage.riskProfileEnabled)
      },
      showSector() {
        if (!('sectorEnabled' in localStorage)) {
          localStorage.setItem('sectorEnabled', true)
        } 
        return JSON.parse(localStorage.sectorEnabled)
      },

      getExchanges() {
        let exchanges = []
        if (this.selectedExchange) {
          exchanges = [this.$t('research.stockPickingLab.filters.all')]
        }
        return exchanges.concat(this.$t('research.stockPickingLab.filters.exchanges'))
      },
      getCurrencies() {
        let currencies = []
        if (this.selectedCurrency) {
          currencies = [this.$t('research.stockPickingLab.filters.all')]
        }
        return currencies.concat(this.$t('research.stockPickingLab.filters.currencies'))
      },
      getRiskProfiles() {
        let riskProfiles = []
        if (this.selectedRiskProfile) {
          riskProfiles = [this.$t('research.stockPickingLab.filters.all')]
        }
        return riskProfiles.concat(this.$t('research.stockPickingLab.filters.riskProfiles'))
      },
      getSectors() {
        let sectors = []
        if (this.selectedSector) {
          sectors = [this.$t('research.stockPickingLab.filters.all')]
        }
        return sectors.concat(this.$t('research.stockPickingLab.filters.sectors'))
      }
    },
    mounted() {
      this.initSelectors()
      this.initStocksData();
    },
    watch: {
      index(val) {
        localStorage.index = val
      },
      dividend(val) {
        localStorage.dividend = val
      }
    }
  };
</script>
<style>
</style>