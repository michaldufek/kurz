<template>
  <div class="row">

    <div class="col-lg-2 col-md-12 container" style="max-width: 15%">
      <assets-patterns-picker :title="$t('research.patternLab.backtestPatterns.title')"
                              :btnText="$t('research.patternLab.backtestPatterns.addPattern')" 
                              @btnClicked="addPattern" />
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

        <!-- trend filter -->
        <p :title="$t('research.patternLab.backtestPatterns.entryRules.trendFilterTip')" class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.trendFilter') }}</p>
        <!-- to-do: tip not visible because of position:relative of moving average -->
        <input type="checkbox" v-model="strategy.trendFilter" class="input" style="margin-top: 15px">
        <!-- moving average -->
        <div v-if="strategy.trendFilter" :title="$t('research.patternLab.backtestPatterns.entryRules.movingAverageTip')">
          <p style="width: 46%; position: relative; top: 10px">{{ $t('research.patternLab.backtestPatterns.entryRules.ma_filter_period') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 52%; margin-top: -25px"
                      v-model="strategy.ma_filter_period"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>

        <!-- risk (fix-amount) -->
        <div>
          <p style="width: 40%; position: relative; top: 25px">{{ $t('research.patternLab.backtestPatterns.entryRules.fixed_amount') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 60%"
                      v-model="strategy.fixed_amount"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
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
            <td><p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.profit_take') }}</p></td>
            <td><base-input alternative
                        type="text"                        
                        v-model="strategy.profit_take.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="strategy.profit_take.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.units').filter(u => u !== strategy.profit_take.unit)">
                  <a class="dropdown-item" 
                    @click="strategy.profit_take.unit = unit" 
                    href="#">
                    {{ unit }}
                  </a>
                </li>
              </ul>
            </base-dropdown></td>

          <!-- stop loss -->
          <tr>
            <td><p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.stoploss') }}</p></td>
            <td><base-input alternative
                        type="text"
                        v-model="strategy.stoploss.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="strategy.stoploss.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.units').filter(u => u !== strategy.stoploss.unit)">
                  <a class="dropdown-item" 
                    @click="strategy.stoploss.unit = unit" 
                    href="#">
                    {{ unit }}
                  </a>
                </li>
              </ul>
            </base-dropdown></td>
          </tr>

        </table>

      </card>

      <!-- Run strategy button -->
      <base-button native-type="submit" type="secondary" @click="runStrategyClick" style="width: 100%">{{ $t('research.patternLab.backtestPatterns.runStrategy') }}</base-button>

    </div>

    <!-- performance results  -->
    <card class="col-lg-8 col-md-12" :key="cardKey">
      <h4 slot="header" class="card-title" style="float: left">{{ $t('research.patternLab.backtestPatterns.performanceResults.title') }}</h4>

      <top-navbar />
      <DualRingLoader v-if="loading" :color="'#54f1d2'" :class="[loading ? dataClass : noDataClass, loaderClass]"/>
      <dashboard-content @click.native="toggleSidebar" style="margin-top: 15px" />
    </card>

  </div>
</template>
<script>
  import AssetsPatternsPicker from '@/custom/components/AssetsPatternsPicker'
  import constants from '@/custom/assets/js/constants'
  import helper from '@/custom/assets/js/helper';
  import i18n from "@/i18n"
  
  import TopNavbar from "@/custom/layout/application/patternLab/performanceResults/TopNavbar.vue";
  import DashboardContent from "@/custom/layout/application/patternLab/Content.vue";
  import MobileMenu from "@/layout/dashboard/MobileMenu";
  import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';

  
  const defaultStrategy = {
    initialCapital: null,

    // entry rules
    direction: i18n.t('research.patternLab.backtestPatterns.entryRules.directions')[0],
    trendFilter: false,
    ma_filter_period: null,
    fixed_amount: null,
    
    // exit rules
    analyze: null,
    profit_take: {
      value: null,
      unit: constants.defaultUnit
    },
    stoploss: {
      value: null,
      unit: constants.defaultUnit
    }
  }
  const errorTitle = ' (' + i18n.t('research.patternLab.backtestPatterns.title') + ').'
  const columns = i18n.t(constants.patternsKey + '.columns')

  export default {
    components: {
      AssetsPatternsPicker,
      TopNavbar,
      DashboardContent,
      MobileMenu,
      DualRingLoader
    },

    data() {
      return {
        strategy: defaultStrategy,
        backtests2check: [],
        loading: false,
        cardKey: 0,

        // css classes
        dataClass: 'data',      
        noDataClass: 'noData',
        loaderClass: 'loader',
      }
    },
    
    methods: {
      initData() {
        let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
        if (data) {
          this.loading = data.loading ? data.loading : false
          this.strategy = data.strategy ? data.strategy : defaultStrategy
          this.backtests2check = data.backtests2check ? data.backtests2check : []
        }

        setInterval(() => { 
          this.checkBacktests()
        }, constants.intervals.backtestsDone )        
      },
      checkBacktests() {
        if (!this.backtests2check.length) {
          this.loading = false
          return
        }

        let backtestsDone = []

        this.$http
        .get(constants.urls.patternLab.backtestPatterns.checkRun)  // temporary only first !!!
        .then(response => {
          response.data.forEach(bt => {
            if (bt.done) {
              backtestsDone.push(bt.id)
            }
          })
        })
        .catch(error => {
          console.log(error);

          if (error.message === constants.strings.networkError) {
            helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', errorTitle)
          }
        })
        .finally(() => {
          let backtestsDiff = this.backtests2check.filter(bt => !backtestsDone.includes(bt))  // difference of backtests run and done
          if (!backtestsDiff.length) {
            this.$http
            .get(constants.urls.patternLab.backtestPatterns.results + this.backtests2check[0])  // temporary only first !!!
            .then(response => {
              helper.updateStore(this.$store, 'backtestsResults', response.data/*.filter(bt => this.backtests2check.includes(bt.id))*/, constants.storeKeys.backtestPatterns) 

              let bpData = this.$store.getItem(constants.storeKeys.backtestPatterns)
              if (bpData) {
                // set bt id and name (if not changed)
                let bts = bpData.backtests
                bts.forEach(bt => {
                  bt['btId'] = response.data./*filter(datum => datum.tickers[0].symbol === bt[columns[4].toLowerCase()] 
                                                     && datum.patterns[0].name === bt[columns[5].toLowerCase()])[0].*/id
                  bt[columns[0].toLowerCase()] = bt['defaultName'] ? bt['btId'] : `${bt[columns[0].toLowerCase()].split(' ')[0]} (${bt['btId']})`    // Name
                })
                helper.updateStore(this.$store, 'backtests', bts, constants.storeKeys.backtestPatterns) 
                this.cardKey++
              }
            })
            .catch(error => {
              console.log(error);

              if (error.message === constants.strings.networkError) {
                helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', errorTitle)
              }
            })
            .finally(() => {
              console.log('bts all ok')
              this.backtests2check = []
              this.loading = false
            })
          }         
        })
      },

      // methods from AssetsPatternsPicker emits
      addPattern() {
        if (!this.strategy.initialCapital) {
          this.$notify({
                          type: 'warning', 
                          message: this.$t('notifications.noInitialCapital') + errorTitle
                      })
          return 
        }

        if (this.loading) {
          this.$notify({
                          type: 'warning', 
                          message: this.$t('notifications.loading') + errorTitle
                      })
          return 
        }

        this.setBacktestsTable(true)
        this.cardKey++
      },

      runStrategyClick() {
        let data = helper.getAssetsPatternsPickerData(this.$store)
        if (!data || !data.checkedAssets.length) {   
          this.$notify({
                          type: 'warning', 
                          message: this.$t('notifications.addNoAsset') + errorTitle
                      })

        } else {
          if (this.loading) {
            this.$notify({
                            type: 'warning', 
                            message: this.$t('notifications.loading') + errorTitle
                        })
            return 
          }

          if (data && !data.checkedPatterns.length) {
            this.$notify({
                type: 'warning', 
                message: this.$t('notifications.addNoPattern') + errorTitle
            })  
          } else if (data) {
            this.setBacktestsTable()
            this.cardKey++
            this.runBacktests()     
          }
        }
      },

      setBacktestsTable(createNew=false) {
        let assetsPatterns = helper.getAssetsPatternsPickerData(this.$store)
        let bpData = this.$store.getItem(constants.storeKeys.backtestPatterns)
        let oldTableData = []
        if (bpData) {
            oldTableData = bpData.backtests
        }
        let newTableData = oldTableData

        if (createNew && assetsPatterns) {
            // create new rows
            newTableData = []
            let rowNr = 1

            assetsPatterns.checkedAssets.forEach(asset => {
                assetsPatterns.checkedPatterns.forEach(pattern => {
                    let row = {}
                    let clNr = 0

                    row['btId'] = rowNr++
                    row['defaultName'] = true
                    row[columns[clNr++].toLowerCase()] = '     ' + row['btId']    // Name
                    row[columns[clNr++].toLowerCase()] = assetsPatterns.range && assetsPatterns.range.from 
                                                          ? helper.formatDate(helper.formatDateOnly(assetsPatterns.range.from))
                                                          : null    // From
                    row[columns[clNr++].toLowerCase()] = assetsPatterns.range && assetsPatterns.range.to
                                                          ? helper.formatDate(helper.formatDateOnly(assetsPatterns.range.to))
                                                          : null    // To
                    row[columns[clNr++].toLowerCase()] = assetsPatterns.timeframe    // Time frame
                    row['assetId'] = asset.id
                    row[columns[clNr++].toLowerCase()] = asset.symbol    // Asset
                    row['patternId'] = pattern.id
                    row[columns[clNr++].toLowerCase()] = pattern.name    // Pattern

                    if (this.strategy) {   
                        this.updateRow(row, clNr)                            
                    }                                            

                    newTableData.push(row)
                })
            })
        } else if (assetsPatterns && this.strategy) {
            // update rows (with checked assets/patterns) with new strategy data
            newTableData = []

            oldTableData.forEach(row => {
                let clNr = 4    // starting from Asset column (for the if)

                if (assetsPatterns.range && !assetsPatterns.range.to) {
                    // set null To dates to today
                    row[columns[clNr-2].toLowerCase()] = helper.formatDate(new Date()) // To
                }

                if (assetsPatterns.checkedAssets.map(ca => ca.symbol).includes(row[columns[clNr++].toLowerCase()]) 
                    && assetsPatterns.checkedPatterns.map(cp => cp.name).includes(row[columns[clNr++].toLowerCase()])) {
                        this.updateRow(row, clNr) 
                }

                newTableData.push(row)
            })
        }

        helper.updateStore(this.$store, 'backtests', newTableData, constants.storeKeys.backtestPatterns) 
      },
      updateRow(row, clNr) {
        row[columns[clNr++].toLowerCase()] = this.strategy.initialCapital ? `${this.strategy.initialCapital} ${constants.defaultUnit}` : null    // Initial capital
        row[columns[clNr++].toLowerCase()] = this.strategy.analyze ? `${this.strategy.analyze} ${helper.pluralize(this.strategy.analyze, constants.patternsKey + '.bar')}` : null    // Analyze
        row[columns[clNr++].toLowerCase()] = this.strategy.profit_take.value ? `${this.strategy.profit_take.value} ${this.strategy.profit_take.unit}` : null    // Profit Target
        row[columns[clNr++].toLowerCase()] = this.strategy.stoploss.value ? `${this.strategy.stoploss.value} ${this.strategy.stoploss.unit}` : null    // Stop Loss
        row[columns[clNr++].toLowerCase()] = this.strategy.trendFilter && this.strategy.ma_filter_period ? `${this.strategy.ma_filter_period} ${constants.defaultUnit}` : null    // Trend filter (moving average)
        row[columns[clNr++].toLowerCase()] = this.strategy.direction    // Direction
        row['fixed_amount'] = this.strategy.fixed_amount    // Risk
      },

      runBacktests() { 
        this.loading = true       
        let backtestsAll = this.$store.getItem(constants.storeKeys.backtestPatterns).backtests

        // run all backtests showed in Patterns table
        let backtests2Run = []
        backtestsAll.forEach(bt => {
          let data = helper.mapStrategyFromRow(bt)
          data['patterns'] = [ bt.patternId ]
          data['tickers'] = [ bt.assetId ]

          backtests2Run.push(data)
        })

        this.$http
        .post(constants.urls.patternLab.backtestPatterns.checkRun, backtests2Run[0])  // temporary only first !!!
        .then(response => {
            this.backtests2check = []
          // response.data.forEach(bt => 
            this.backtests2check.push(1506)//bt.id //response.data.id // 1506 temporary !!! unitl BE not finishing BTs
          // )
        })
        .catch(error => {
          console.log(error);

          if (error.message === constants.strings.networkError) {
            helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', errorTitle)
          }
        })
        .finally(() => {
          helper.updateStore(this.$store, 'backtests2check', this.backtests2check, constants.storeKeys.backtestPatterns)          
        })
      },

      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    },

    mounted() {
      this.initData()     
      this.cardKey++
    },

    watch: {
      loading(val) {
        helper.updateStore(this.$store, 'loading', val, constants.storeKeys.backtestPatterns) 
      },
      strategy: {
            handler(val){
                helper.updateStore(this.$store, 'strategy', val, constants.storeKeys.backtestPatterns) 
            },
            deep: true
        },
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

.loader {
  width: 80px; 
  height: 80px;  
  position: absolute; 
}

.loader.noData {
  top: 20%; 
  left: 40%;    
}

.loader.data {
  top: 40%; 
  left: 42.5%;
}
</style>