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
                    :proportion="1"
                    :values="stats"
                    style="margin-bottom: 0px;">
        </fancy-card>

        <!-- pie charts -->
        <div style="position: relative; left: 10px; top: 50px; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="selectedAsset ? selectedAsset.symbol : null"
                         style="width: 20%">
            <ul style="list-style-type: none;">
              <li v-for="asset in selectedAssets">            
                <a class="dropdown-item" 
                   @click="selectAsset(asset)" 
                   href="#">
                  {{ asset.symbol }}
                </a>
              </li>
            </ul>
          </base-dropdown>
        </div>
        <pie-chart-card :title="$t('research.patternLab.patternStatistics.title') + ' - ' + $t('research.patternLab.patternStatistics.patternsByStock')" />

        <div style="position: relative; left: 10px; top: 50px; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="selectedPattern ? selectedPattern.name : null"
                         style="width: 20%">
            <ul style="list-style-type: none;">
              <li v-for="pattern in selectedPatterns">            
                <a class="dropdown-item" 
                   @click="selectPattern(pattern)" 
                   href="#">
                  {{ pattern.name }}
                </a>
              </li>
            </ul>
          </base-dropdown>
        </div>
        <pie-chart-card :title="$t('research.patternLab.patternStatistics.title') + ' - ' + $t('research.patternLab.patternStatistics.stocksByPattern')" />
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
        stats: [ 1540, 540, 1000 ],

        // pie charts
        selectedAsset: null,
        selectedAssets: [],
        selectedPattern: null,
        selectedPatterns: [],

        // patterns table
        patternsUrl: [],
        tableKey: 0
      }
    },

    methods: {
      initData() {
        if ('selectedAssets' in localStorage) {
          this.selectedAssets = JSON.parse(localStorage.selectedAssets)
          this.selectedAsset = this.selectedAssets[0]
        }
        if ('selectedPatterns' in localStorage) {
          this.selectedPatterns = JSON.parse(localStorage.selectedPatterns)
          this.selectedPattern = this.selectedPatterns[0]
        }

        this.loadTable()
      },

      loadTable() {
        this.patternsUrl = this.selectedAsset && this.selectedPattern
                            ? [ constants.urls.patternLab.patternsHistory + "?" + helper.encodeQueryData(this.getQueryData()) ]
                            : []
        this.tableKey += 1 // force reload of fancy-table component
      },
      rowsCreator(responseData) {
        let rows = []


        //   "", 
        //   "Pattern length", 
        //   "Direction", 
        //   "Average frequency", 
        //   "1 day up_down", 
        //   "5 days up_down", 
        //   "10 days up_down"

        responseData.forEach(data => {
            let row = []

            row.push(data.history.ticker.symbol) // Asset
            row.push(data.pattern.name) // Pattern
            row.push(data.count) // # of occurence

            rows.push(row);
          });
        rows.push(['SMB', 'PTRN', 85]); // temp!

        return rows
      },

      selectAsset(asset) {
        this.selectedAsset = asset
        this.loadTable()
      },
      selectPattern(pattern) {
        this.selectedPattern = pattern
        this.loadTable()
      },

      notifyAudio(audioEl, type, msg) {
        document.getElementById(audioEl).play();

        this.$notify({
          type: type, 
          message: msg
        })
      },

      getQueryData() {
        let data = {}

        data['patterns'] = this.selectedPattern.id
        data['symbols'] = this.selectedAsset.symbol // or can be more selected ?
        data['timeframe'] = 1
        
        return data
      }
    },

    mounted() {
      this.initData();
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