<template>
  <div class="row">

    <div class="col-lg-3 col-md-12 container">
      <assets-patterns-picker :title="$t('research.patternLab.alerts.title')"
                              :btnText="$t('research.patternLab.alerts.addAlert')" 
                              :showDatePickers="false"
                              @btnClicked="addAlert" />
    </div>

    <div class="col-lg-9 col-md-12">
      <fancy-table :title="$t(alertsKey + '.title')"
                  :showTitle="false"
                  :apiUrls="alertsUrl"
                  :authorize="true"
                  :rowsCreator="rowsCreator"
                  :columns="$t(alertsKey + '.columns').concat($t(alertsKey + '.columns4check'))"
                  :columns4check="$t(alertsKey + '.columns4check')"
                  @checked="checkedEmit"
                  :sortable="true"
                  :filterable="true"
                  :key="tableKey" />
    </div>

  </div>
</template>
<script>
  import FancyTable from '@/custom/components/Tables/FancyTable';
  import AssetsPatternsPicker from '@/custom/components/AssetsPatternsPicker'

  import constants from '@/custom/assets/js/constants';
  import helper from '@/custom/assets/js/helper';
  
  
  export default {
    components: {
      AssetsPatternsPicker,
      FancyTable
    },

    data() {
      return {
        alertsKey: 'research.patternLab.alerts',
        assetsPatterns: null,
        tableKey: 0
      }
    },

    computed: {        
      alertsUrl() {
        return [ constants.urls.patternLab.alerts ]
      }
    },

    methods: {
      initData() {
        this.assetsPatterns = helper.getAssetsPatternsPickerData(this.$store)
      },

      // emited events
      addAlert() {
        this.assetsPatterns = helper.getAssetsPatternsPickerData(this.$store)

        if (this.assetsPatterns) {
          this.assetsPatterns.checkedAssets.forEach(asset => 
            this.assetsPatterns.checkedPatterns.forEach(pattern =>
              this.$http
              .post(constants.urls.patternLab.alerts, { pattern: pattern.id, ticker: asset.id, /*app: , email:*/ }, this.$store.getItem('headers'))
              .catch(error => console.log(error))))
        }

        this.tableKey++
      },
      checkedEmit(data) {
        // helper.updateStore(this.$store, 'checked', data, this.alertsKey)
      },
      
      rowsCreator(data) {
        let rows = []

        data.forEach(datum => {
          let pName = this.getPatternName(datum.pattern)
          let symbol = this.getAssetSymbol(datum.ticker)

          if (pName && symbol) {
            rows.push([
              pName,
              symbol,
              datum.email, // Email notification
              datum.app    // App notification
            ])
          }
        })

        return rows
      },

      getPatternName(patternId) {
        if (this.assetsPatterns) {
          let patterns = this.assetsPatterns.selectedPatterns.filter(pattern => pattern.id === patternId)
          if (patterns.length) {
            return patterns[0].name
          }
        }
        return null
      },
      getAssetSymbol(assetId) {
        if (this.assetsPatterns) {
          let assets = this.assetsPatterns.selectedAssets.filter(asset => asset.id === assetId)
          if (assets.length) {
            return assets[0].symbol
          }
        }
        return null
      }

    },

    mounted() {
      this.initData()
    }
  }  
</script>
<style>
</style>]