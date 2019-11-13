<template>
  <div class="wrapper">
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div style="margin-left: 40px;">
      
      <base-dropdown v-if="showCurrency" style="float: left; width: 15%" menu-classes="dropdown-black" title-classes="btn btn-secondary" :title="currencyTitle">
        <ul style="list-style-type: none;">
          <li v-for="currency in currencies">            
            <a class="dropdown-item" 
               @click="selectCurrency(currency)" 
               href="#" 
               :title="currency === $t('research.stockPickingLab.filters.all') ? $t('research.stockPickingLab.filters.clearSelection') : $t('research.stockPickingLab.filters.currency') + ' ' + $t('research.stockPickingLab.filters.equal')">
              <img v-if="currency !== $t('research.stockPickingLab.filters.all')" 
                   src="../../assets/img/not-equal.svg" 
                   @click="selectCurrencyNot(currency)" 
                   :title="$t('research.stockPickingLab.filters.currency') + ' ' + $t('research.stockPickingLab.filters.not') + ' ' + $t('research.stockPickingLab.filters.equal')" 
                   onMouseOver="this.style.backgroundColor = '#e14eca'"
                   onMouseOut="this.style.backgroundColor = 'transparent'"                   
                   style="width: 20px; margin-left: -10px;margin-right: 10px;">
              {{currency}}
            </a>
          </li>
        </ul>
      </base-dropdown>      

      <base-dropdown v-if="showExchange" style="float: left; width: 15%" menu-classes="dropdown-black" title-classes="btn btn-secondary" :title="exchangeTitle">
        <ul style="list-style-type: none;">
          <li v-for="exchange in exchanges">
            <a class="dropdown-item" 
               @click="selectExchange(exchange)" 
               href="#"
               :title="exchange === $t('research.stockPickingLab.filters.all') ? $t('research.stockPickingLab.filters.clearSelection') : $t('research.stockPickingLab.filters.exchange') + ' ' + $t('research.stockPickingLab.filters.equal')">
              <img v-if="exchange !== $t('research.stockPickingLab.filters.all')" 
                   src="../../assets/img/not-equal.svg" 
                   @click="selectExchangeNot(exchange)" 
                   :title="$t('research.stockPickingLab.filters.exchange') + ' ' + $t('research.stockPickingLab.filters.not') + ' ' + $t('research.stockPickingLab.filters.equal')" 
                   onMouseOver="this.style.backgroundColor = '#e14eca'"
                   onMouseOut="this.style.backgroundColor = 'transparent'"                   
                   style="width: 20px; margin-left: -10px;margin-right: 10px;">
               {{exchange}}
            </a>
          </li>
        </ul>
      </base-dropdown>

      <base-checkbox v-if="showIndex" style="float: left; width: 10%" v-model="index">{{$t('research.stockPickingLab.filters.index')}}</base-checkbox>

      <base-checkbox v-if="showDividend" style="float: left; width: 10%" v-model="dividend">{{$t('research.stockPickingLab.filters.dividend')}}</base-checkbox>      

      <base-dropdown v-if="showSector" style="float: left; width: 15%" menu-classes="dropdown-black" title-classes="btn btn-secondary" 
                     :title="sectorTitle">
        <ul style="list-style-type: none;">
          <li v-for="sector in sectors">
            <a class="dropdown-item" 
               @click="selectSector(sector)" 
               href="#"
               :title="sector === $t('research.stockPickingLab.filters.all') ? $t('research.stockPickingLab.filters.clearSelection') : $t('research.stockPickingLab.filters.sector') + ' ' + $t('research.stockPickingLab.filters.equal')">
              <img v-if="showSectorIcon(sector)" 
                   src="../../assets/img/not-equal.svg" 
                   @click="selectSectorNot(sector)" 
                   :title="$t('research.stockPickingLab.filters.sector') + ' ' + $t('research.stockPickingLab.filters.not') + ' ' + $t('research.stockPickingLab.filters.equal')" 
                   onMouseOver="this.style.backgroundColor = '#e14eca'"
                   onMouseOut="this.style.backgroundColor = 'transparent'"                   
                   style="width: 20px; margin-left: -10px;margin-right: 10px;">
               {{$t('research.stockPickingLab.filters.' + (sector === 'all' ? sector : 'sectors.' + sector))}}
            </a>
          </li>
        </ul>
      </base-dropdown>
    </div>

    <div style="clear:both;"></div>
    <div style="float: left;margin-top: 20px;">
      <nav v-if="nrOfPages > 1" aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li v-for="page in pages" 
              :class="[ { 'active': (!isNaN(Number(page)) && Number(page) === activePage), 'disabled': (page === '...') }, 'page-item' ]">
            <a class="page-link" @click="selectPage(page)" href="#">{{ page }}</a>
          </li>
        </ul>
      </nav>
      <DualRingLoader v-if="loading" :color="'#54f1d2'" style="width: 80px; height: 80px; position: absolute; top: 40%; left: 45%;" />
      <ul style="list-style-type: none;">
        <li v-for="stockData in stocksData">
          <stock-card :symbol="stockData.symbol"
                      :name="stockData.name"
                      :stats="stockData.statsData">
          </stock-card>
        </li>
      </ul>
      <nav v-if="nrOfPages > 1" aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li v-for="page in pages" 
              :class="[ { 'active': (!isNaN(Number(page)) && Number(page) === activePage), 'disabled': (page === '...') }, 'page-item' ]">
            <a class="page-link" @click="selectPage(page)" href="#">{{ page }}</a>
          </li>
        </ul>
      </nav>
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
        stocksData: [],
        loading: false,
        error: false,
        loadStocksDataTimer: null,
        activePage: 1,
        nrOfPages: 1,

        // filters
        selectedCurrency: null,
        selectedCurrencyNot: null,
        selectedExchange: null,
        selectedExchangeNot: null,
        selectedSector: null,      
        selectedSectorNot: null,      
        index: false,
        dividend: false,
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

      initData(resetPage=true) {
        if (resetPage) {
          this.activePage = 1
        }

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
          this.nrOfPages = Math.ceil(response.data.count / constants.maxRows)

          response.data.results.forEach(result => {
            this.stocksData.push({
              symbol: result.symbol,
              name: result.info ? result.info.shortName : null,
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

          if (error.message === constants.strings.networkError) {
            this.notifyAudio('connectionLost', 'danger', this.$t('notifications.beConnectionLost') + '(' + this.$t('sidebar.stockPickingLab') + ')')
          }
        })
        .finally(() => {
          this.loading = false
        });
      },

      getQueryData() {
        let data = {}

        data['page'] = this.activePage
        data['ordering'] = 'score_pcento'
        data['info__currency'] = this.selectedCurrency
        data['info__exchange'] = this.selectedExchange
        data['sector__name'] = this.selectedSector
        // data['index'] = this.index
        data['info__dividendDate__is_null'] = !this.dividend

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
        if (this.selectedCurrencyNot !== currency) {
          this.selectedCurrencyNot = null
        }

        this.initData()
      },
      selectCurrencyNot(currency) {
        this.selectedCurrencyNot = currency
      },

      selectExchange(exchange) {
        if (exchange === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedExchange = null
          localStorage.removeItem('exchange')
        } else {
          this.selectedExchange = exchange
          localStorage.setItem('exchange', exchange)
        }
        if (this.selectedExchangeNot !== exchange) {
          this.selectedExchangeNot = null
        }

        this.initData()
      },
      selectExchangeNot(exchange) {
        this.selectedExchangeNot = exchange
      },

      selectSector(sector) {
        if (sector === constants.strings.all) {
          this.selectedSector = null
          localStorage.removeItem('sector')
        } else {
          this.selectedSector = sector
          localStorage.setItem('sector', sector)
        }
        if (this.selectedSectorNot !== sector) {
          this.selectedSectorNot = null
        }

        this.initData()
      },
      selectSectorNot(sector) {
        this.selectedSectorNot = sector
      },
      showSectorIcon(sector) {
        return sector !== constants.strings.all
      },

      selectPage(page) {
        if (page === this.$t('paging.previous')) {
          this.activePage--
        } else if (page === this.$t('paging.next')) {
          this.activePage++
        } else {
          this.activePage = page
        }
      }
    }, 

    computed: {
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
      showSector() {
        if (!('sectorEnabled' in localStorage)) {
          localStorage.setItem('sectorEnabled', true)
        } 
        return JSON.parse(localStorage.sectorEnabled)
      },

      exchanges() {
        let exchanges = []
        if (this.selectedExchange) {
          exchanges = [this.$t('research.stockPickingLab.filters.all')]
        }
        return exchanges.concat(this.$t('research.stockPickingLab.filters.exchanges'))
      },
      exchangeTitle() {
        return this.selectedExchange 
                ? (this.selectedExchangeNot ? '!= ' : '') + this.selectedExchange
                : this.$t('research.stockPickingLab.filters.exchange')                
      },
      currencies() {
        let currencies = []
        if (this.selectedCurrency) {
          currencies = [this.$t('research.stockPickingLab.filters.all')]
        }
        return currencies.concat(this.$t('research.stockPickingLab.filters.currencies'))
      },
      currencyTitle() {
        return this.selectedCurrency 
                ? (this.selectedCurrencyNot ? '!= ' : '') + this.selectedCurrency
                : this.$t('research.stockPickingLab.filters.currency')                
      },
      sectors() {
        let sectors = []
        if (this.selectedSector) {
          sectors = [constants.strings.all]
        }
        return sectors.concat(Object.keys(this.$t('research.stockPickingLab.filters.sectors')))
      },
      sectorTitle() {
        return this.selectedSector 
                ? (this.selectedSectorNot ? '!= ' : '') + this.selectedSector
                : this.$t('research.stockPickingLab.filters.sector')                
      },

      pages() {
        let pages = []

        if (this.activePage !== 1) {
          pages = pages.concat([ this.$t('paging.previous') ])
        }
        pages = pages.concat([ 1 ])
        if (this.activePage > 2) {
          pages = pages.concat([ constants.strings.etc ])
        }
        if (this.activePage !== 1 && this.activePage !== this.nrOfPages) {
          pages = pages.concat([ this.activePage ])
        }
        if (this.activePage < this.nrOfPages - 1) {
          pages = pages.concat([ constants.strings.etc ])
        }      
        pages = pages.concat([ this.nrOfPages ])  
        if (this.activePage !== this.nrOfPages) {
          pages = pages.concat([ this.$t('paging.next') ])
        }

        return pages
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
        this.initData()
      },
      activePage(val) {
        this.initData(false)
      }
    }
  };
</script>
<style>
</style>