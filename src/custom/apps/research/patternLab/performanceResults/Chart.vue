<template>
    <div>
        <!-- dropdowns -->
        <div style="position: relative; left: 10px; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="selectedAsset ? selectedAsset.symbol : null"
                         style="width: 17%">
            <ul style="list-style-type: none;">
              <li v-for="asset in assetsPatterns.checkedAssets.filter(a => a.id !== selectedAsset.id)">            
                <a class="dropdown-item" 
                   @click="selectAsset(asset)" 
                   href="#">
                  {{ asset.symbol }}
                </a>
              </li>
            </ul>
          </base-dropdown>
        </div>

        <div style="position: relative; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="selectedPattern ? selectedPattern.name : null"
                         style="width: 30%">
            <ul style="list-style-type: none;">
              <li v-for="pattern in assetsPatterns.checkedPatterns.filter(p => p.id !== selectedPattern.id)">            
                <a class="dropdown-item" 
                   @click="selectPattern(pattern)" 
                   href="#">
                  {{ pattern.name }}
                </a>
              </li>
            </ul>
          </base-dropdown>
        </div>

        <div style="position: relative; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="chartType">
            <ul style="list-style-type: none;">
              <li v-for="chartType in $t('research.patternLab.chartTypes').filter(el => el !== chartType)">            
                <a class="dropdown-item" 
                   @click="selectChartType(chartType)" 
                   href="#">
                  {{ chartType }}
                </a>
              </li>
            </ul>
          </base-dropdown>          
        </div>

        <!-- trades chart -->
        <fancy-chart v-if="chartType === $t('research.patternLab.chartTypes')[0]"
                    :title="$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.backtestPatterns.title') + ' ' + $t(storeKey + '.title')"
                    :apiUrls="chartUrl ? [ chartUrl ] : []"
                    style="height: 100%"
                    :tradesEntries="tradesEntries"
                    :tradesStopLosses="tradesStopLosses"
                    :tradesExits="tradesExits"
                    :responsive="true"                     
                    :key="historyChartKey" />
        <ohlc-chart v-else 
                    :title="ohlcChartTitle"
                    :apiUrl="chartUrl" 
                    :type="chartType"
                    style="height: 830px" 
                    :key="historyChartKey" />

        <div style="position: relative; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="selectedBacktest ? selectedBacktest.name : null">
            <ul style="list-style-type: none;">
              <li v-for="bt in btNamesFiltered">            
                <a class="dropdown-item" 
                   @click="selectBacktest(bt)" 
                   href="#">
                  {{ bt.name }}
                </a>
              </li>
            </ul>
          </base-dropdown>          
        </div>

        <!-- cumulated profit chart -->
        <fancy-chart :title="$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.backtestPatterns.title') + ' ' + $t(storeKey + '.title') + ' ' + $t(storeKey + '.cumulatedProfit')"
                     :responsesData="pnlChartData ? [ pnlChartData ] : []"
                     :axesLabels="[ $t(storeKey + '.xLabel'), $t(storeKey + '.cumulatedProfit') ]"
                     :responsive="true"                     
                     :key="statsChartKey" />

        <!-- drawdown chart -->
        <fancy-chart :title="$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.backtestPatterns.title') + ' ' + $t(storeKey + '.title') + ' ' + $t(storeKey + '.drawdown')"
                     :responsesData="ddChartData ? [ ddChartData ] : []"
                     :axesLabels="[ $t(storeKey + '.xLabel'), $t(storeKey + '.drawdown') ]"
                     :fill="true"
                     :responsive="true"                    
                     :key="statsChartKey" />
    </div>    
</template>
<script>
import Dropdown from 'vue-simple-search-dropdown';
import FancyChart from '@/custom/components/Charts/FancyChart';
import OhlcChart from '@/custom/components/Charts/OhlcChart';

import constants from '@/custom/assets/js/constants';
import helper from '@/custom/assets/js/helper';


