<template>
  <card type="chart">
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div class="card-header">
      <h5 class="card-title" style="float: right;"><i class="tim-icons icon-heart-2" :class="{ 'text-success': live }" style="color:red"></i>  {{ updateTs | chartUpdateTsText(loading) }}</h5>
    </div>
    <br/>
    <div class="chart-area" style="height: 425px">
      <section v-if="noData" style="text-align: center">
        <p style="padding-top: 50px">{{ $t('noData') }}</p>
      </section>
      <section v-else-if="isError" style="text-align: center">
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

import constants from '@/custom/assets/js/constants';
import helper from '@/custom/assets/js/helper';


export default {
  name: "ohlc-chart",
  components: {
    DualRingLoader,
    Ohlc,
    Candlestick
  },

  props: {
    title: {
      type: String,
      description: "Chart title"
    },
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
    noData() {
      return !this.loading && (!('datasets' in this.datacollection) || !this.datacollection.datasets.length)
    },
    isError() {
      return this.error
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
      
      this.$http
      .get(this.apiUrl)
      .then(response => {
        this.fillChartData(response.data)
        this.updateTs = new Date(Number(Math.max(...Object.keys(response.data.Open))))
      })
      .catch(error => {
        console.log(error);
        this.error = true

        if (error.message === constants.strings.networkError) {
          helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', this.$t('notifications.beConnectionLost') + '(' + this.title + ' ' + this.$t('chart') + ')')
        }
      })
      .finally(() => {
        this.loading = false

        if (!this.live && !this.error) {
          helper.notifyAudio(this, document.getElementById('connectionLost'), 'warning', this.$t('notifications.brokerConnectionLost') + '(' + this.title + ' ' + this.$t('chart') + ')')
        }
      });
    },

    fillChartData(data) {
      let newData = [];

      let filteredData = Object.entries(data.Open).filter(
                          t => (('from' in this.range && new Date(Number(t[0])) >= this.range.from) || (!('from' in this.range)))
                               && (('to' in this.range && this.range.to && new Date(Number(t[0])) <= this.range.to) || (!('to' in this.range) || (!(this.range.to))))
                         )
      for (const [_, [key, val]] of Object.entries(filteredData)) {
        newData.push({
          t: new Date(Number(key)),
          o: val,
          h: data.High[key],
          l: data.Low[key],
          c: data.Close[key]
        })
      }

      this.datacollection = {
        datasets: [{
          label: this.title,
          data: newData         
        }],
      }
    }
  },

  mounted() {
    this.initData();
  }
};
</script>
<style>
</style>