<template>
  <card type="chart">
    <div class="card-header">
      <h4 slot="header" class="card-title" style="float: left; margin-bottom: 20px">{{title}}</h4>
      <h5 class="card-title" style="float: right;"><i class="tim-icons icon-heart-2" :class="{ 'text-success': live }" style="color:red"></i>  {{updateTs | chartUpdateTsText}}</h5>
    </div>
    <br/>
    <div class="chart-area" style="height: 400px">
      <section v-if="isError" style="text-align: center">
        <p >{{$t('errorPrefix') + " " + $t('dashboard.chart').toLowerCase() + ". " + $t('errorSuffix')}}</p>
      </section>
      <section v-else>
        <DualRingLoader v-if="loading" :color="'#54f1d2'" style="width: 80px; height: 80px;position: absolute;top: 40%;left: 45%;" />
        <line-chart ref="bigChart"
                    chart-id="big-line-chart"
                    :chart-data="chartData"
                    :gradient-colors="bigLineChart.gradientColors"
                    :gradient-stops="bigLineChart.gradientStops"
                    :extra-options="bigLineChart.extraOptions">
        </line-chart>
      </section>
    </div>
  </card>
</template>
<script>
import LineChart from '@/components/Charts/LineChart';
import * as chartConfigs from '@/components/Charts/config';
import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';
import config from '@/config';


export default {
  name: "fancy-chart",
  components: {
    LineChart,
    DualRingLoader
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
              borderColor: config.colors.primary,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.primary,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: config.colors.primary,
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: []
            }],
            labels: []
          }        
      },
      description: "Chart data"
    },
    loading: {
      type: Boolean,
      default: false,
      description: "Whether data are loading"
    },
    error: {
      type: Boolean,
      default: false,
      description: "Whether there is error loading data"
    },
    live: {
      type: Boolean,
      default: false,
      description: "Whether we have connection to data source"
    },
    updateTs: {
      type: String,
      default: null,
      description: "TimeStamp of last update"
    }
  },
  data() {
    return {
      bigLineChart: {
          allData: [
            [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
            [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
            [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
          ],
          activeIndex: 0,
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
          categories: []
      } 
    }
  },
  computed: {
    isError() {
      return !this.chartData.datasets[0].data.length && this.error
    }
  }
};
</script>
<style>
</style>