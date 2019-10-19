<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card --> 
      <div class="col-lg-8 col-md-12">
        <card type="chart">
          <div class="card-header">
            <h4 slot="header" class="card-title" style="float: left; margin-bottom: 20px">{{chartData.title}}</h4>
            <h5 class="card-title" style="float: right;"><i class="tim-icons icon-heart-2 text-success"></i>  Updated 3 minutes ago</h5>
          </div>
          <div class="chart-area">
            <!-- to-do: errored and loading sections not working -->
            <!-- to-do: use it also in another custom cards -->
            <section v-if="errored">
              <p>{{$t('errorPrefix') + " " + $t('dashboard.chart').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else>
              <div v-if="loading">{{$t('loading') + " " + $t('dashboard.chart').toLowerCase() + "..."}}</div>
              <line-chart v-if="!loading" style="height: 100%"
                          ref="bigChart"
                          chart-id="big-line-chart"
                          :chart-data="chartData.chartData"
                          :gradient-colors="bigLineChart.gradientColors"
                          :gradient-stops="bigLineChart.gradientStops"
                          :extra-options="bigLineChart.extraOptions">
              </line-chart>
            </section>
          </div>
        </card>
      </div>
      <div class="col-lg-4 col-md-12">
        <card class="card">
          <section v-if="errored">
            <p>{{$t('errorPrefix') + " " + $t('dashboard.performanceStatistics').toLowerCase() + ". " + $t('errorSuffix')}}</p>
          </section>
          <section v-else>
            <div v-if="loading">{{$t('loading') + " " + $t('dashboard.performanceStatistics').toLowerCase() + "..."}}</div>
            <div v-else>
                <div style="width:50%; float: left;">
                  <p>{{$t('ytd')}}: {{stats.ytd | roundToFixed}}</p>
                  <p>{{$t('cagr')}}: {{stats.cagr | roundToFixed}}</p>
                  <p>{{$t('sharpeRatio')}}: {{stats.sr | roundToFixed}}</p>
                </div>
                <div style="width:50%; float: right;">
                  <p>{{$t('maxDD')}}: {{stats.maxdd | roundToFixed}}</p>
                  <p>{{$t('equityOuts')}}: {{stats.equityOuts | roundToFixed}}</p>
                </div>
            </div>
          </section>
        </card>
      </div>
     <!-- </card> -->
    </div>
</template>
<script>
import Card from "@/components/Cards/Card.vue";
import LineChart from '@/components/Charts/LineChart';
import * as chartConfigs from '@/components/Charts/config';
import config from '@/config';


export default {
  name: "strategy-card",
  components: {
    Card,
    LineChart
  },
  props: {
    stats: {
      type: Object,
      default: () => {},
      description: "Statistics data"
    },
    chartData: {
      type: Object,
      default: () => {},
      description: "Chart data"
    },
    errored: false,
    loading: true            
  },
  data() {
      return {
          bigLineChart: 
          {
              chartData: null,
              extraOptions: chartConfigs.purpleChartOptions,
              gradientColors: config.colors.primaryGradient,
              gradientStops: [1, 0.4, 0]
          }        
      }
  }
};
</script>
<style>
</style>