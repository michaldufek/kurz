<template>
  <card type="chart">
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div class="card-header">
      <h4 v-if="showTitle" slot="header" class="card-title" style="float: left; margin-bottom: 20px">{{title}}</h4>
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

import axios from '@/../node_modules/axios';
import config from '@/config';
import helper from '@/custom/assets/js/helper';
import constants from '@/custom/assets/js/constants';

const defaultDatasets = {
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
  pointRadius: 4
}


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
    showTitle: {
      type: Boolean,
      default: false,
      description: "Whether to show chart title"
    },
    apiUrls: {
      type: Array,
      default: () => {
        return []
      },
      description: "URLs to API data sources"
    }
  },
  data() {
    return {
      updateTs: null,
      live: false,
      error: false,
      loading: false,
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
      },
      chartData: {
        datasets: [{
          ...defaultDatasets,
          data: []
        }],
        labels: []      
      }
    }
  },
  computed: {
    isError() {
      return !this.chartData.datasets[0].data.length && this.error
    }
  },
  methods: {
    initTablesData() {
      this.loadTablesData();
        
      setInterval(() => { 
        this.loadTablesData();
      }, constants.dataReloadInterval );
    },

    nearestValue(label, labels, data) {
      // finds label's value or nearest left neighbour
      let val = 0
      let i = 0

      labels.forEach(oldLabel => {
        if (label === oldLabel) {
          // label is from this array
          val = data[i]
        } else if (label > oldLabel) {
          // we are in another array so get last known value
          if (i === labels.length - 1) {
            // at the end of array
            val = data[i]
          } else if (label < labels[i+1]) {            
            val = data[i]
          }
        }
        // otherwise iterate further
        i++
      })

      return val
    },

    loadTablesData() {
      this.chartData = {
        datasets: [{
          ...defaultDatasets,
          data: []
        }],
        labels: []
      } 

      this.apiUrls.forEach(apiUrl => {
        this.loading = true

        axios
        .get(apiUrl)
        .then(response => {
          // add new dates and sort it
          let allLabels = this.chartData.labels.concat(helper.formatDateTimes(response.data.time)).sort()
          let allData = []
          // aggregate values for all dates
          allLabels.forEach(label => {
            let aggValue = this.nearestValue(label, this.chartData.labels, this.chartData.datasets[0].data)
                            + this.nearestValue(label, helper.formatDateTimes(response.data.time), response.data.equity)

            // add to final data array
            allData.push(aggValue)
          })

          this.chartData = {
            datasets: [{
              ...defaultDatasets,
              data: allData
            }],
            labels: allLabels
          }        

          this.error = false
          this.live = this.live || !response.data.WARNING

          if (!this.updateTs) {
            this.updateTs = response.data.report_timestamp
          }
          this.updateTs = [this.updateTs, response.data.report_timestamp].sort()[1] // get last report TimeStamp
        })
        .catch(error => {
          console.log(error);

          this.error = this.error && true // to-do: test it works OK
          // this.live = false            // to-do: ------ || ------
          this.notifyAudio('connectionLost', 'danger', this.$t('notifications.connectionLost') + '(' + this.title + ' chart)')
        })
        .finally(() => {
          this.loading = false
        });
      })
    },

    notifyAudio(audioEl, type, msg) {
      document.getElementById(audioEl).play();

      this.$notify({
        type: type, 
        message: msg
      })
    }
  },

  mounted() {
    this.initTablesData();
  }
};
</script>
<style>
</style>