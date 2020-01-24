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
              <li v-for="chartType in $t('research.patternLab.chart.chartTypes').filter(el => el !== chartType)">            
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
        <fancy-chart v-if="chartType === $t('research.patternLab.chart.chartTypes')[0]"
                    :title="$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.backtestPatterns.title') + ' ' + $t(storeKey + '.title')"
                    :apiUrls="chartUrl ? [ chartUrl ] : []"
                    :range="{ from: assetsPatterns.from, to: assetsPatterns.to }"
                    style="height: 100%"
                    :responsive="true"                     
                    :key="historyChartKey" />
        <ohlc-chart v-else 
                    :title="ohlcChartTitle"
                    :apiUrl="chartUrl" 
                    :type="chartType"
                    :range="{ from: assetsPatterns.from, to: assetsPatterns.to }"
                    style="height: 830px" 
                    :key="historyChartKey" />

        <!-- cumulated profit chart -->
        <fancy-chart :title="$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.backtestPatterns.title') + ' ' + $t(storeKey + '.title') + ' ' + $t(storeKey + '.cumulatedProfit')"
                     :apiUrls="pnlChartUrl ? [ pnlChartUrl ] : []"
                     :range="{ from: assetsPatterns.from, to: assetsPatterns.to }"
                     :dataCreator="profitDataCreator"
                     :axesLabels="[ $t(storeKey + '.xLabel'), $t(storeKey + '.cumulatedProfit') ]"
                     :responsive="true"                     
                     :key="statsChartKey" />

        <!-- drawdown chart -->
        <fancy-chart :title="$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.backtestPatterns.title') + ' ' + $t(storeKey + '.title') + ' ' + $t(storeKey + '.drawdown')"
                     :apiUrls="ddChartUrl ? [ ddChartUrl ] : []"
                     :range="{ from: assetsPatterns.from, to: assetsPatterns.to }"
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
              from: null,
              to: null,
              checkedAssets: [],
              checkedPatterns: []
            },
            rules: null,     // entry/exit rules

            // dropdowns
            selectedAsset: null,            
            selectedPattern: null,
            chartType: null,

            // charts
            chartUrl: null,
            pnlChartUrl: null,
            ddChartUrl: null,
            historyChartKey: 0,
            statsChartKey: 0
        }
    },

    computed: {
      ohlcChartTitle() {
          return this.selectedAsset && this.selectedPattern ? this.selectedAsset.symbol + ' (' + this.selectedPattern.name + ')' : ''
      }
    },
    
    methods: {
        initData() {
            this.assetsPatterns = helper.getAssetsPatternsPickerData(this.$store)
            if (!this.assetsPatterns.checkedPatterns.length) {
                this.$notify({
                    type: 'warning', 
                    message: this.$t('notifications.addNoPattern') + ' (' + this.$t('sidebar.patternLab')
                              + ' / ' + this.$t('research.patternLab.backtestPatterns.title') 
                              + ' / ' + this.$t(this.storeKey + '.title') + ').'
                })
                
                return  
            }

            this.rules = this.$store.getItem(constants.storeKeys.backtestPatterns)

            this.initDropDowns()
            this.loadCharts()
        },
        initDropDowns() {
            let data = this.$store.getItem(this.storeKey)
            if (data) {
                ({ selectedAsset:this.selectedAsset, selectedPattern:this.selectedPattern, chartType:this.chartType } = data)
            } else {
                this.chartType = this.$t('research.patternLab.chart.chartTypes')[0]
            }
            if (!this.selectedAsset && this.assetsPatterns.checkedAssets.length) {
                this.selectedAsset = this.assetsPatterns.checkedAssets[0]
            }
            if (!this.selectedPattern && this.assetsPatterns.checkedPatterns.length) {
                this.selectedPattern = this.assetsPatterns.checkedPatterns[0]
            }
        },

        loadCharts(reloadHistory=true) {
            this.chartUrl = null
            if (this.selectedAsset) {
                this.chartUrl = helper.getPatternLabChartUrl(this.selectedAsset, this.assetsPatterns.timeframe)
            }
            this.pnlChartUrl = helper.getBacktestPatternsUrl({
              timeframe: this.assetsPatterns.timeframe,
              from: this.assetsPatterns.from,
              to: this.assetsPatterns.to,
              checkedAssets: [ this.selectedAsset ],
              checkedPatterns: [ this.selectedPattern ]
            }, this.rules)
            this.ddChartUrl = this.pnlChartUrl

            // force reload of chart components 
            if (reloadHistory) {
              this.historyChartKey++
            }
            this.statsChartKey++
        },

        selectAsset(asset) {
            this.selectedAsset = asset
            this.loadCharts()
        },
        selectPattern(pattern) {
            this.selectedPattern = pattern
            this.loadCharts(false)
        },
        selectChartType(chartType) {
            this.chartType = chartType
            this.loadCharts()
        },

        profitDataCreator(response) {
          let datum = response.data.filter(d => d[0] && d[0].symbol === this.selectedAsset.symbol && d[0].pattern_id === this.selectedPattern.id)

          return {
            time: datum[0] ? Object.values(datum[0][0].trades.trades.finish) : [],
            equity: datum[0] ? Object.values(JSON.parse(datum[0][0].trades.stats.pnl_cum)) : []
          }
        },
        drawdownDataCreator(response) {
          let datum = response.data.filter(d => d[0] && d[0].symbol === this.selectedAsset.symbol && d[0].pattern_id === this.selectedPattern.id)

          return {
            time: datum[0] ? Object.values(datum[0][0].trades.trades.finish) : [],
            equity: datum[0] ? Object.values(JSON.parse(datum[0][0].trades.stats["Drawdown Underwater plot"])) : []
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