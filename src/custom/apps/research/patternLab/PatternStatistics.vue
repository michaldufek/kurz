<template>
  <div>
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div class="row">
      <div class="col-lg-3 col-md-12 container">
        <fancy-card :title="$t('research.patternLab.patternStatistics.title') + ' - ' + $t('research.patternLab.patternStatistics.statistics.title')"
                    :fullTitle="$t('research.patternLab.patternStatistics.statistics.title')"
                    :showTitle="true"
                    :items="$t('research.patternLab.patternStatistics.statistics.items')"
                    :proportion="1"
                    :values="stats"
                    style="margin-bottom: 0px;">
        </fancy-card>

        <div style="position: relative; left: 10px; top: 50px; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="selectedAsset ? selectedAsset.symbol : null"
                         style="width: 20%">
            <ul style="list-style-type: none;">
              <li v-for="asset in selectedAssets.map(sa => sa.symbol)">            
                <a class="dropdown-item" 
                   @click="selectedAsset = asset" 
                   href="#">
                  {{ asset }}
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
              <li v-for="pattern in selectedPatterns.map(sp => sp.name)">            
                <a class="dropdown-item" 
                   @click="selectedPattern = pattern" 
                   href="#">
                  {{ pattern }}
                </a>
              </li>
            </ul>
          </base-dropdown>
        </div>
        <pie-chart-card :title="$t('research.patternLab.patternStatistics.title') + ' - ' + $t('research.patternLab.patternStatistics.stocksByPattern')" />
      </div>

      <div class="col-lg-9 col-md-12">
        <fancy-table :showTitle="false"
                     :apiUrls="patternsHistoryUrl"
                     :columns="$t('research.patternLab.patternStatistics.patterns')">
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
        stats: [ 1540, 540, 1000 ],
        selectedAsset: null,
        selectedAssets: [],
        selectedPattern: null,
        selectedPatterns: []
      }
    },

    computed: {
      patternsHistoryUrl() {
        return this.selectedPattern && this.selectedAsset 
               ? [ constants.urls.patternLab.patternsHistory + "?" + helper.encodeQueryData(this.getQueryData()) ]
               : []
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