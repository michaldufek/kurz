<template>
  <div>
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div class="row">
      <div class="col-lg-2 col-md-12 container">

        <!-- date pickers -->
        <div class="col-xs-3">
          <div class="controls">
            <table class="table tablesorter">
              <tbody>
                <tr>
                  <!-- <slot :row="item"> -->
                  <td style="border-top: 0px; text-align: right">
                    {{ $t("research.patternLab.chart.from") }}: 
                  </td>
                  <td style="border-top: 0px;">
                    <datepicker v-model="from" :disabled-dates="disabledDatesFrom" :clear-button="true" :format="dateFormat" :placeholder="$t('research.patternLab.pickDate')"></datepicker>
                  </td>
                  <!-- </slot> -->
                </tr>
                <tr>
                  <!-- <slot :row="item"> -->
                  <td style="border-top: 0px; text-align: right">
                    {{ $t("research.patternLab.chart.to") }}: 
                  </td>
                  <td style="border-top: 0px;">
                    <datepicker v-model="to" :disabled-dates="disabledDatesTo" :clear-button="true" :format="dateFormat" :placeholder="$t('research.patternLab.pickDate')"></datepicker>
                  </td>
                  <!-- </slot> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- assets -->
        <card style="text-align: center;">
          <label>{{ $t('research.patternLab.assets') }}</label>
          <Dropdown :options="assets"
                    :disabled="false"
                    name="ddAssets"
                    :maxItem="maxItems"
                    :placeholder="$t('research.patternLab.type2search')"
                    @filter="getAssets"
                    @selected="ddSelectAsset">
          </Dropdown>
          <base-table :data="selectedAssets" :columns="[ 'symbol', 'name' ]">
            <template slot="columns">
              <th></th>
              <th></th>
            </template>  
            <template slot-scope="{row}">
              <a href="#" @click="selectAsset(row)">
                <div :class="{ 'selectedAsset': selectedAsset && selectedAsset.symbol === row.symbol }">
                  <td style="font-size: 0.65rem; border: none">{{row.symbol}}</td>
                  <td style="font-size: 0.65rem; border: none; border-left: 1px; text-align: left">{{row.name}}</td>
                </div>
              </a>
              <td class="td-actions text-right" style="border: none">
                <base-button size="sm" icon @click="removeAsset(row.symbol)" style="height: 1rem;width: 1rem;min-width: 1rem;font-size: 0.5rem;">
                  <i class="tim-icons icon-simple-remove"></i>
                </base-button>
              </td>
            </template>    
          </base-table>
        </card>

        <!-- patterns -->
        <card style="text-align: center;">
          <label>{{ $t('research.patternLab.patterns') }}</label>
          <Dropdown :options="patterns"
                    :disabled="false"
                    name="ddPatterns"
                    :maxItem="maxItems"
                    :placeholder="$t('research.patternLab.type2search')"
                    @filter="getPatterns"
                    @selected="ddSelectPattern">
          </Dropdown>
          <ul style="list-style-type: none; text-align: left; margin-top: 15px;">
            <li v-for="selectedPattern in selectedPatterns">   
              <input type="checkbox" :id="selectedPattern.id" :value="selectedPattern.id" v-model="checkedPatterns">
              <label :for="selectedPattern.id" style="margin-left: 10px">{{ selectedPattern.name }}</label>
            </li>
          </ul> 
        </card>

        <!-- Add chart button -->
        <base-button native-type="submit" type="secondary" @click="addChart" style="width: 100%">{{ $t('research.patternLab.chart.addChart') }}</base-button>
      </div>

      <!-- chart -->
      <div class="col-lg-7 col-md-12">
        <!-- chart settings -->
        <div style="position: relative; left: 10px; top: 10px; z-index: 1">
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="chartType"
                         style="width: 20%">
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
          <base-dropdown class="dd" 
                         menu-classes="dropdown-black" 
                         title-classes="btn btn-secondary"
                         :title="timeframe">
            <ul style="list-style-type: none;">
              <li v-for="timeframe in $t('research.patternLab.chart.timeframes').filter(el => el !== timeframe)">            
                <a class="dropdown-item" 
                   @click="selectTimeframe(timeframe)" 
                   href="#">
                  {{ timeframe }}
                </a>
              </li>
            </ul>
          </base-dropdown>
        </div>

        <fancy-chart v-if="chartType === $t('research.patternLab.chart.chartTypes')[0]"
                     :title="$t('sidebar.patternLab') + ' ' + $t('research.patternLab.chart.title')"
                     :apiUrls="[ lineChartUrl ]"
                     :dataFields="[ 'Close', 'Volume' ]"
                     :range="{ from: this.from, to: this.to }"
                     :responsive="true"
                     style="top: -45px; height: 100%"
                     :key="lineChartKey" />
                      <!-- height: 830px -->
        <ohlc-chart v-else 
                    :apiUrl="lineChartUrl" 
                    :type="chartType"
                    style="top: -45px; height: 830px" 
                    :key="lineChartKey" />
      </div>

      <!-- patterns history -->
      <div class="col-lg-3 col-md-12">
        <fancy-table :title="$t('research.patternLab.chart.patternsHistory.title')"
                     :apiUrls="patternsHistoryUrl"
                     :columns="$t('research.patternLab.chart.patternsHistory.columns')"
                     :key="tableKey">
        </fancy-table>
      </div>
    </div>
  </div>
