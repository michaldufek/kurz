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
          <div class="card-header">
            <h5 class="card-title" style="float: right;"><i class="tim-icons icon-heart-2" :class="{ 'text-success': live }" style="color:red"></i>  {{updateTs | chartUpdateTsText}}</h5>
          </div>
          <div class="chart-area">
            <!-- to-do: errored and loading sections not working -->
            <!-- to-do: use it also in another custom cards -->
            <!-- <section v-if="errored">
              <p>{{$t('errorPrefix') + " " + $t('research.stockPickingLab.chart').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else> -->
              <div v-if="loading">{{$t('loading') + " " + $t('research.stockPickingLab.chart').toLowerCase() + "..."}}</div>
              <line-chart v-if="!loading" style="height: 100%"
                          ref="bigChart"
                          chart-id="big-line-chart"
                          :chart-data="chartData"
                          :gradient-colors="bigLineChart.gradientColors"
                          :gradient-stops="bigLineChart.gradientStops"
                          :extra-options="bigLineChart.extraOptions">
              </line-chart>
            <!-- </section> -->
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
      default: () => {
        return {
          datasets: [{
            fill: true,
            borderColor: null, // config.colors.primary
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: null, // config.colors.primary
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: null, // config.colors.primary
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [] // numbers
          }],
          labels: [] // datetimes
        }
      },
      description: "Chart data"
    },
    errored: false,
    loading: true,
    live: {
      type: Boolean,
      default: false,
      description: "Whether we have connection to data source"
    },
    updateTs: {
      type: Number,
      default: null,
      description: "TimeStamp of last update"
    }          
  },
  data() {
      return {
          bigLineChart: 
          {
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