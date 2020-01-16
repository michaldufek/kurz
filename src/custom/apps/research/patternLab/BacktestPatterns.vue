<template>
  <div class="row">

    <div class="col-lg-2 col-md-12 container">
      <assets-patterns-picker :title="$t('research.patternLab.backtestPatterns.title')"
                              :btnText="$t('research.patternLab.backtestPatterns.addPattern')" 
                              @btnClicked="addPattern" 
                              @timeframeChanged="timeframeChanged" />
    </div>

    <!-- strategy settings  -->
    <div class="col-lg-2 col-md-12">
      <!-- initial capital -->
      <p class="label" style="margin-left: 10px">{{ $t('research.patternLab.backtestPatterns.initialCapital') }}</p>
      <base-input alternative
                  type="text"
                  class="input"
                  style="margin-left: -5px; width: 56%"
                  v-model="strategy.initialCapital"
                  :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
      </base-input>

      <!-- entry rules -->
      <card>
        <h4 slot="header" class="card-title" style="float: left">{{ $t('research.patternLab.entry') + ' ' + $t('research.patternLab.rules') }}</h4>

        <!-- entry types -->
        <p class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.entryType') }}</p>
        <base-dropdown class="input" 
                       menu-classes="dropdown-black" 
                       title-classes="btn btn-secondary"
                       :title="strategy.entryType">
          <ul style="list-style-type: none;">
            <li v-for="eType in $t('research.patternLab.backtestPatterns.entryRules.entryTypes').filter(et => et !== strategy.entryType)">            
              <a class="dropdown-item" 
                 @click="strategy.entryType = eType" 
                 href="#">
                 {{ eType }}
              </a>
            </li>
          </ul>
        </base-dropdown>

        <!-- direction -->
        <p class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.direction') }}</p>
        <base-dropdown class="input" 
                       menu-classes="dropdown-black" 
                       title-classes="btn btn-secondary"
                       :title="strategy.direction">
          <ul style="list-style-type: none;">
            <li v-for="dir in $t('research.patternLab.backtestPatterns.entryRules.directions').filter(d => d !== strategy.direction)">            
              <a class="dropdown-item" 
                 @click="strategy.direction = dir" 
                 href="#">
                 {{ dir }}
              </a>
            </li>
          </ul>
        </base-dropdown>

        <!-- price (show only if Entry type not MARKET) -->
        <div v-if="strategy.entryType !== $t('research.patternLab.backtestPatterns.entryRules.entryTypes')[0]">
          <table>
            <tr>
              <td><p class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.price') }}</p></td>
              <td><base-dropdown class="input" 
                            menu-classes="dropdown-black" 
                            title-classes="btn btn-secondary"
                            :title="strategy.price.ohlc">
                <ul style="list-style-type: none;">
                  <li v-for="ohlc in $t('research.patternLab.backtestPatterns.entryRules.ohlcs').filter(po => po !== strategy.price.ohlc)">
                    <a class="dropdown-item" 
                      @click="strategy.price.ohlc = ohlc" 
                      href="#">
                      {{ ohlc }}
                    </a>
                  </li>
                </ul>
              </base-dropdown></td>
              <td><base-input alternative
                          type="text"
                          class="input"
                          v-model="strategy.price.offset"
                          :placeholder="$t('research.patternLab.backtestPatterns.entryRules.offset')">
              </base-input></td>
              <td><base-dropdown menu-classes="dropdown-black" 
                            title-classes="btn btn-secondary"
                            :title="strategy.price.unit">
                <ul style="list-style-type: none;">
                  <li v-for="unit in $t('research.patternLab.units').filter(u => u !== strategy.price.unit)">
                    <a class="dropdown-item" 
                      @click="strategy.price.unit = unit" 
                      href="#">
                      {{ unit }}
                    </a>
                  </li>
                </ul>
              </base-dropdown></td>
            </tr>
          </table>
        </div>

        <!-- trend filter -->
        <p :title="$t('research.patternLab.backtestPatterns.entryRules.trendFilterTip')" class="label">{{ $t('research.patternLab.backtestPatterns.trendFilter') }}</p>
        <!-- to-do: tip not visible because of position:relative of moving average -->
        <input type="checkbox" v-model="strategy.trendFilter.entryRules" class="input" style="margin-top: 5px">
        <!-- moving average -->
        <div v-if="strategy.trendFilter.entryRules" :title="$t('research.patternLab.backtestPatterns.movingAverageTip')">
          <p style="width: 46%; position: relative; top: 10px">{{ $t('research.patternLab.movingAverage') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 52%; margin-top: -25px"
                      v-model="strategy.movingAverage.entryRules"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>

        <!-- expiration -->
        <div :title="$t('research.patternLab.backtestPatterns.entryRules.expirationTip')">
          <p style="width: 40%; position: relative; top: 30px">{{ $t('research.patternLab.backtestPatterns.entryRules.expiration') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 60%"
                      v-model="strategy.expiration"
                      :placeholder="$t('research.patternLab.backtestPatterns.entryRules.numberDays')">
          </base-input>
        </div>
      </card>

      <!-- exit rules -->
      <card>
        <h4 slot="header" class="card-title" style="float: left">{{ $t('research.patternLab.exit') + ' ' + $t('research.patternLab.rules') }}</h4>

        <!-- analyze -->
        <div :title="$t('research.patternLab.backtestPatterns.exitRules.analyzeTip')">
          <p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.analyze') }}</p>
          <base-input alternative
                      type="text"
                      class="input"
                      v-model="strategy.analyze"
                      :placeholder="$t('research.patternLab.backtestPatterns.exitRules.numberBars')">
          </base-input>
        </div>

        <table>
          <!-- profit target -->
          <tr>
            <td><p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.profitTarget') }}</p></td>
            <td><base-input alternative
                        type="text"                        
                        v-model="strategy.profitTarget.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="strategy.profitTarget.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.units').filter(u => u !== strategy.profitTarget.unit)">
                  <a class="dropdown-item" 
                    @click="strategy.profitTarget.unit = unit" 
                    href="#">
                    {{ unit }}
                  </a>
                </li>
              </ul>
            </base-dropdown></td>

          <!-- stop loss -->
          <tr>
            <td><p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.stopLoss') }}</p></td>
            <td><base-input alternative
                        type="text"
                        v-model="strategy.stopLoss.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="strategy.stopLoss.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.units').filter(u => u !== strategy.stopLoss.unit)">
                  <a class="dropdown-item" 
                    @click="strategy.stopLoss.unit = unit" 
                    href="#">
                    {{ unit }}
                  </a>
                </li>
              </ul>
            </base-dropdown></td>
          </tr>

          <!-- break even check -->
          <tr>
            <td><p class="label" style="margin-top: 17px">{{ $t('research.patternLab.breakEven') }}</p></td>
            <td><input type="checkbox" v-model="strategy.breakEven.allowed" class="input"></td>
          </tr>

          <!-- break even -->
          <tr v-if="strategy.breakEven.allowed" :title="$t('research.patternLab.backtestPatterns.exitRules.breakEvenTip')">            
            <td><p class="label">{{ $t('research.patternLab.breakEven') }}</p></td>
            <td><base-input alternative
                        type="text"
                        v-model="strategy.breakEven.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="strategy.breakEven.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.units').filter(u => u !== strategy.breakEven.unit)">
                  <a class="dropdown-item" 
                    @click="strategy.breakEven.unit = unit" 
                    href="#">
                    {{ unit }}
                  </a>
                </li>
              </ul>
            </base-dropdown></td>
          </tr>
        </table>

        <!-- trend filter check -->
        <div :title="$t('research.patternLab.backtestPatterns.entryRules.trendFilterTip')">
          <input type="checkbox" style="width: 60%; position: relative; top: 25px" v-model="strategy.trendFilter.exitRules">
          <p style="width: 60%">{{ $t('research.patternLab.backtestPatterns.trendFilter') }}</p>          
        </div>

        <!-- moving average -->
        <div v-if="strategy.trendFilter.exitRules" :title="$t('research.patternLab.backtestPatterns.movingAverageTip')">
          <p style="width: 46%; top: 10px; position: relative;">{{ $t('research.patternLab.movingAverage') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 52%; margin-top: -25px"
                      v-model="strategy.movingAverage.exitRules"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>

      </card>

      <!-- Run strategy button -->
      <base-button native-type="submit" type="secondary" @click="runStrategyClick" style="width: 100%">{{ $t('research.patternLab.backtestPatterns.runStrategy') }}</base-button>

    </div>

    <!-- performance results  -->
    <card class="col-lg-8 col-md-12" :key="cardKey">
      <h4 slot="header" class="card-title" style="float: left">{{ $t('research.patternLab.backtestPatterns.performanceResults.title') }}</h4>

      <top-navbar />

      <dashboard-content @click.native="toggleSidebar" style="margin-top: 15px" />
    </card>

  </div>
</template>
<script>
  import AssetsPatternsPicker from '@/custom/components/AssetsPatternsPicker'
  import constants from '@/custom/assets/js/constants'
  import i18n from "@/i18n"
  
  import TopNavbar from "@/custom/layout/application/patternLab/performanceResults/TopNavbar.vue";
  import DashboardContent from "@/custom/layout/application/patternLab/Content.vue";
  import MobileMenu from "@/layout/dashboard/MobileMenu";

  
  const defaultStrategy = {
    initialCapital: null,
    // entry rules
    entryType: i18n.t('research.patternLab.backtestPatterns.entryRules.entryTypes')[0],
    direction: i18n.t('research.patternLab.backtestPatterns.entryRules.directions')[0],
    price: {
      ohlc: i18n.t('research.patternLab.backtestPatterns.entryRules.ohlcs')[0],
      offset: null,
      unit: constants.defaultUnit
    },
    trendFilter: {
      entryRules: false,
      exitRules: false
    },
    movingAverage: {
      entryRules: null,
      exitRules: null
    },
    expiration: null,
    // exit rules
    analyze: null,
    profitTarget: {
      value: null,
      unit: constants.defaultUnit
    },
    stopLoss: {
      value: null,
      unit: constants.defaultUnit
    },
    breakEven: {
      value: null,
      unit: constants.defaultUnit,
      allowed: false
    }
  }

  export default {
    components: {
      AssetsPatternsPicker,
      TopNavbar,
      DashboardContent,
      MobileMenu
    },

    data() {
      return {
        storeKey: 'research.patternLab.backtestPatterns.title',

        // assets-patterns picker data
        timeframe: null,
        startDate: null,    
        endDate: null,

        // strategy settings
        strategy: defaultStrategy,
        
        cardKey: 0
      }
    },
    
    methods: {
      initStrategyData() {
        let data = this.$store.getItem(this.storeKey)
        this.strategy = data ? data.strategy : defaultStrategy
      },

      // methods for receiving data from AssetsPatternsPicker btnClicked emit
      addPattern(data) {
        let storeData = this.$store.getItem(this.storeKey)
        if (!storeData) {
          storeData = {}
        }
        storeData['pattern'] = data
        this.$store.setItem(this.storeKey, storeData)

        this.cardKey++
      },
      timeframeChanged(timeframe) {
        let storeData = this.$store.getItem(this.storeKey)
        if (!storeData) {
          storeData = {}
          storeData['pattern'] = {}
        }
        storeData.pattern['timeframe'] = timeframe
        this.$store.setItem(this.storeKey, storeData)

        this.cardKey++
      },

      runStrategyClick() {
        let data = this.$store.getItem(this.storeKey)
        if (!data) {
          data = {}
        }
        data['strategy'] = this.strategy
        this.$store.setItem(this.storeKey, data)

        this.cardKey++
      },

      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    },

    mounted() {
      this.initStrategyData()     
      this.runStrategyClick() 
    }
  }  
</script>
<style>
.label {
  float: left;
  width: 40%;
  padding-top: 5px;
}

.input {
  float: left;
  width: 60%;
}
</style>