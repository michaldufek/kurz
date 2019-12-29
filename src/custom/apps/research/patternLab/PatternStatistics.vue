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
                    :values="stats">
        </fancy-card>

        <card>
        </card>

        <card>
        </card>
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

  import constants from '@/custom/assets/js/constants';


  export default {
    components: {  
      FancyTable,
      FancyCard
    },

    data() {
      return {
        stats: [ 1540, 540, 1000 ]
      }
    },

    computed: {
      patternsHistoryUrl() {
        return [ constants.urls.patternLab.patternsHistory + "?patterns=1,2,3&symbols=MSFT,TSLA&timeframe=1" ]
      }
    },

    methods: {
      notifyAudio(audioEl, type, msg) {
        document.getElementById(audioEl).play();

        this.$notify({
          type: type, 
          message: msg
        })
      },

      // getQueryData() {
      //   let data = {}

      //   data['patterns'] = this.checkedPatterns.map(chp => chp.id).join(',')
      //   data['symbols'] = this.selectedAsset.symbol // or can be more selected ?
      //   data['timeframe'] = this.getTimeframeQuery()
        
      //   return data
      // },
    }
  }  
</script>
<style>
  .form-control {
    box-shadow: gray 0px 0px 7px;
  }

  .dropdown input {
    box-shadow: gray 0px 0px 7px;
    width: 94%;
    text-align: center;
    background-color: transparent;
    border-radius: 0.4285rem !important;
    background: transparent !important;
    color: gray !important;
    border: none !important;
    min-width: 100% !important;
  }

  /* .dropdown:focus { // to-do: this focus should be on all inputs (ie.dtpicker, dropdowns)
    border-color: #1d8cf8 !important
  } */

  .dropdown .dropdown-content {
    background-color: darkslategrey !important;
    border-radius: 0.4285rem;
    opacity: 0.8;
    min-width: 100% !important;
    border: none !important;
    box-shadow: gray 0px 0px 7px !important;
  }

  .table > thead > tr > th {
    font-size: inherit
  }
</style>