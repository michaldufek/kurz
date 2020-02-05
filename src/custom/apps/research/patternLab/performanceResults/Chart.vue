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
                         :title="selectedBacktest ? selectedBacktest.name : null"
                         style="width: 20%">
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
                    :legend="legend"
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

        <!-- cumulated profit chart -->
        <fancy-chart :title="$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.backtestPatterns.title') + ' ' + $t(storeKey + '.title') + ' ' + $t(storeKey + '.cumulatedProfit')"
                     :apiUrls="statsChartUrl"
                     :dataCreator="profitDataCreator"
                     :axesLabels="[ $t(storeKey + '.xLabel'), $t(storeKey + '.cumulatedProfit') ]"
                     :responsive="true"                     
                     :key="statsChartKey" />

        <!-- drawdown chart -->
        <fancy-chart :title="$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.backtestPatterns.title') + ' ' + $t(storeKey + '.title') + ' ' + $t(storeKey + '.drawdown')"
                     :apiUrls="statsChartUrl"    
                     :dataCreator="drawdownDataCreator"
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

            loading: true,
            noDataText: '',

            // dropdowns
            backtestsNames: [],
            selectedBacktest: null,
            selectedAsset: null,            
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
          return this.selectedAsset ? this.selectedAsset.symbol : ''
      },
      btNamesFiltered() {
        return this.selectedBacktest ? this.backtestsNames.filter(bt => bt.id !== this.selectedBacktest.id) : this.backtestsNames
      },

      statsChartUrl() {
        return !this.loading ? [ constants.urls.patternLab.backtestPatterns.results ] : []
      },

      legend() {
        return this.tradesEntries.length || this.tradesStopLosses.length || this.tradesExits.length ? `<span style="color:${constants.colors.transEntry}">&#9650;</span> Trade entry<br/><span style="color:${constants.colors.transStopLoss}">&#9650;</span> Trade Stop loss<br/><span style="color:${constants.colors.transExit}">&#9650;</span> Trade exit` : null
      }
    },
    
    methods: {
        initData() {
            let data = helper.getAssetsPatternsPickerData(this.$store)
            if (data) {
              this.assetsPatterns = data
            }

            this.setBacktestsNames()
            this.initDropDowns()
            this.loadChart()
        },
        setBacktestsNames() {             
            let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
            if (data) {
              this.loading = data.loading

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
            } else {
              this.loading = false
            }
        },

        initDropDowns() {
            let data = this.$store.getItem(this.storeKey)
            if (data) {
                ({ selectedAsset:this.selectedAsset, chartType:this.chartType } = data)
            } else {
                this.chartType = this.$t('research.patternLab.chartTypes')[0]
            }
            if (!this.selectedAsset && this.assetsPatterns.checkedAssets.length) {
                this.selectedAsset = this.assetsPatterns.checkedAssets[0]
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

        selectAsset(asset) {
            this.selectedAsset = asset
            this.loadChart()
        },
        selectBacktest(bt) {
            this.selectedBacktest = bt
            this.statsChartKey++
            this.loadChart()
        },
        selectChartType(chartType) {
            this.chartType = chartType
            this.loadChart()
        },

        profitDataCreator(responseData) {
          let data = responseData.filter(d => d.id === this.selectedBacktest.id)
          if (data.length) {
            let datum = data[0]

            if (datum.error) {
              let btName = helper.getBacktestPatternsTableBase(datum, this.$store, this.$t(constants.patternsKey + '.columns')).name
              this.noDataText = `Pattern results of '${btName}' has some problems: ${datum.msg}`  // to-do: test if it really shows the text
            } else {
              this.tradesEntries = Object.values(datum.output.trades.start)
              this.tradesStopLosses = datum.stop_loss_unit === constants.defaultUnit ? [ datum.stop_loss_value ] : []   // temporary until BE doesn't return stop_loss_value for % !!!
              this.tradesExits = Object.values(datum.output.trades.finish)

              return {
                time: Object.values(datum.output.trades.finish),
                equity: Object.values(datum.output.stats.pnl_cum)
              }
            }
          }
          // otherwise let exception happen, ie. it's server error
        },
        drawdownDataCreator(responseData) {
          let data = responseData.filter(d => d.id === this.selectedBacktest.id)
          if (data.length) {
            let datum = data[0]

            if (datum.error) {
              let btName = helper.getBacktestPatternsTableBase(datum, this.$store, this.$t(constants.patternsKey + '.columns')).name
              this.noDataText = `Pattern results of '${btName}' has some problems: ${datum.msg}`
            } else {
              return {
                time: Object.values(datum.output.trades.finish),
                equity: Object.values(datum.output.stats["Drawdown Underwater plot"])
              }
            }
          }
          // otherwise let exception happen, ie. it's server error
        }
    },

    watch: {
      selectedAsset(val) {        
        helper.updateStore(this.$store, 'selectedAsset', val, this.storeKey)
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