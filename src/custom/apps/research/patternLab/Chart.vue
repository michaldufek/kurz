<template>
  <div>
    <div class="row">
      <div class="col-lg-3 col-md-12 container">
        <div class="col-xs-3">
          <div class="controls">
            <table class="table tablesorter">
              <tbody>
                <tr>
                  <!-- <slot :row="item"> -->
                  <td style="border-top: 0px;">
                    {{ $t("research.patternLab.chart.from") }}: 
                  </td>
                  <td style="border-top: 0px;">
                    <input class="datepicker form-control datepicker-input" type="text"/>
                  </td>
                  <!-- </slot> -->
                </tr>
                <tr>
                  <!-- <slot :row="item"> -->
                  <td style="border-top: 0px; text-align: right">
                    {{ $t("research.patternLab.chart.to") }}: 
                  </td>
                  <td style="border-top: 0px;">
                    <input class="datepicker form-control datepicker-input" type="text"/>
                  </td>
                  <!-- </slot> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-lg-6 col-md-12">
        <fancy-chart :fullTitle="$t('sidebar.patternLab') + ' ' + $t('research.patternLab.chart.title').toLowerCase()">
                     <!-- :apiUrls="apiUrls(forChart=true)"> -->
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

  import FancyTable from '@/custom/components/FancyTable';
  import '@/custom/assets/js/bootstrap-datepicker.js';

  export default {
    components: {
      FancyTable
    },

    computed: {
      patternsHistoryUrl() {
        return [ "https://dev.analyticalplatform.com/api/pl/Backtests?patterns=1&symbols=MSFT&timeframe=1" ]
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
    width: 35%;
    text-align: center;
  }
</style>