</template>
<script>
  import Datepicker from 'vuejs-datepicker';
  import Dropdown from 'vue-simple-search-dropdown';

  import FancyChart from '@/custom/components/Charts/FancyChart';
  import OhlcChart from '@/custom/components/Charts/OhlcChart';
  import FancyTable from '@/custom/components/Tables/FancyTable';  
  import { BaseTable } from '@/components'

  import axios from '@/../node_modules/axios';
  import constants from '@/custom/assets/js/constants';
  import helper from '@/custom/assets/js/helper';


  export default {
    components: {  
      Datepicker,   
      Dropdown,
      FancyChart,
      OhlcChart,
      FancyTable,
      BaseTable   
    },

    data() {
      // fixes x-axes label overlapping
      // https://www.chartjs.org/docs/latest/axes/cartesian/?h=autoskip
      return {
        // datepickers
        from: null,
        to: null,

        // assets
        disabledDatesAsset: null,
        selectedAsset: null,
        selectedAssets: [],
        assets: [],

        // patterns
        selectedPatterns: [],
        checkedPatterns: [],
        patterns: [],

        // chart
        chartType: this.$t('research.patternLab.chart.chartTypes')[0],
        timeframe: this.$t('research.patternLab.chart.timeframes')[0],
        lineChartUrl: null,
        lineChartKey: 0,        

        // patterns history
        patternsHistoryUrl: [],
        tableKey: 0
      }
    },

    computed: {
      dateFormat() {
        return "yyyy-MM-dd"
      },
      disabledDatesFrom() {
        return {
          from: this.disabledDatesAsset ? (this.to ? new Date(Math.min(this.to, this.disabledDatesAsset.from)) : this.disabledDatesAsset.from) : this.to,
          to: this.disabledDatesAsset ? this.disabledDatesAsset.to : null
        }
      },
      disabledDatesTo() {
        return {
          from: this.disabledDatesAsset ? this.disabledDatesAsset.from : null,
          to: this.disabledDatesAsset ? (this.from ? new Date(Math.max(this.from, this.disabledDatesAsset.to)) : this.disabledDatesAsset.to) : this.from
        }
      },
      maxItems() {
        return constants.maxRows
      }
    },

    methods: {
      ddSelectAsset(asset) {
        this.ddSelect(asset, asset => asset.symbol, this.selectedAssets)
      },
      ddSelectPattern(pattern) {
        this.ddSelect(pattern, pattern => pattern.name, this.selectedPatterns)
      },
      ddSelect(item, itemKeySelector, selectedItems) {
        if ('id' in item && !selectedItems.map(itemKeySelector).includes(itemKeySelector(item))) {
          selectedItems.push(item)
        }
      },

      selectAsset(asset) {
        if (this.selectedAsset !== asset) {
          this.selectedAsset = asset

          axios
          .get(constants.urls.patternLab.chart + asset.id + '/' + this.getTimeframeQuery()) // to-do: cache this result !
          .then(response => {
            this.disabledDatesAsset = {
              from: new Date(Math.max(...Object.keys(response.data.Close))),    // maximum asset date !
              to: new Date(Math.min(...Object.keys(response.data.Close)))       // minimum asset date !
            }
          })
          .catch(error => {
            console.log(error);
            
            if (error.message === constants.strings.networkError) {
              this.notifyAudio('connectionLost', 'danger', this.$t('notifications.beConnectionLost') + '(' + this.$t('sidebar.patternLab') + ')')
            }
          })
          .finally(() => {
            if (this.from && (this.from < this.disabledDatesAsset.to || this.from > this.disabledDatesAsset.from)) {
              this.from = this.disabledDatesAsset.to
              this.$notify({
                type: 'warning', 
                message: this.$t('notifications.fromChanged') + ' (' + this.$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.chart.title') + ').'
              })
            }
            if (this.to && (this.to > this.disabledDatesAsset.from || this.to < this.disabledDatesAsset.to)) {
              this.to = this.disabledDatesAsset.from
              this.$notify({
                type: 'warning', 
                message: this.$t('notifications.toChanged') + ' (' + this.$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.chart.title') + ').'
              })
            }
          })
        }
      },
      removeAsset(assetSymbol) {
        this.selectedAssets.splice(this.selectedAssets.map(sa => sa.symbol).indexOf(assetSymbol), 1);

        if (this.selectedAsset && this.selectedAsset.symbol === assetSymbol) {
          this.selectedAsset = null
          this.disabledDatesAsset = null
        }
      },
      getAssets(query) {
        // to-do: eliminate component's bug - redudant call for selected item
        if (query) {
          axios
          .get(constants.urls.patternLab.asset + query)
          .then(response => {
            let i = 1
            this.assets = response.data.results
                          .filter(result => !this.selectedAssets.map(sa => sa.symbol).includes(result.symbol))
                          .map(result => { 
                            return {
                              id: i++, 
                              symbol: result.symbol,
                              name: result.name
                            }
                          })
          })
          .catch(error => {
            console.log(error);
            
            if (error.message === constants.strings.networkError) {
              this.notifyAudio('connectionLost', 'danger', this.$t('notifications.beConnectionLost') + '(' + this.$t('sidebar.patternLab') + ')')
            }
          })
          .finally(() => {
          })
        }
      },

      getPatterns(query) {
        // to-do: eliminate component's bug - redudant call for selected item        
        if (query) {
          axios
          .get(constants.urls.patternLab.pattern + query)
          .then(response => {
            let i = 1
            this.patterns = response.data
                          .filter(result => !this.selectedPatterns.map(sp => sp.name).includes(result.name))
                          .map(result => { 
                            return {
                              id: i++, 
                              name: result.name
                            }
                          })
          })
          .catch(error => {
            console.log(error);
            
            if (error.message === constants.strings.networkError) {
              this.notifyAudio('connectionLost', 'danger', this.$t('notifications.beConnectionLost') + '(' + this.$t('sidebar.patternLab') + ')')
            }
          })
          .finally(() => {
          })
        }
      },

      notifyAudio(audioEl, type, msg) {
        document.getElementById(audioEl).play();

        this.$notify({
          type: type, 
          message: msg
        })
      },

      addChart() {
        if (!this.loadChart()) {
          return
        }

        if (this.checkedPatterns.length === 0) {
          this.$notify({
            type: 'warning', 
            message: this.$t('notifications.addChartNoPattern') + ' (' + this.$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.chart.title') + ').'
          })    
          return
        }

        this.patternsHistoryUrl = [ constants.urls.patternLab.patternsHistory + "?" + helper.encodeQueryData(this.getQueryData()) ]
        this.tableKey += 1 // force reload of fancy-table component
      },
      loadChart(notify=true) {
        if (!this.selectedAsset) {
          if (notify) {
            this.$notify({
              type: 'warning', 
              message: this.$t('notifications.addChartNoAsset') + ' (' + this.$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.chart.title') + ').'
            })    
          }
          return false
        }

        this.lineChartUrl = constants.urls.patternLab.chart + this.selectedAsset.id + '/' + this.getTimeframeQuery()
        this.lineChartKey += 1 // force reload of fancy-chart component

        return true
      },      

      selectChartType(chartType) {
        this.chartType = chartType
        this.loadChart(false)
      },
      selectTimeframe(timeframe) {
        this.timeframe = timeframe
        this.loadChart(false)
      },

      getTimeframeQuery() {
        return this.$t('research.patternLab.chart.timeframes').indexOf(this.timeframe) + 1
      },
      getQueryData() {
        let data = {}

        data['patterns'] = this.checkedPatterns.join(',')
        data['symbols'] = this.selectedAsset.symbol // or can be more selected ?
        data['timeframe'] = this.getTimeframeQuery()
        
        return data
      },
    }
  }  
