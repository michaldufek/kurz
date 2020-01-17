<template>
  <div class="row">
    <div class="col-lg-3 col-md-12 container">
      <assets-patterns-picker :title="$t('research.patternLab.alerts.title')"
                              :btnText="$t('research.patternLab.alerts.addAlert')" 
                              :showDatePickers="false"
                              @btnClicked="addAlert" />
    </div>

    <!-- alerts table -->
    <card class="col-lg-9 col-md-12">
      <base-table :data="patternsAssets" 
                  :columns="$t('research.patternLab.alerts.alertsTable')"
                  :sortable="true"
                  :filterable="true">
        <template slot="columns">
          <th>{{ $t('research.patternLab.alerts.alertsTable')[0] }}</th>
          <th>{{ $t('research.patternLab.alerts.alertsTable')[1] }}</th>
          <th style="text-align: center">{{ $t('research.patternLab.alerts.alertsTable')[2] }}</th>
          <th style="text-align: center">{{ $t('research.patternLab.alerts.alertsTable')[3] }}</th>
        </template>  
        <template slot-scope="{row}">
          <td>{{ row[$t('research.patternLab.alerts.alertsTable')[0].toLowerCase()] }}</td>
          <td>{{ row[$t('research.patternLab.alerts.alertsTable')[1].toLowerCase()] }}</td>
          <td style="text-align: center"><input type="checkbox" :value="row[$t('research.patternLab.alerts.alertsTable')[2].toLowerCase()]" v-model="checkedEmailNotifications"></td>
          <td style="text-align: center"><input type="checkbox" :value="row[$t('research.patternLab.alerts.alertsTable')[3].toLowerCase()]" v-model="checkedAppNotifications"></td>
        </template>    
      </base-table>
    </card>
  </div>
</template>
<script>
  import { BaseTable } from '@/components'
  import AssetsPatternsPicker from '@/custom/components/AssetsPatternsPicker'

  import constants from '@/custom/assets/js/constants';
  import helper from '@/custom/assets/js/helper';
  

  export default {
    components: {
      AssetsPatternsPicker,
      BaseTable
    },

    data() {
      return {
        assets: [],
        patterns: [],
        patternsAssets: [],
        checkedEmailNotifications: [],
        checkedAppNotifications: []
      }
    },

    computed: {        
      // alertsUrl() {
      //   return [ constants.urls.patternLab.alerts ]
      // }
    },

    methods: {
      addAlert() {
        let data = helper.getAssetsPatternsPickerData(this.$store)
        if (data) {
          ({ checkedAssets:this.assets, checkedPatterns:this.patterns } = data)
        }

        this.setTableData()
      },
      setTableData() {
        let rows = []

        this.assets.forEach(asset => this.patterns.forEach(pattern => {
          let row = {}

          row[this.$t('research.patternLab.alerts.alertsTable')[0].toLowerCase()] = pattern.name
          row[this.$t('research.patternLab.alerts.alertsTable')[1].toLowerCase()] = asset.symbol
          row[this.$t('research.patternLab.alerts.alertsTable')[2].toLowerCase()] = pattern.name + '|' + asset.symbol
          row[this.$t('research.patternLab.alerts.alertsTable')[3].toLowerCase()] = pattern.name + '|' + asset.symbol

          rows.push(row)
        }))

        this.patternsAssets = rows
      }
    }
  }  
</script>
<style>
</style>]