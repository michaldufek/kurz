<template>
  <card type="chart" style="margin-bottom: 0px;">
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <div class="chart-area" style="margin-top: 50px; height: 100%">
      <section v-if="isError" style="text-align: center">
        <p style="padding-top: 50px">{{ $t('dataError') }}</p>
      </section>
      <section v-else>
        <DualRingLoader v-if="loading" :color="'#54f1d2'" style="width: 80px; height: 80px; position: absolute; top: 40%; left: 45%;" />
        <pie-chart :chart-data="datacollection"
                   :options="options"/>
      </section>
    </div>
  </card>
</template>
<script>
import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';
import PieChart from '@/custom/components/Charts/PieChart';
import constants from '@/custom/assets/js/constants';


export default {
  name: "pie-chart-card",
  components: {
    DualRingLoader,
    PieChart
  },

  props: {
    title: {
      type: String,
      description: "Chart title"
    },
    apiUrl: {
      type: String,
      description: "URL to API data source"
    }
  },

  data() {
    return {
      error: false,
      loading: false,

      // chart
      datacollection: {
				datasets: [{
					data: [
						10,
						20,
						5,
						25,
						40,
					],
					backgroundColor: [
						'rgba(0, 0, 0, 0.1)',
						'rgba(0, 0, 0, 10)',
						'rgba(0, 10, 0, 0.1)',
						'rgba(0, 0, 0, 5)',
						'rgba(10, 0, 0, 0.1)'
					]
				}],
				labels: [
					'Asset 1',
					'Asset 2',
					'Asset 3',
					'Asset 4',
					'Asset 5'
				]
			},
			options: {
				responsive: true
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
      
      this.$http
      .get(this.apiUrl)
      .then(response => {
        this.fillChartData(response.data)
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

        if (!this.error) {
          this.notifyAudio('connectionLost', 'warning', this.$t('notifications.brokerConnectionLost') + '(' + this.title + ' ' + this.$t('chart') + ')')
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
    // this.initData();
  }
};
</script>
<style>
</style>