</script>
<style>
  .form-control {
    box-shadow: gray 0px 0px 7px;
  }

  .dropdown input,
  .vdp-datepicker span,
  .vdp-datepicker input {
    box-shadow: gray 0px 0px 7px;
    width: 94%;
    text-align: center;
    background-color: transparent;
    border-radius: 0.4285rem !important;
    color: gray; 
    border: none;
  }

  .vdp-datepicker span {
    box-shadow: none;    
    color: inherit; 
  }

    .dropdown input {
    background: transparent !important;
    color: gray !important;
    border: none !important;
    min-width: 100% !important;
  }

  /* .dropdown:focus { // to-do: this focus should be on all inputs (ie.dtpicker, dropdowns)
    border-color: #1d8cf8 !important
  } */

  .dropdown .dropdown-content,
  .vdp-datepicker__calendar {
    background-color: darkslategrey !important;
    border-radius: 0.4285rem;
    opacity: 0.8;
    min-width: 100% !important;
    border: none !important;
    box-shadow: gray 0px 0px 7px !important;
  }

  .disabled {
    color: gray !important
  }

  .day__month_btn up {
    color: white !important
  }

  .vdp-datepicker__calendar header .prev:not(.disabled):hover, .vdp-datepicker__calendar header .next:not(.disabled):hover, .vdp-datepicker__calendar header .up:not(.disabled):hover {
    background: darkgray !important
  }

  .selectedAsset {
    background-color: #1d8cf8;
    border-radius: 0.4285rem
  }
</style>