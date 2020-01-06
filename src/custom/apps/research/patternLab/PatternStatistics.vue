<template>
  <div>
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div class="row">
      <div class="col-lg-3 col-md-12 container">
        <!-- statistics -->
        <fancy-card :title="$t('research.patternLab.patternStatistics.title') + ' - ' + $t('research.patternLab.patternStatistics.statistics.title')"
                    :fullTitle="$t('research.patternLab.patternStatistics.statistics.title')"
                    :showTitle="true"
                    :items="$t('research.patternLab.patternStatistics.statistics.items')"                    
                    :values="[ patternsStats.total, patternsStats.bullish, patternsStats.bearish ]"
                    style="margin-bottom: 0px;"
                    :key="cardKey">
        </fancy-card>

        <!-- pie charts -->
        <div style="position: relative; left: 10px; top: 50px; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="selectedAsset ? selectedAsset.symbol : null"
                         style="width: 20%">
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
        <pie-chart-card :title="$t('research.patternLab.patternStatistics.title') + ' - ' + $t('research.patternLab.patternStatistics.patternsByStock')"
                        :chartData="chartData.patternsByAsset" />

        <div style="position: relative; left: 10px; top: 50px; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="selectedPattern ? selectedPattern.name : null"
                         style="width: 20%">
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
        <pie-chart-card :title="$t('research.patternLab.patternStatistics.title') + ' - ' + $t('research.patternLab.patternStatistics.stocksByPattern')"
                        :chartData="chartData.assetsByPattern" />
      </div>

      <!-- patterns table -->
      <div class="col-lg-9 col-md-12">
        <fancy-table :showTitle="false"
                     :apiUrls="patternsUrl"
                     :columns="$t('research.patternLab.patternStatistics.patternsTable')"
                     :rowsCreator="rowsCreator"
                     :sortable="true"
                     :filtrable="true"
                     :headerTitle="$t('research.patternLab.patternStatistics.patternsTitle')"
                     :key="tableKey">
        </fancy-table>
      </div>
    </div>
  </div>
