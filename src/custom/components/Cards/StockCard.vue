<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card --> 
      <div class="col-lg-4 col-md-12">
        <card class="card">
          <section v-if="errored">
            <p>{{$t('errorPrefix') + " " + $t('research.stockPickingLab.stock').toLowerCase() + ". " + $t('errorSuffix')}}</p>
          </section>
          <section v-else>
            <div v-if="loading">{{$t('loading') + " " + $t('research.stockPickingLab.stock').toLowerCase() + "..."}}</div>
            <div v-else>
                <h4 class="card-title">{{title}}</h4>
                <div style="width:50%; float: left;">
                  <p>{{$t('cagr')}}: {{stats.cagr | roundToFixed}}</p>
                  <p>{{$t('stdDev')}}: {{stats.stdDev | roundToFixed}}</p>
                </div>
                <div style="width:50%; float: right;">
                  <p>{{$t('sharpeRatio')}}: {{stats.sharpeRatio | roundToFixed}}</p>                  
                  <p>{{$t('recoveryDDtime')}}: {{stats.recoveryDDtime | roundToFixed}}</p>
                  <p>{{$t('maxDD')}}: {{stats.maxDD | roundToFixed}}</p>
                </div>
            </div>
          </section>
        </card>
      </div>
      <div class="col-lg-8 col-md-12">
        <card type="chart">
          <div class="chart-area">
            <!-- to-do: errored and loading sections not working -->
            <!-- to-do: use it also in another custom cards -->
            <section v-if="errored">
              <p>{{$t('errorPrefix') + " " + $t('research.stockPickingLab.chart').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else>
              <div v-if="loading">{{$t('loading') + " " + $t('research.stockPickingLab.chart').toLowerCase() + "..."}}</div>
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
     <!-- </card> -->
    </div>
</template>
<script>
import Card from "@/components/Cards/Card.vue";
import LineChart from '@/components/Charts/LineChart';
import * as chartConfigs from '@/components/Charts/config';
import config from '@/config';


export default {
  name: "stock-card",
  components: {
    Card,
    LineChart
  },
  props: {
    title: {
      type: String,
      description: "Stock title"
    },
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
  },
  filters: {
    roundToFixed(value) {
      return value.toFixed(2)
    }
  }
};
</script>
<style>
</style>