<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card --> 
      <div class="col-lg-8 col-md-12">
        <card type="chart">
          <h4 slot="header" class="card-title">{{chartData.title}}</h4>
          <div class="chart-area">
            <!-- to-do: errored and loading sections not working -->
            <!-- to-do: use it also in another custom cards -->
            <section v-if="errored">
              <p>Omlouváme se, nejsme schopní získat v tento moment graf vývoje stavu účtu. Prosím, skuste později.</p>
            </section>
            <section v-else>
              <div v-if="loading">Načítaní grafu vývoje stavu účtu...</div>
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
      <div class="col-lg-4 col-md-12">
        <card class="card">
          <section v-if="errored">
            <p>Omlouváme se, nejsme schopní získat v tento moment informace o statistikách. Prosím, skuste později.</p>
          </section>
          <section v-else>
            <div v-if="loading">Načítaní statistik...</div>
            <div v-else>
                <div style="width:50%; float: left;">
                  <p>{{$t('dashboard.details.strategy.ytd')}}: {{stats.ytd}}</p>
                  <p>{{$t('dashboard.details.strategy.cagr')}}: {{stats.cagr}}</p>
                  <p>{{$t('dashboard.details.strategy.sr')}}: {{stats.sr}}</p>
                </div>
                <div style="width:50%; float: right;">
                  <p>{{$t('dashboard.details.strategy.maxDD')}}: {{stats.maxdd}}</p>
                  <p>{{$t('dashboard.details.strategy.equityOuts')}}: {{stats.equityOuts}}</p>
                </div>
            </div>
          </section>
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
};
</script>
<style>
</style>