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
                  :columns="$t(alertsKey + '.columns')"
                  :sortable="true"
                  :filterable="true"
                  :key="tableKey" />
    </div>
    <!-- alerts table -->
    <!-- <card class="col-lg-9 col-md-12">
      <base-table :data="patternsAssets" 
                  :columns="$t(tableKey)"
                  :sortable="true"
                  :filterable="true">
        <template slot="columns">
          <th>{{ $t()[0] }}</th>
          <th>{{ $t(tableKey)[1] }}</th>
          <th style="text-align: center">{{ $t(tableKey)[2] }}</th>
          <th style="text-align: center">{{ $t(tableKey)[3] }}</th>
        </template>  
        <template slot-scope="{row}">
          <td>{{ row[$t(tableKey)[0].toLowerCase()] }}</td>
          <td>{{ row[$t(tableKey)[1].toLowerCase()] }}</td>
          <td style="text-align: center"><input type="checkbox" :value="row[$t(tableKey)[2].toLowerCase()]" v-model="checkedEmailNotifications"></td>
          <td style="text-align: center"><input type="checkbox" :value="row[$t(tableKey)[3].toLowerCase()]" v-model="checkedAppNotifications"></td>
        </template>    
      </base-table>
    </card> -->
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
        checkedEmailNotifications: [],
        checkedAppNotifications: [],

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
      
      rowsCreator(data) {
        let rows = []

        data.forEach(datum => rows.push([
          this.getPatternName(datum.pattern),
          this.getAssetSymbol(datum.ticker)
          // datum.app,
          // datum.email
        ]))

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