<template>
  <div>
    <div class="row">
      <div class="col-lg-2 col-md-12 container">
        <div class="col-xs-3">
          <div class="controls">
            <table class="table tablesorter">
              <tbody>
                <tr>
                  <!-- <slot :row="item"> -->
                  <td style="border-top: 0px; text-align: right">
                    {{ $t("research.patternLab.chart.from") }}: 
                  </td>
                  <td style="border-top: 0px; width: 65%">
                    <input class="datepicker form-control datepicker-input" type="text"/>
                  </td>
                  <!-- </slot> -->
                </tr>
                <tr>
                  <!-- <slot :row="item"> -->
                  <td style="border-top: 0px; text-align: right">
                    {{ $t("research.patternLab.chart.to") }}: 
                  </td>
                  <td style="border-top: 0px; width: 65%">
                    <input class="datepicker form-control datepicker-input" type="text"/>
                  </td>
                  <!-- </slot> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <card style="text-align: center;">
          <base-input :label="$t('research.patternLab.chart.assets')" type="search" :placeholder="$t('research.patternLab.chart.enterAsset')">
          </base-input>
        </card>
        <card style="text-align: center;">
          <base-input :label="$t('research.patternLab.chart.patterns')" type="search" :placeholder="$t('research.patternLab.chart.enterPattern')">
          </base-input>
        </card>
        <base-button native-type="submit" type="secondary" style="width: 100%">{{ $t('research.patternLab.chart.addChart') }}</base-button>
      </div>

      <div class="col-lg-7 col-md-12">
        <fancy-chart :fullTitle="$t('sidebar.patternLab') + ' ' + $t('research.patternLab.chart.title').toLowerCase()"
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
  import $ from 'jquery'

  import FancyChart from '@/custom/components/FancyChart';
  import FancyTable from '@/custom/components/FancyTable';  
  import constants from '@/custom/assets/js/constants';

  import '@/custom/assets/js/bootstrap-datepicker.js';


  export default {
    components: {      
      FancyChart,
      FancyTable
    },

    computed: {
      patternsHistoryUrl() {
        return [ "https://dev.analyticalplatform.com/api/pl/Backtests?patterns=1&symbols=MSFT&timeframe=1" ]
      },
      chartUrl() {
        return [ constants.urls.chart["MF Report"] ]
      }
    },

    mounted () {
      $('.datepicker').datepicker({
        weekStart:1,
        color: 'red'
      });
    }
  }  
</script>
<style>
  @import '../../../assets/css/bootstrap-datepicker.css';

  .datepicker p {
    color: inherit
  }

  .datepicker-input {
    box-shadow: gray 0px 0px 7px;
    text-align: center;
  }
</style>