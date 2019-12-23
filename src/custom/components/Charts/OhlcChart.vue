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
        <Ohlc v-if="type === $t('research.patternLab.chart.chartTypes')[1]"
              :chart-data="datacollection" 
              :options="options"/>
        <Candlestick v-else
              :chart-data="datacollection" 
              :options="options"/>
      </section>
    </div>
  </card>
</template>
<script>
import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';
import Ohlc from '@/custom/components/Charts/Ohlc';
import Candlestick from '@/custom/components/Charts/Candlestick';

import axios from '@/../node_modules/axios';
import constants from '@/custom/assets/js/constants';


export default {
  name: "ohlc-chart",
  components: {
    DualRingLoader,
    Ohlc,
    Candlestick
  },

  props: {
    apiUrl: {
      type: String,
      description: "URL to API data source"
    },
    type: {
      type: String,
      description: "Type of chart - OHLC or Candlestick"
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
      datacollection: {},
      options: {
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: true,
            },
          }],
        },
      }
    }
  },

  computed: {
    isError() {
      return this.datacollection.datasets && !this.datacollection.datasets.length && this.error
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
      this.loading = true
      this.error = false
      
      axios
      .get(this.apiUrl)
      .then(response => {
        this.fillChartData(response.data)

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
        this.error = true

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
    },

    fillChartData(data) {
      this.datacollection = {
        datasets: [
          {
            label: 'Series 1',
            backgroundColor: '#f87979',
            data: this.createChartData(data),
          },
        ]
        ,
      };
    },

    createChartData(data) {
      let newData = [];

      for (const [key, val] of Object.entries(data.Open)) {
        newData.push({
          t: new Date(Number(key)), //new Date('2019-01-14').getTime(),
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
    this.initData();
  }
};
</script>
<style>
</style>