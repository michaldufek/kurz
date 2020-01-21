<template>
    <div>
        <div style="position: relative; left: 10px; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="selectedAsset ? selectedAsset.symbol : null"
                         style="width: 15%">
            <ul style="list-style-type: none;">
              <li v-for="asset in assets">            
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
                         style="width: 23%">
            <ul style="list-style-type: none;">
              <li v-for="pattern in patterns">            
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

        <fancy-chart v-if="chartType === $t('research.patternLab.chart.chartTypes')[0]"
                     :title="$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.backtestPatterns.title') + ' ' + $t(storeKey + '.title')"
                     :apiUrls="chartUrl ? [ chartUrl ] : []"
                     :range="{ from: from, to: to }"
                     style="top: -45px; height: 100%"
                     :responsive="true"                     
                     :key="chartKey" />
        <ohlc-chart v-else 
                    :apiUrl="chartUrl" 
                    :type="chartType"
                    :range="{ from: from, to: to }"
                    style="top: -45px; height: 830px" 
                    :key="chartKey" />
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

            // dropdowns
            assets: [],
            selectedAsset: null,
            patterns: [],
            selectedPattern: null,
            chartType: null,

            // chart
            from: null,
            to: null,
            chartUrl: null,
            chartKey: 0,
        }
    },
    
    methods: {
        initData() {
            let data = helper.getAssetsPatternsPickerData(this.$store)
            if (data) {
                ({ from:this.from, to:this.to, checkedAssets:this.assets, checkedPatterns:this.patterns } = data)
            }

            data = this.$store.getItem(this.storeKey)
            if (data) {
                ({ selectedAsset:this.selectedAsset, selectedPattern:this.selectedPattern, chartType:this.chartType } = data)
            } else {
                this.chartType = this.$t('research.patternLab.chart.chartTypes')[0]
            }
            if (!this.selectedAsset && this.assets.length) {
                this.selectedAsset = this.assets[0]
            }
            if (!this.selectedPattern && this.patterns.length) {
                this.selectedPattern = this.patterns[0]
            }

            this.loadCharts()
        },

        loadChart() {
            this.chartUrl = null
            if (this.selectedAsset) {
                this.chartUrl = constants.urls.patternLab.chart + helper.encodeRouteParams([ this.selectedAsset.id, helper.convertTimeframe(this.timeframe) ])
            }
            this.chartKey += 1 // force reload of fancy-chart component
        },

        selectAsset(asset) {
            this.selectedAsset = asset
            this.loadCharts()
        },
        selectPattern(pattern) {
            this.selectedPattern = pattern
            this.loadCharts()
        },
        selectChartType(chartType) {
            this.chartType = chartType
            this.loadCharts()
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