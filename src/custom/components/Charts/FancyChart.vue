<template>
  <card type="chart">
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div class="card-header">
      <h4 v-if="showTitle" slot="header" class="card-title" style="float: left; margin-bottom: 20px">{{title}}</h4>
      <h5 class="card-title" style="float: right;"><i class="tim-icons icon-heart-2" :class="{ 'text-success': live }" style="color:red"></i>  {{updateTs | chartUpdateTsText}}</h5>
    </div>
    <br/>
    <div class="chart-area" style="height: 425px">
      <section v-if="isError" style="text-align: center">
        <p style="padding-top: 50px">{{ $t('dataError') }}</p>
      </section>
      <section v-else>
        <DualRingLoader v-if="loading" :color="'#54f1d2'" style="width: 80px; height: 80px; position: absolute; top: 40%; left: 45%;" />
        <line-chart v-if="responsive"
                    ref="bigChart"
                    chart-id="big-line-chart"
                    :chart-data="chartData"
                    :gradient-colors="bigLineChart.gradientColors"
                    :gradient-stops="bigLineChart.gradientStops"
                    :extra-options="extraOptions"
                    :height="null"
                    :width="null">
        <!-- height and width nulls is workaround of responsiveness library bug - will be fixed in vue-chartjs v4.0.0 (added as milestone) -->
        </line-chart>
        <line-chart v-else
                    ref="bigChart"
                    chart-id="big-line-chart"
                    :chart-data="chartData"
                    :gradient-colors="bigLineChart.gradientColors"
                    :gradient-stops="bigLineChart.gradientStops"
                    :extra-options="extraOptions">                    
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
    axesLabels: {
      type: Array,
      default: () => [],
      description: "Labels of chart axes"
    },
    apiUrls: {
      type: Array,
      default: () => [],
      description: "URLs to API data sources"
    },
    dataFields: {
      type: Array,
      default: () => {
        return [ 'Close' ]
      },
      description: "Response data fields to use for distinctive lines in chart"      
    },
    range: {
      type: Object,
      default: () => {
        return {}
      },
      description: "Date range of values displayed"
    },
    responsive: {
      type: Boolean,
      description: "Whether chart height should scale by parent height"
    }
  },

  data() {
    return {
      updateTs: null,
      live: false,
      error: false,
      loading: false,

      // chart
      bigLineChart: {
          gradientColors: config.colors.gradients.primaryGradient,
          gradientStops: [1, 0.4, 0],
      },
      chartData: {
        datasets: [{
          ...defaultDatasets,
          data: []
        }],
        labels: []      
      },
      chartMins: [],
      chartMaxes: []
    }
  },

  computed: {
    isError() {
      return !this.chartData.datasets[0].data.length && this.error
    },
    extraOptions() {
      let eOp = chartConfigs.purpleChartOptions

      let dfNr = 0
      this.dataFields.forEach(field => {        
        eOp.scales.yAxes[dfNr].id = field
        eOp.scales.yAxes[dfNr].position = dfNr === 0 ? 'left' : 'right'
        eOp.scales.yAxes[dfNr].ticks.suggestedMin = this.chartMins[dfNr]
        eOp.scales.yAxes[dfNr].ticks.suggestedMax = this.chartMaxes[dfNr]
      })

      eOp.scales.xAxes[0].scaleLabel = {
        display: this.axesLabels.length > 0,
        labelString: this.axesLabels[0]
      }
      eOp.scales.yAxes[0].scaleLabel = {
        display: this.axesLabels.length > 0,
        labelString: this.axesLabels[1]
      }

      return eOp
    }
  },

  methods: {
    initData() {
      this.loadData();
        
      setInterval(() => { 
        this.loadData();
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

    loadData() {
      let finishedLoadings = 0
      let errorLoadings = 0
      if (this.apiUrls.length > 0) {
        this.loading = true
        this.error = false
      }

      this.apiUrls.forEach(apiUrl => {
        this.$http
        .get(apiUrl)
        .then(response => {
          if (!finishedLoadings) {
            let datasets = []
            this.dataFields.forEach(_ => datasets.push({
                ...defaultDatasets,
                data: []
              })
            )

            this.chartData = {
              datasets: datasets,
              labels: []
            } 
          }

          if (!response.data.time) {
            // data in ticker symbol format
            let times = []
            let equities = []
            let firstTime = true

            this.dataFields.forEach(field => {
              let fieldEquities = []

              if (field in response.data) {
                for (const [key, value] of Object.entries(response.data[field])) {
                  if (firstTime) {
                    // times are same for all price fields
                    times.push(Number(key))
                  }
                  fieldEquities.push(value)
                }
              }

              equities.push(fieldEquities)
              firstTime = false
            })            

            var data = {
              time: times,
              equity: equities,
              WARNING: null,
              report_timestamp: helper.formatDateTime(times[times.length - 1])
            }
          } else {
            data = {
              time: response.data.time,
              equity: [ response.data.equity ],
              WARNING: response.data.WARNING,
              report_timestamp: response.data.report_timestamp
            }            
          }

          this.createChartData(data)

          // if at least one source is live we are live
          this.live = this.live || !data.WARNING

          if (!this.updateTs) {
            this.updateTs = data.report_timestamp
          }
          // get last report's TimeStamp
          this.updateTs = [this.updateTs, data.report_timestamp].sort()[1] 
        })
        .catch(error => {
          console.log(error);
          if (++errorLoadings === this.apiUrls.length) {
            this.error = true
          }

          if (error.message === constants.strings.networkError) {
            this.notifyAudio('connectionLost', 'danger', this.$t('notifications.beConnectionLost') + '(' + this.title + ' ' + this.$t('chart') + ')')
          }
        })
        .finally(() => {
          if (++finishedLoadings === this.apiUrls.length) {
            this.loading = false

            if (!this.live && !this.error) {
              this.notifyAudio('connectionLost', 'warning', this.$t('notifications.brokerConnectionLost') + '(' + this.title + ' ' + this.$t('chart') + ')')
            }
          }
        });
      })
    },

    createChartData(data) {
      let datasets = []
      let allLabels = []
      let datasetNr = 0
      
      data.equity.forEach(equity => {
        // add new dates and sort it
        allLabels = this.chartData.labels.concat(
                      helper.formatDateTimes(
                        data.time.filter(
                          t => (('from' in this.range && t >= this.range.from) || (!('from' in this.range)))
                               && (('to' in this.range && this.range.to && t <= this.range.to) || (!('to' in this.range) || (!(this.range.to))))
                        )
                      )
                    )
        let allData = []
        // aggregate values for all dates
        allLabels.forEach(label => {
          let aggValue = this.nearestValue(label, this.chartData.labels, this.chartData.datasets[datasetNr].data)
                          + this.nearestValue(label, helper.formatDateTimes(data.time), equity)

          // add to final data array
          allData.push(aggValue)
        })

        if (Math.min(...allData) < this.chartMins[datasetNr]) {
          this.chartMins[datasetNr] = Math.min(...allData)
        }        
        if (Math.max(...allData) > this.chartMaxes[datasetNr]) {
          this.chartMaxes[datasetNr] = Math.max(...allData)
        }
        // to-do: fix extraOptions recomputation

        let datasetSetting = defaultDatasets  
        let color = Object.values(config.colors)[datasetNr % Object.values(config.colors).length]      
        datasetSetting.borderColor = color
        datasetSetting.pointBackgroundColor = color
        datasetSetting.pointHoverBackgroundColor = color
        
        let dataset = {
          ...datasetSetting,
          data: allData,
        }
        if (allData.length > 0 && this.dataFields.length > 1) {
          dataset.label = this.dataFields[datasetNr++]
        } 

        datasets.push(dataset)  
      })    
      
      this.chartData = {
        datasets: datasets,
        labels: allLabels
      }       
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
    this.dataFields.forEach(_ => {
      this.chartMins.push(Number.MAX_VALUE)
      this.chartMaxes.push(0)
    })    

    this.initData();
  }
};
</script>
<style>
</style>