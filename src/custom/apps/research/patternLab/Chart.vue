<template>
  <div>
    <div class="row">
      <div class="col-lg-2 col-md-12 container">
        <assets-patterns-picker :title="$t('research.patternLab.chart.title')"
                                :oneAssetLimit="true"
                                :btnText="$t('research.patternLab.chart.addChart')" 
                                :tfLeftPos="475"
                                :dpTexts="{ from: $t('research.patternLab.from'), to: $t('research.patternLab.to') }"
                                @btnClicked="addChart" 
                                @timeframeChanged="timeframeChanged" />      
      </div>

      <!-- chart -->
      <div class="col-lg-7 col-md-12">
        <!-- chart settings -->
        <div style="position: relative; left: 10px; top: 10px; z-index: 1">
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
                     :title="$t('sidebar.patternLab') + ' ' + $t('research.patternLab.chart.title')"
                     :apiUrls="[ lineChartUrl ]"
                     :dataFields="[ 'Close', 'Volume' ]"
                     :range="{ from: from, to: to }"
                     :responsive="true"
                     style="top: -45px; height: 100%"
                     :key="lineChartKey" />
        <ohlc-chart v-else 
                    :title="ohlcChartTitle"
                    :apiUrl="lineChartUrl" 
                    :type="chartType"
                    :range="{ from: from, to: to }"
                    style="top: -45px; height: 830px" 
                    :key="lineChartKey" />
      </div>

      <!-- patterns history -->
      <div class="col-lg-3 col-md-12">
        <fancy-table :title="$t('research.patternLab.chart.patternsHistory.title')"
                     :apiUrls="patternsHistoryUrl"
                     :columns="$t('research.patternLab.chart.patternsHistory.columns')"
                     :rowsCreator="rowsCreator"
                     :key="tableKey">
        </fancy-table>
      </div>
    </div>
  </div>
</template>
<script>
  import Dropdown from 'vue-simple-search-dropdown';

  import AssetsPatternsPicker from '@/custom/components/AssetsPatternsPicker'
  import FancyChart from '@/custom/components/Charts/FancyChart';
  import OhlcChart from '@/custom/components/Charts/OhlcChart';
  import FancyTable from '@/custom/components/Tables/FancyTable';  

  import constants from '@/custom/assets/js/constants';
  import helper from '@/custom/assets/js/helper';


  export default {
    components: {  
      AssetsPatternsPicker,
      Dropdown,
      FancyChart,
      OhlcChart,
      FancyTable
    },

    data() {
      // fixes x-axes label overlapping
      // https://www.chartjs.org/docs/latest/axes/cartesian/?h=autoskip
      return {
        storeKey: 'research.patternLab.chart',

        // assets-patterns-picker
        from: null,
        to: null,
        timeframe: null,
        asset: null,
        patterns: [],

        // chart
        chartType: this.$t('research.patternLab.chart.chartTypes')[0],
        lineChartUrl: null,
        lineChartKey: 0,        

        // patterns history
        patternsHistoryUrl: [],
        tableKey: 0
      }
    },

    computed: {
      ohlcChartTitle() {
        // title in form <asset> ([patterns]) - more than 3 patterns will be replaced by '...'
        if (this.asset) {
          const maxPatterns = 3
          let patterns = this.patterns.slice(0, maxPatterns).map(p => p.name)
          if (this.patterns.length > maxPatterns) {
            patterns = patterns.concat([ '...' ])
          }

          return this.asset.symbol + (patterns.length ? ' (' + patterns.join(', ') + ')' : '')
        }
      }
    },

    methods: {
      // chart methods
      addChart(data) {
        this.from = data.from,
        this.to = data.to,
        this.timeframe = data.timeframe
        this.asset = data.assets[0]
        this.patterns = data.patterns    
        
        this.loadChart()

        if (this.patterns.length) {
        // load patterns history table
          this.patternsHistoryUrl = [ constants.urls.patternLab.patternsHistory + "?" + helper.encodeQueryData(this.getQueryData()) ]
          this.tableKey += 1 // force reload of fancy-table component
        }
      },
      loadChart() {
        if (this.asset) {
          this.lineChartUrl = constants.urls.patternLab.chart + this.asset.id + '/' + helper.convertTimeframe(this.timeframe)
          this.lineChartKey += 1 // force reload of fancy-chart component
        }
      },      

      timeframeChanged(timeframe) {
        this.timeframe = timeframe
        this.loadChart()
      },
      selectChartType(chartType) {
        this.chartType = chartType

        let data = this.$store.getItem(this.storeKey)
        if (!data) {
          data = {}
        }
        data['chartType'] = chartType
        this.$store.setItem(this.storeKey, data)

        this.loadChart()
      },

      // table methods (patterns history)
      rowsCreator(responseData) {
        let rows = []

        responseData.forEach(data => {            
            let pattern = data.pattern.name
            
            data.signal_set.forEach(signal => {
              let row = []

              row.push(signal.date)
              row.push(pattern)
              row.push(helper.convertDirection(signal.direction))

              rows.push(row);
            })
          });

        return rows
      },

      getQueryData(data) {
        let query = {}

        query['patterns'] = this.patterns.map(chp => chp.id).join(',')
        query['symbols'] = this.asset.symbol // or can be more selected ?
        query['timeframe'] = helper.convertTimeframe(this.timeframe)
        
        return query
      }
    },

    mounted() {
      let data = this.$store.getItem(this.storeKey)
      if (data) {
        this.chartType = data.chartType
      }
    }
  }  
</script>
<style>
</style>