</template>
<script>
  import FancyTable from '@/custom/components/Tables/FancyTable';  
  import FancyCard from '@/custom/components/Cards/FancyCard';  
  import OhlcChart from '@/custom/components/Charts/OhlcChart';
  import PieChartCard from '@/custom/components/Cards/PieChartCard'

  import constants from '@/custom/assets/js/constants';
  import helper from '@/custom/assets/js/helper';


  export default {
    components: {  
      FancyTable,
      FancyCard,
      OhlcChart,
      PieChartCard
    },

    data() {
      return {
        // statistics card
        patternsStats: {
          total: 0,
          bullish: 0,
          bearish: 0
        },

        // pie charts
        selectedAsset: null,
        assets: [],
        selectedPattern: null,
        patterns: [],
        chartData: {
          patternsByAsset: null,
          assetsByPattern: null
        },

        // patterns table
        patternsUrl: [],
        cardKey: 0,
        tableKey: 0
      }
    },

    methods: {
      initTable() {
        let assets = []
        let patterns = []

        if ('selectedAssets' in localStorage) {
          assets = JSON.parse(localStorage.selectedAssets)
        }
        if ('selectedPatterns' in localStorage) {
          patterns = JSON.parse(localStorage.selectedPatterns)
        }

        this.patternsUrl = assets.length && patterns.length
                            ? [ constants.urls.patternLab.patternsHistory + "?" + helper.encodeQueryData(this.getQueryData(assets, patterns)) ]
                            : []
        this.tableKey += 1 // force reload of fancy-table component
      },

      rowsCreator(responseData) {
        this.patternsStats = {
          total: 0,
          bullish: 0,
          bearish: 0
        }
        this.assets = []
        this.patterns = []
        let rows = []  
        let patternsByAsset = {} 
        let assetsByPattern = {}      

        responseData.forEach(data => {
          if (data.count) {
            let row = []
            let direction = this.createRow(data, row)
            rows.push(row);

            if (!this.assets.map(a => a.id).includes(data.history.ticker.id)) {
              this.assets.push({
                id: data.history.ticker.id,
                symbol: data.history.ticker.symbol
              }) 
            }            
            if (!this.patterns.map(p => p.id).includes(data.pattern.id)) {
              this.patterns.push({
                id: data.pattern.id,
                name: data.pattern.name
              })
            }

            this.updatePatternsStats(direction, data.count)

            // updating pie charts data
            if (!(data.history.ticker.symbol in patternsByAsset)) {
              patternsByAsset[data.history.ticker.symbol] = {}              
            }
            if (!(data.pattern.name in patternsByAsset[data.history.ticker.symbol])) {
              patternsByAsset[data.history.ticker.symbol][data.pattern.name] = 0              
            }
            patternsByAsset[data.history.ticker.symbol][data.pattern.name] += data.count

            if (!(data.pattern.name in assetsByPattern)) {
              assetsByPattern[data.pattern.name] = {}              
            }
            if (!(data.history.ticker.symbol in assetsByPattern[data.pattern.name])) {
              assetsByPattern[data.pattern.name][data.history.ticker.symbol] = 0              
            }
            assetsByPattern[data.pattern.name][data.history.ticker.symbol] += data.count
          }
        });

        // setting valid value of selected asset and pattern
        if (!this.selectedAsset || !this.assets.map(a => a.id).includes(this.selectedAsset.id)) {
          this.selectedAsset = this.assets[0]
        }
        if (!this.selectedPattern || !this.patterns.map(p => p.id).includes(this.selectedPattern.id)) {
          this.selectedPattern = this.patterns[0]
        }

        // creating pie charts data
        this.chartData.patternsByAsset = this.createChartData(patternsByAsset[this.selectedAsset.symbol])
        this.chartData.assetsByPattern = this.createChartData(assetsByPattern[this.selectedPattern.name])

         // force reload of fancy-card component
        this.cardKey += 1
        
        return rows
      },
      createRow(data, row) {
        row.push(data.history.ticker.symbol) // Asset
        row.push(data.pattern.name) // Pattern
        row.push(data.count) // # of occurence          
        row.push(data.signal_set.length) // Pattern length

        let directionNr = 0
        data.signal_set.forEach(signal => directionNr += signal.direction) // to-do: how to calculate overall direction?
        let direction = helper.convertDirection(directionNr)
        row.push(direction) // Direction

        row.push(data.count_mean ? 1 / data.count_mean : null) // Average frequency

        if (direction === constants.strings.bullish) {
          row.push(data.d1_bull_up * 100 + ' %')  // 1 day up_down
          row.push(data.d5_bull_up * 100 + ' %')  // 5 days up_down
          row.push(data.d10_bull_up * 100 + ' %') // 10 days up_down
        } else if (direction === constants.strings.bearish) {
          row.push(data.d1_bear_down * 100 + ' %')
          row.push(data.d5_bear_down * 100 + ' %')
          row.push(data.d10_bear_down * 100 + ' %')
        }

        return direction
      },
      updatePatternsStats(direction, count) {
        this.patternsStats.total += count

        if (direction === constants.strings.bullish) {
          this.patternsStats.bullish += count
        } else if (direction === constants.strings.bearish) {
          this.patternsStats.bearish += count
        }
      },
      createChartData(items) {
        return {
          datasets: [{
            data: Object.values(items),
            backgroundColor: Object.keys(items).map(_ => "#"+((1<<24)*Math.random()|0).toString(16)) // random colors
          }],
          labels: Object.keys(items)
        }
      },

      selectAsset(asset) {
        this.selectedAsset = asset
      },
      selectPattern(pattern) {
        this.selectedPattern = pattern
      },

      notifyAudio(audioEl, type, msg) {
        document.getElementById(audioEl).play();

        this.$notify({
          type: type, 
          message: msg
        })
      },

      getQueryData(assets, patterns) {
        let data = {}

        data['patterns'] = patterns.map(sp => sp.id)
        data['symbols'] = assets.map(sa => sa.symbol)
        data['timeframe'] = 1
        
        return data
      }
    },

    mounted() {
      this.initTable();
    }
  }  
</script>
<style>
  .table > thead > tr > th {
    font-size: inherit
  }

  .dd {
    float: left;
    width: 10%
  }
</style>