export default {
    components: {
        Dropdown,
        FancyChart,
        OhlcChart
    },

    data() {
        return {
            storeKey: 'research.patternLab.backtestPatterns.performanceResults.chart',

            // assets-patterns-picker
            assetsPatterns: {
              range:{
                from: null,
                to: null
              },
              checkedAssets: [],
              checkedPatterns: []
            },

            // dropdowns
            backtestsNames: [],
            selectedBacktest: null,
            selectedAsset: null,            
            selectedPattern: null,
            chartType: null,

            // charts
            tradesEntries: [],
            tradesStopLosses: [],
            tradesExits: [],
            chartUrl: null,
            pnlChartData: null,
            ddChartData: null,
            historyChartKey: 0,
            statsChartKey: 0
        }
    },

    computed: {
      ohlcChartTitle() {
          return this.selectedAsset && this.selectedPattern ? this.selectedAsset.symbol + ' (' + this.selectedPattern.name + ')' : ''
      },
      btNamesFiltered() {
        return this.selectedBacktest ? this.backtestsNames.filter(bt => bt.id !== this.selectedBacktest.id) : this.backtestsNames
      }
    },
    
    methods: {
        initData() {
            let data = helper.getAssetsPatternsPickerData(this.$store)
            if (data) {
              this.assetsPatterns = data
            }

            this.checkBacktests()
            this.initDropDowns()
            this.loadChart()
        },
        checkBacktests() {             
            let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
            if (data && !data.loading) {
              this.pnlChartData = this.profitDataCreator(data.backtestsResults)
              this.ddChartData = this.drawdownDataCreator(data.backtestsResults)

              this.backtestsNames = []
              data.backtests.forEach(bt => this.backtestsNames.push({ id: bt.btId, name: bt[this.$t(constants.patternsKey + '.columns')[0].toLowerCase()] }))

              data = this.$store.getItem(this.storeKey)
              if (data && 'selectedBacktest' in data && this.backtestsNames.map(bn => bn.name).includes(data.selectedBacktest.name)) {
                this.selectedBacktest = data.selectedBacktest 
              }
              if (!this.selectedBacktest && this.backtestsNames.length) {
                  this.selectedBacktest = this.backtestsNames[0]
              }

              this.statsChartKey++
            }
        },

        initDropDowns() {
            let data = this.$store.getItem(this.storeKey)
            if (data) {
                ({ selectedAsset:this.selectedAsset, selectedPattern:this.selectedPattern, chartType:this.chartType } = data)
            } else {
                this.chartType = this.$t('research.patternLab.chartTypes')[0]
            }
            if (!this.selectedAsset && this.assetsPatterns.checkedAssets.length) {
                this.selectedAsset = this.assetsPatterns.checkedAssets[0]
            }
            if (!this.selectedPattern && this.assetsPatterns.checkedPatterns.length) {
                this.selectedPattern = this.assetsPatterns.checkedPatterns[0]
            }
        },

        loadChart(reloadHistory=true) {
            this.chartUrl = null
            if (this.selectedAsset) {
                this.chartUrl = helper.getPatternLabChartUrl(this.selectedAsset, this.assetsPatterns.timeframe, this.assetsPatterns.range)
            }

            // force reload of chart components 
            if (reloadHistory) {
              this.historyChartKey++
            }
        },

        getBacktestName(bt) {
          return bt.name + ' (' + bt.id + ')'
        },

        selectAsset(asset) {
            this.selectedAsset = asset
            this.loadChart()
        },
        selectPattern(pattern) {
            this.selectedPattern = pattern
            this.loadChart(false)
        },
        selectBacktest(bt) {
            this.selectedBacktest = bt
            this.checkBacktests()
        },
        selectChartType(chartType) {
            this.chartType = chartType
            this.loadChart()
        },

        profitDataCreator(responseData) {
          let datum = responseData//.filter(d => d.id === this.selectedBacktest.id)

          this.tradesEntries = Object.values(datum.backtestbit_set[0].output.trades.start)
          this.tradesStopLosses = datum.stop_loss_unit === constants.defaultUnit ? [ datum.stop_loss_value ] : []   // temp until BE doesn't return stop_loss_value for %
          this.tradesExits = Object.values(datum.backtestbit_set[0].output.trades.finish)

          return {
            time: Object.values(datum.backtestbit_set[0].output.trades.finish),
            equity: Object.values(datum.backtestbit_set[0].output.stats.pnl_cum)
          }
        },
        drawdownDataCreator(responseData) {
          let datum = responseData//.filter(d => d.id === this.selectedBacktest)

          return {
            time: Object.values(datum.backtestbit_set[0].output.trades.finish),
            equity: Object.values(datum.backtestbit_set[0].output.stats["Drawdown Underwater plot"])
          }
        }
    },

    watch: {
      selectedAsset(val) {        
        helper.updateStore(this.$store, 'selectedAsset', val, this.storeKey)
      },
      selectedPattern(val) {        
        helper.updateStore(this.$store, 'selectedPattern', val, this.storeKey)
      },
      selectedBacktest(val) {        
        helper.updateStore(this.$store, 'selectedBacktest', val, this.storeKey)
      },
      chartType(val) {        
        helper.updateStore(this.$store, 'chartType', val, this.storeKey)
      }
    },

    mounted() {
        this.initData()
    }
}
</script>
<style scoped>

</style>