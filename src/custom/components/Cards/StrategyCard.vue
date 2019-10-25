<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card --> 
      <div class="col-lg-8 col-md-12">
        <card type="chart">
          <div class="card-header">
            <h4 slot="header" class="card-title" style="float: left; margin-bottom: 20px">{{title}}</h4>
            <h5 class="card-title" style="float: right;"><i class="tim-icons icon-heart-2" :class="{ 'text-success': live }" style="color:red"></i>  {{updateTs | chartUpdateTsText}}</h5>
          </div>
          <div class="chart-area">
            <!-- to-do: errored and loading sections not working -->
            <!-- to-do: use it also in another custom cards -->
            <!-- <section v-if="isError">
              <p>{{$t('errorPrefix') + " " + $t('dashboard.chart').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else> -->
              <div v-if="loading" style="text-align: center;">{{$t('loading') + " " + $t('dashboard.chart').toLowerCase() + "..."}}</div>
              <line-chart v-else style="height: 100%"
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

      <div class="col-lg-4 col-md-12">
        <card class="card">
          <!-- <section v-if="isError">
            <p>{{$t('errorPrefix') + " " + $t('dashboard.performanceStatistics').toLowerCase() + ". " + $t('errorSuffix')}}</p>
          </section>
          <section v-else> -->
            <div v-if="loading" style="text-align: center;">{{$t('loading') + " " + $t('dashboard.performanceStatistics').toLowerCase() + "..."}}</div>
            <div v-else>
                <div style="width:50%; float: left;">
                  <p>{{$t('ytd')}}: {{statsData.ytd | roundToFixed}}</p>
                  <p>{{$t('cagr')}}: {{statsData.cagr | roundToFixed}}</p>
                  <p>{{$t('sharpeRatio')}}: {{statsData.sr | roundToFixed}}</p>
                </div>
                <div style="width:50%; float: right;">
                  <p>{{$t('maxDD')}}: {{statsData.maxdd | roundToFixed}}</p>
                  <p>{{$t('equityOuts')}}: {{statsData.equityOuts | roundToFixed}}</p>
                </div>
            </div>
          <!-- </section> -->
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
    title: {
      type: String,
      description: "Chart title"
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
    statsData: {
      type: Object,
      default: () => {
        return {
          ytd: null,
          cagr: null,
          sr: null,
          maxdd: null,
          equityOuts: null
        }
      },
      description: "Statistics data"
    },
    loading: {
      type: Boolean,
      default: false,
      description: "Whether data are loading"
    },
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
  },
  computed: {
    isError() {
      return !this.live && !this.chartData.datasets[0].data.length
    }
  }
};
</script>
<style>
</style>