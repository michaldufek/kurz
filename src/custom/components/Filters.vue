<template>
  <div>
     <div>
      <div style="float: left; margin-top: 50px; width: 50%;">
        <h4>{{$t('research.stockPickingLab.filters.metrics')}}</h4>
        <ul style="list-style-type: none; padding-left: 0px;">
          <li >
            <base-checkbox>{{$t('research.stockPickingLab.filters.currency')}}</base-checkbox>
          </li>
          <li >
            <base-checkbox>{{$t('research.stockPickingLab.filters.exchange') + "/" + $t('research.stockPickingLab.filters.index')}}</base-checkbox>
          </li>
          <li >
            <base-checkbox>{{$t('research.stockPickingLab.filters.dividend')}}</base-checkbox>
          </li>
          <li >
            <base-checkbox>{{$t('research.stockPickingLab.filters.riskProfile')}}</base-checkbox>
          </li>
          <li >
            <base-checkbox>{{$t('research.stockPickingLab.filters.sampleMetrics')}}</base-checkbox>
          </li>
        </ul>
        <base-button type="secondary" fill>{{$t('research.stockPickingLab.filters.metricsSettings')}}</base-button>        
      </div>
      <div style="float: right; margin-top: 50px; width: 50%;">
        <h4>{{$t('research.stockPickingLab.filters.title')}}</h4>
        <table>
          <tr>
            <td>{{$t('research.stockPickingLab.filters.currency')}}</td>
            <td>
              <base-dropdown>
                  <ul>
                    <li v-for="currency in $t('research.stockPickingLab.filters.currencies')" style="list-style-type: none; color: black">
                      {{ currency }}
                    </li>
                  </ul>
              </base-dropdown>
            </td>
          </tr>
          <tr>
            <td>{{$t('research.stockPickingLab.filters.exchange')}}</td>
            <td>
              <base-dropdown>
                <ul>
                    <li v-for="exchange in $t('research.stockPickingLab.filters.exchanges')" style="list-style-type: none; color: black">
                      {{ exchange }}
                    </li>
                </ul>
              </base-dropdown>
            </td>
          </tr>
          <tr>
            <td>{{$t('research.stockPickingLab.filters.index')}}</td>
            <td>
              <ul>
                <li v-for="value in $t('research.stockPickingLab.filters.yesNoValues')" style="list-style-type: none; color: black">
                  <base-radio :value="value">
                    {{value}}
                  </base-radio>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>{{$t('research.stockPickingLab.filters.dividend')}}</td>
            <td>
              <ul>
                <li v-for="value in $t('research.stockPickingLab.filters.yesNoValues')" style="list-style-type: none; color: black">
                  <base-radio :value="value">
                    {{value}}
                  </base-radio>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>{{$t('research.stockPickingLab.filters.riskProfile')}}</td>
            <td><base-dropdown></base-dropdown></td>
          </tr>
          <tr>
            <td>{{$t('research.stockPickingLab.filters.sector')}}</td>
            <td><base-dropdown></base-dropdown></td>
          </tr>
        </table>
        <!-- <base-button type="secondary" fill>{{$t('research.stockPickingLab.filters.applyFilters')}}</base-button>         -->
      </div>
    </div> 
    <div style="float: left;margin-top: 100px;">
      <ul>
        <li v-for="stockData in stocksData" style="list-style-type: none;">
          <stock-card :title="stockData.title"
                      :stats="stockData.statsData"
                      :chartData="stockData.chartData"                    
                      :errored="stockData.errored"
                      :loading="stockData.loading">
          </stock-card>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { BaseRadio } from "@/components";
  import StockCard from '@/custom/components/Cards/StockCard.vue';
  import axios from '@/../node_modules/axios';

  export default {
    name: "filters",
    components: {
      BaseRadio,
      StockCard
    },
    data() {
      return { 
        stocksData: []   
      }
    },
    methods: {        
      initStocksData() {
        axios
        .get("https://app1.objectively.info/sp/Ticker")
        .then(response => {
          response.data.results.forEach(result => {
            this.stocksData.push({
              title: result.symbol + " (" + result.info.shortName + ")",
              statsData: {
                cagr: result.compute.cagr,
                stdDev: result.compute.stddev,
                sharpeRatio: result.compute.sharpe_ratio,
                recoveryDDtime: result.compute.recovery_dd_time,
                maxDD: result.compute.max_dd
              },
              chartData: [],
              loading: false
            });
          });          
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          // this.stocksData = data;
        });
      }
    },    
    mounted() {
      this.initStocksData();
    }
  };
</script>
<style>
</style>