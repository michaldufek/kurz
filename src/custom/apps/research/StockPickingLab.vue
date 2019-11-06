<template>
  <div class="wrapper">
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
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

    <div style="float: left;margin-top: 100px;">
      <DualRingLoader v-if="loading" :color="'#54f1d2'" style="width: 80px; height: 80px; position: absolute; top: 40%; left: 45%;" />
      <ul style="list-style-type: none;">
        <li v-for="stockData in filteredStocksData">
          <stock-card :symbol="stockData.symbol"
                      :name="stockData.name"
                      :stats="stockData.statsData">
          </stock-card>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { BaseRadio } from "@/components";
  import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';
  import StockCard from '@/custom/components/Cards/StockCard.vue';
  
  import axios from '@/../node_modules/axios';
  import constants from '@/custom/assets/js/constants';
  

  export default {
    name: "filters",
    components: {
      BaseRadio,
      DualRingLoader,
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

        stocksData: [],
        loading: false,
        error: false,
        loadStocksDataTimer: null
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

      initData() {
        this.loadStocksData();
        
        if (this.loadStocksDataTimer) {
          clearInterval(this.loadStocksDataTimer);
        }
        
        this.loadStocksDataTimer = setInterval(() => { 
          this.loadStocksData();
        }, constants.dataReloadInterval );
      },

      loadStocksData() {
        this.stocksData = []
        this.loading = true
        this.error = false

        axios
        .get(constants.urls.ticker.base + "?" + this.encodeQueryData(this.getQueryData()))
        .then(response => {
          response.data.results.forEach(result => {
            this.stocksData.push({
              symbol: result.symbol,
              name: result.info ? result.info.shortName : null,
              filterData: {
                hasDividend: result.info ? result.info.dividendDate !== null : false
              },              
              statsData: [
                result.compute ? result.compute.cagr : null,
                result.compute ? result.compute.sharpe_ratio : null,
                result.compute ? result.compute.stddev : null,                
                result.compute ? result.compute.recovery_dd_time : null,
                result.compute ? result.compute.max_dd : null
              ]
            });
          });          
        })
        .catch(error => {
          console.log(error);
          this.error = true
          this.notifyAudio('connectionLost', 'danger', this.$t('notifications.connectionLost') + '(' + this.$t('sidebar.stockPickingLab') + ')')
        })
        .finally(() => {
          this.loading = false
        });
      },

      getQueryData() {
        let data = {}

        data['info__currency'] = this.selectedCurrency
        data['info__exchange'] = this.selectedExchange
        // data['riskProfile'] = this.selectedRiskProfile
        data['sector__name'] = this.selectedSector
        // data['index'] = this.index
        // data['info__currency'] = dividend

        return data
      },

      encodeQueryData(data) {
        const ret = [];
        for (let d in data) {
          if (data[d]) {
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
          }
        }
        return ret.join('&');
      },

      notifyAudio(audioEl, type, msg) {
        document.getElementById(audioEl).play();

        this.$notify({
          type: type, 
          message: msg
        })
      },

      // methods for dropdowns selection
      selectCurrency(currency) {
        if (currency === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedCurrency = null
          localStorage.removeItem('currency')
        } else {
          this.selectedCurrency = currency
          localStorage.setItem('currency', currency)
        }

        this.initData()
      },
      selectExchange(exchange) {
        if (exchange === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedExchange = null
          localStorage.removeItem('exchange')
        } else {
          this.selectedExchange = exchange
          localStorage.setItem('exchange', exchange)
        }

        this.initData()
      },
      selectRiskProfile(riskProfile) {
        if (riskProfile === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedRiskProfile = null
          localStorage.removeItem('riskProfile')
        } else {
          this.selectedRiskProfile = riskProfile
          localStorage.setItem('riskProfile', riskProfile)
        }

        // this.initData()
      },
      selectSector(sector) {
        if (sector === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedSector = null
          localStorage.removeItem('sector')
        } else {
          this.selectedSector = sector
          localStorage.setItem('sector', sector)
        }

        this.initData()
      }
    }, 

    computed: {
      filteredStocksData() {
        return this.stocksData.filter(stockData => {
          if (this.isDividend && !stockData.filterData.hasDividend) {
            return false
          }

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
      this.initData();
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