<template>
  <div>
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
              <a href="#" @click="selectAsset(row.symbol)"><td style="font-size: 0.65rem; border: none">{{row.symbol}}</td>
              <td style="font-size: 0.65rem; border: none; border-left: 1px; text-align: left">{{row.name}}</td></a>
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
          <base-table :data="selectedPatterns" :columns="[ 'name' ]">
            <template slot="columns">
              <th></th>
            </template>  
            <template slot-scope="{row}">
              <td style="font-size: 0.65rem; border: none; border-left: 1px; text-align: left">
                <base-checkbox class="chb">{{row.name}}</base-checkbox>
                 <!-- v-model="index" -->
              </td>
            </template>    
          </base-table>
        </card>

        <base-button native-type="submit" type="secondary" style="width: 100%">{{ $t('research.patternLab.chart.addChart') }}</base-button>
      </div>

      <div class="col-lg-7 col-md-12">
        <fancy-chart :title="$t('sidebar.patternLab') + ' ' + $t('research.patternLab.chart.title')"
                     :apiUrls="chartUrl">
        </fancy-chart>
      </div>

      <div class="col-lg-3 col-md-12">
        <fancy-table :title="$t('research.patternLab.chart.patternsHistory.title')"
                     :apiUrls="patternsHistoryUrl"
                     :columns="$t('research.patternLab.chart.patternsHistory.columns')">
        </fancy-table>
      </div>
    </div>
  </div>
</template>
<script>
  import Datepicker from 'vuejs-datepicker';
  import Dropdown from 'vue-simple-search-dropdown';

  import FancyChart from '@/custom/components/FancyChart';
  import FancyTable from '@/custom/components/FancyTable';  
  import { BaseTable } from '@/components'

  import axios from '@/../node_modules/axios';
  import constants from '@/custom/assets/js/constants';


  export default {
    components: {  
      Datepicker,   
      Dropdown,
      FancyChart,
      FancyTable,
      BaseTable   
    },

    data() {
      return {
        from: null,
        to: null,
        selectedAsset: null,
        selectedAssets: [],
        assets: [],
        checkedPatterns: [],
        selectedPatterns: [],
        patterns: []
      }
    },

    computed: {
      dateFormat() {
        return "yyyy-MM-dd"
      },
      disabledDatesFrom() {
        return {
          from: this.to
        }
      },
      disabledDatesTo() {
        return {
          to: this.from
        }
      },
      maxItems() {
        return constants.maxRows
      },
      chartUrl() {
        return [ constants.urls.chart["MF Report"] ]
      },
      patternsHistoryUrl() {
        return [ "https://dev.analyticalplatform.com/api/pl/Backtests?patterns=1&symbols=MSFT&timeframe=1" ]
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
      selectAsset(assetSymbol) {
        this.selectedAsset = assetSymbol
        // to-do: disabledDates acc.to asset chosen (with notifications)
      },
      removeAsset(assetSymbol) {
        this.selectedAssets.splice(this.selectedAssets.map(sa => sa.symbol).indexOf(assetSymbol), 1);
      },
      getAssets(query) {
        // to-do: eliminate component's bug - redudant call for selected item
        if (query) {
          axios
          .get(constants.urls.tickersPL.asset + query)
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
            // to-do: notify error
          })
          .finally(() => {
          })
        }
      },
      getPatterns(query) {
        // to-do: eliminate component's bug - redudant call for selected item        
        if (query) {
          axios
          .get(constants.urls.tickersPL.pattern + query)
          .then(response => {
            debugger
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
            // to-do: notify error
          })
          .finally(() => {
          })
        }
      }
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
</style>