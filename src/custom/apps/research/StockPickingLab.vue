<template>
  <div class="wrapper">
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div style="margin-left: 40px;">

      <p style="float:left; margin-right: 10px; padding-top: 10px">{{$t('research.stockPickingLab.filters.symbolName')}}</p>
      <base-input alternative
                  type="text"
                  style="float: left; width: 6%; margin-right: 20px"
                  v-model="symbolSearch"
                  :placeholder="$t('research.stockPickingLab.filters.text')"
                  @keyup.enter="symbolSearchEnter">
      </base-input>
      
      <img src="../../assets/img/not-equal.svg" 
           @click="selectCurrencyNot" 
           :title="$t('research.stockPickingLab.filters.currency') + ' ' + $t('research.stockPickingLab.filters.not') + ' ' + $t('research.stockPickingLab.filters.equal')" 
           :class="[ { 'notEqualSelected': selectedCurrencyNot }, 'notEqual' ]"
           onMouseOver="this.classList.add('notEqualOver')"
           onMouseOut="this.classList.remove('notEqualOver')">
      <base-dropdown v-if="showCurrency" 
                     class="dd" 
                     menu-classes="dropdown-black" 
                     title-classes="btn btn-secondary" 
                     :title="currenciesTitle">
        <ul style="list-style-type: none;">
          <li v-for="currency in currencies">            
            <a class="dropdown-item" 
               @click="selectCurrency(currency)" 
               href="#" 
               :title="currencyTitle(currency)">
              {{currency}}
            </a>
          </li>
        </ul>
      </base-dropdown>      

      <img src="../../assets/img/not-equal.svg" 
           @click="selectExchangeNot" 
           :title="$t('research.stockPickingLab.filters.exchange') + ' ' + $t('research.stockPickingLab.filters.not') + ' ' + $t('research.stockPickingLab.filters.equal')" 
           :class="[ { 'notEqualSelected': selectedExchangeNot }, 'notEqual' ]"
           onMouseOver="this.classList.add('notEqualOver')"
           onMouseOut="this.classList.remove('notEqualOver')">
      <base-dropdown v-if="showExchange" 
                     class="dd" 
                     menu-classes="dropdown-black" 
                     title-classes="btn btn-secondary" 
                     :title="exchangesTitle">
        <ul style="list-style-type: none;">
          <li v-for="exchange in exchanges">
            <a class="dropdown-item" 
               @click="selectExchange(exchange)" 
               href="#"
               :title="exchangeTitle(exchange)">
               {{exchange}}
            </a>
          </li>
        </ul>
      </base-dropdown>

      <base-checkbox v-if="showIndex" style="float: left; width: 10%" v-model="index">{{$t('research.stockPickingLab.filters.index')}}</base-checkbox>

      <base-checkbox v-if="showDividend" style="float: left; width: 10%" v-model="dividend">{{$t('research.stockPickingLab.filters.dividend')}}</base-checkbox>      

      <img src="../../assets/img/not-equal.svg" 
           @click="selectSectorNot" 
           :title="$t('research.stockPickingLab.filters.sector') + ' ' + $t('research.stockPickingLab.filters.not') + ' ' + $t('research.stockPickingLab.filters.equal')" 
           :class="[ { 'notEqualSelected': selectedSectorNot }, 'notEqual' ]"
           onMouseOver="this.classList.add('notEqualOver')"
           onMouseOut="this.classList.remove('notEqualOver')">
      <base-dropdown v-if="showSector" 
                     class="dd" 
                     menu-classes="dropdown-black" 
                     title-classes="btn btn-secondary" 
                     :title="sectorsTitle">
        <ul style="list-style-type: none;">
          <li v-for="sector in sectors">
            <a class="dropdown-item" 
               @click="selectSector(sector)" 
               href="#"
               :title="sectorTitle(sector)">
               {{$t('research.stockPickingLab.filters.' + (sector === 'all' ? sector : 'sectors.' + sector))}}
            </a>
          </li>
        </ul>
      </base-dropdown>
      
      <p style="float:left; margin-right: 10px; padding-top: 10px">{{$t('research.stockPickingLab.filters.marketPrice')}}</p>
      <base-input alternative
                  type="text"
                  style="float: left; width: 6%; margin-right: 10px"
                  v-model="marketPriceGte"
                  :placeholder="$t('research.stockPickingLab.filters.number')"
                  @keyup.enter="marketPriceGteEnter">
      </base-input>
      <p style="float:left; margin-right: 10px; padding-top: 10px">{{$t('research.stockPickingLab.filters.and')}}</p>
      <base-input alternative
                  type="text"
                  style="float: left; width: 6%"
                  v-model="marketPriceLte"
                  :placeholder="$t('research.stockPickingLab.filters.number')"
                  @keyup.enter="marketPriceLteEnter">
      </base-input>

      <i class="tim-icons icon-shape-star"
         style="float: right; margin-top: 10px; border-radius: 1rem;"
         @click="watchlistDeActivate" 
         :title="watchlistActive ? $t('research.stockPickingLab.filters.watchlistDeactivate') : $t('research.stockPickingLab.filters.watchlistActivate')" 
         :class="{ 'watchlistActive': watchlistActive }"
         onMouseOver="this.classList.add('watchlistOver')"
         onMouseOut="this.classList.remove('watchlistOver')">
      </i>
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
                      :rank="stockData.rank"
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
        symbolSearch: null,
        selectedCurrency: null,
        selectedCurrencyNot: false,
        selectedExchange: null,
        selectedExchangeNot: false,
        selectedSector: null,      
        selectedSectorNot: false,      
        index: false,
        dividend: false,
        marketPriceGte: null,
        marketPriceLte: null,
        watchlistActive: false
      }
    },

    methods: {
      // initializing
      initSelectors() {
        if (this.selectedCurrency && !('currency' in localStorage)) {
          localStorage.setItem('currency', this.selectedCurrency)
        } else {
          this.selectedCurrency = localStorage.currency
        }
        if (!('currencyNot' in localStorage)) {
          localStorage.setItem('currencyNot', this.selectedCurrencyNot)
        }
        this.selectedCurrencyNot = JSON.parse(localStorage.currencyNot)

        if (this.selectedExchange && !('exchange' in localStorage)) {
          localStorage.setItem('exchange', this.selectedExchange)
        } else {
          this.selectedExchange = localStorage.exchange
        }
        if (!('exchangeNot' in localStorage)) {
          localStorage.setItem('exchangeNot', this.selectedExchangeNot)
        }
        this.selectedExchangeNot = JSON.parse(localStorage.exchangeNot)

        if (this.selectedSector && !('sector' in localStorage)) {
          localStorage.setItem('sector', this.selectedSector)
        } else {
          this.selectedSector = localStorage.sector
        }
        if (!('sectorNot' in localStorage)) {
          localStorage.setItem('sectorNot', this.selectedSectorNot)
        }
        this.selectedSectorNot = JSON.parse(localStorage.sectorNot)

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

        if ('watchlistActive' in localStorage) {
          this.watchlistActive = JSON.parse(localStorage.watchlistActive)
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

      // data loading
      loadStocksData() {
        this.stocksData = []
        this.loading = true
        this.error = false

        axios
        .get(constants.urls.ticker.base + "?" + this.encodeQueryData(this.getQueryData()))
        .then(response => {
          this.nrOfPages = Math.ceil(response.data.count / constants.maxRows)

          let i = ((this.activePage - 1) * constants.maxRows) + 1
          response.data.results.forEach(result => {
            this.stocksData.push({
              symbol: result.symbol,              
              name: result.info && result.info.shortName ? result.info.shortName : null,
              rank: i++,
              statsData: [
                result.compute ? Number(result.compute.cagr) : null,
                result.compute ? Number(result.compute.sharpe_ratio) : null,
                result.compute ? Number(result.compute.stddev) : null,                
                result.compute ? Number(result.compute.recovery_dd_time) : null,
                result.compute ? Number(result.compute.max_dd) : null,
                result.compute ? Number(result.compute.scorep) * 100 + ' %' : null
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

        if (this.watchlistActive && 'watchlist' in localStorage) {
          let watchlist = JSON.parse(localStorage.watchlist)
          data['symbol__in'] = watchlist.join(',')
        }

        data['page'] = this.activePage
        data['ordering'] = 'score_pcento'
        // data['index'] = this.index
        data['search'] = this.symbolSearch
        data['info__dividendDate__is_null'] = !this.dividend
        data['info__regularMarketPrice__gte'] = this.marketPriceGte
        data['info__regularMarketPrice__lte'] = this.marketPriceLte

        if (this.selectedCurrencyNot) {
          data['info__currency__exclude'] = this.selectedCurrency
        } else {
          data['info__currency'] = this.selectedCurrency
        }
        if (this.selectedExchangeNot) {
          data['info__exchange__exclude'] = this.selectedExchange
        } else {
          data['info__exchange'] = this.selectedExchange
        }
        if (this.selectedSectorNot) {
          data['sector__name__exclude'] = this.selectedSector
        } else {
          data['sector__name'] = this.selectedSector
        }
        
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

      // dropdowns selections
      selectCurrency(currency) {
        if (currency === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedCurrency = null
          localStorage.removeItem('currency')

          this.selectedCurrencyNot = false
          localStorage.setItem('currencyNot', this.selectedCurrencyNot)
        } else {
          this.selectedCurrency = currency
          localStorage.setItem('currency', currency)
        }
        if (this.selectedCurrencyNot !== currency) {
          this.selectedCurrencyNot = null
        }

        this.initData()
      },
      selectCurrencyNot() {
        this.selectedCurrencyNot = !this.selectedCurrencyNot
        localStorage.setItem('currencyNot', this.selectedCurrencyNot)

        if (this.selectedCurrency) {
          this.initData()
        }
      },
      currencyTitle(currency) {
        return currency === this.$t('research.stockPickingLab.filters.all') 
               ? this.$t('research.stockPickingLab.filters.clearSelection') 
               : this.$t('research.stockPickingLab.filters.currency') 
                  + (this.selectedCurrencyNot ? ' ' + this.$t('research.stockPickingLab.filters.not') : '') 
                  + ' ' + this.$t('research.stockPickingLab.filters.equal')
      },      

      selectExchange(exchange) {
        if (exchange === this.$t('research.stockPickingLab.filters.all')) {
          this.selectedExchange = null
          localStorage.removeItem('exchange')

          this.selectedExchangeNot = false          
          localStorage.setItem('exchangeNot', this.selectedExchangeNot)
        } else {
          this.selectedExchange = exchange
          localStorage.setItem('exchange', exchange)
        }
        if (this.selectedExchangeNot !== exchange) {
          this.selectedExchangeNot = null
        }

        this.initData()
      },
      selectExchangeNot() {
        this.selectedExchangeNot = !this.selectedExchangeNot
        localStorage.setItem('exchangeNot', this.selectedExchangeNot)

        if (this.selectedExchange) {
          this.initData()
        }
      },
      exchangeTitle(exchange) {
        return exchange === this.$t('research.stockPickingLab.filters.all') 
               ? this.$t('research.stockPickingLab.filters.clearSelection') 
               : this.$t('research.stockPickingLab.filters.exchange') 
                  + (this.selectedExchangeNot ? ' ' + this.$t('research.stockPickingLab.filters.not') : '') 
                  + ' ' + this.$t('research.stockPickingLab.filters.equal')
      },      

      selectSector(sector) {
        if (sector === constants.strings.all) {
          this.selectedSector = null
          localStorage.removeItem('sector')

          this.selectedSectorNot = false
          localStorage.setItem('sectorNot', this.selectedSectorNot)          
        } else {
          this.selectedSector = sector
          localStorage.setItem('sector', sector)
        }
        if (this.selectedSectorNot !== sector) {
          this.selectedSectorNot = null
        }

        this.initData()
      },
      selectSectorNot() {
        this.selectedSectorNot = !this.selectedSectorNot
        localStorage.setItem('sectorNot', this.selectedSectorNot)

        if (this.selectedSector) {
          this.initData()
        }
      },
      sectorTitle(sector) {
        return sector === constants.strings.all
               ? this.$t('research.stockPickingLab.filters.clearSelection') 
               : this.$t('research.stockPickingLab.filters.sector') 
                  + (this.selectedSectorNot ? ' ' + this.$t('research.stockPickingLab.filters.not') : '') 
                  + ' ' + this.$t('research.stockPickingLab.filters.equal')
      },    

      symbolSearchEnter() {
        this.initData()
      },
      
      marketPriceGteEnter() {
        if (this.marketPriceLte && this.marketPriceGte > this.marketPriceLte) {
          this.marketPriceGte = this.marketPriceLte
        }

        this.initData()
      },
      marketPriceLteEnter() {
        if (this.marketPriceGte && this.marketPriceLte < this.marketPriceGte) {
          this.marketPriceLte = this.marketPriceGte
        }   
        
        this.initData()
      },

      watchlistDeActivate() {
        this.watchlistActive = !this.watchlistActive
        this.initData()
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

      currencies() {
        let currencies = []
        if (this.selectedCurrency) {
          currencies = [this.$t('research.stockPickingLab.filters.all')]
        }
        return currencies.concat(this.$t('research.stockPickingLab.filters.currencies'))
      },
      currenciesTitle() {
        return this.selectedCurrency ? this.selectedCurrency : this.$t('research.stockPickingLab.filters.currency')                
      },
      exchanges() {
        let exchanges = []
        if (this.selectedExchange) {
          exchanges = [this.$t('research.stockPickingLab.filters.all')]
        }
        return exchanges.concat(this.$t('research.stockPickingLab.filters.exchanges'))
      },
      exchangesTitle() {
        return this.selectedExchange ? this.selectedExchange : this.$t('research.stockPickingLab.filters.exchange')                
      },
      riskProfileTitle() {
        return this.selectedRiskProfile 
                ? (this.selectedRiskProfileNot ? '!= ' : '') + this.selectedRiskProfile
                : this.$t('research.stockPickingLab.filters.riskProfile') 
               
      },
      sectors() {
        let sectors = []
        if (this.selectedSector) {
          sectors = [constants.strings.all]
        }
        return sectors.concat(Object.keys(this.$t('research.stockPickingLab.filters.sectors')))
      },
      sectorsTitle() {
        return this.selectedSector ? this.selectedSector : this.$t('research.stockPickingLab.filters.sector')                
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
      },
      watchlistActive(val) {
        localStorage.watchlistActive = val        
      }
    }
  };
</script>
<style>
img.notEqual {
  float: left;   
  width: 20px; 
  margin-right: 10px;
  margin-top: 10px;
  border-radius: 0.6rem;
  background: #344675
}

img.notEqualSelected {
  background: #e14eca;
}

img.notEqualOver {
  background: red;
}

.dd {
  float: left;
  width: 10%
}

i.watchlistActive {
  background: #e14eca;
}

i.watchlistOver {
  background: red;
}
</style>