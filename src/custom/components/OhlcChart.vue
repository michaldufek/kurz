<template>
  <card type="chart">
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div class="card-header">
      <h5 class="card-title" style="float: right;"><i class="tim-icons icon-heart-2" :class="{ 'text-success': live }" style="color:red"></i>  {{updateTs | chartUpdateTsText}}</h5>
    </div>
    <br/>
    <div class="chart-area" style="height: 425px">
      <section v-if="isError" style="text-align: center">
        <p style="padding-top: 50px">{{ $t('dataError') }}</p>
      </section>
      <section v-else>
        <DualRingLoader v-if="loading" :color="'#54f1d2'" style="width: 80px; height: 80px; position: absolute; top: 40%; left: 45%;" />
        <!-- <line-chart ref="bigChart"
                    chart-id="big-line-chart"
                    :chart-data="chartData"
                    :gradient-colors="bigLineChart.gradientColors"
                    :gradient-stops="bigLineChart.gradientStops"
                    :extra-options="extraOptions">
        </line-chart> -->
        <div style="width:1000px">
          <canvas id="chart"></canvas>
        </div>
      </section>
    </div>
  </card>
</template>
<script>
import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';

import axios from '@/../node_modules/axios';
import config from '@/config';
import helper from '@/custom/assets/js/helper';
import constants from '@/custom/assets/js/constants';


export default {
  name: "ohlc-chart",
  components: {
    DualRingLoader
  },

  props: {
    apiUrl: {
      type: String,
      default: null,
      description: "URL to API data source"
    },
    range: {
      type: Object,
      default: () => {
        return {}
      },
      description: "Date range of values displayed"
    }
  },

  data() {
    return {
      updateTs: null,
      live: false,
      error: false,
      loading: false,

      // chart
      chartMins: [],
      chartMaxes: []
    }
  },

  computed: {
    isError() {
      return !this.chartData.datasets[0].data.length && this.error
    }
  },

  methods: {
    initData() {
      this.loadData();
        
      setInterval(() => { 
        this.loadData();
      }, constants.dataReloadInterval );
    },

    loadData() {
      let finishedLoadings = 0
      let errorLoadings = 0
      if (this.apiUrls.length > 0) {
        this.loading = true
        this.error = false
      }

      this.apiUrls.forEach(apiUrl => {
        axios
        .get(apiUrl)
        .then(response => {
          this.createChart(data)

          // if at least one source is live we are live
          // this.live = this.live || !data.WARNING

          // if (!this.updateTs) {
          //   this.updateTs = data.report_timestamp
          // }
          // get last report's TimeStamp
          // this.updateTs = [this.updateTs, data.report_timestamp].sort()[1] 
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
          this.loading = false

          if (!this.live && !this.error) {
            this.notifyAudio('connectionLost', 'warning', this.$t('notifications.brokerConnectionLost') + '(' + this.title + ' ' + this.$t('chart') + ')')
          }
        });
      })
    },

    createChart(data) {
      var ctx = document.getElementById('chart').getContext('2d');
      ctx.canvas.width = 1000;
      ctx.canvas.height = 250;
      var chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: 'CHRT - Chart.js Corporation',
            data: this.createChartData(data)
          }]
        },
        options: {
          scales: {
            xAxes: [{
              afterBuildTicks: function(scale, ticks) {
                var majorUnit = scale._majorUnit;
                var firstTick = ticks[0];
                var i, ilen, val, tick, currMajor, lastMajor;

                val = luxon.DateTime.fromMillis(ticks[0].value);
                if ((majorUnit === 'minute' && val.second === 0)
                    || (majorUnit === 'hour' && val.minute === 0)
                    || (majorUnit === 'day' && val.hour === 9)
                    || (majorUnit === 'month' && val.day <= 3 && val.weekday === 1)
                    || (majorUnit === 'year' && val.month === 0)) {
                  firstTick.major = true;
                } else {
                  firstTick.major = false;
                }
                lastMajor = val.get(majorUnit);

                for (i = 1, ilen = ticks.length; i < ilen; i++) {
                  tick = ticks[i];
                  val = luxon.DateTime.fromMillis(tick.value);
                  currMajor = val.get(majorUnit);
                  tick.major = currMajor !== lastMajor;
                  lastMajor = currMajor;
                }
                return ticks;
              }
            }]
          }
        }
      });           
    },
    createChartData(data) {
      let newData = [];

      for (const [key, val] of Object.entries(data.Open)) {
        newData.push({
          t: new Date(Number(key)),
          o: val,
          h: data.High[key],
          l: data.Low[key],
          c: data.Close[key]
        })
      }

      return newData
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