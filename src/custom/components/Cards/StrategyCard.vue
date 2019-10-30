<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card --> 
      <div class="col-lg-8 col-md-12">
        <fancy-chart :title="title"
                     :apiUrls="apiUrls">
        </fancy-chart>
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
                  <p :title="$t('terms.perfStats.ytd')">{{$t('ytd')}}: {{statsData.ytd | roundToFixed}}</p>
                  <p :title="$t('terms.perfStats.cagr')">{{$t('cagr')}}: {{statsData.cagr | roundToFixed}}</p>
                  <p :title="$t('terms.perfStats.sharpe')">{{$t('sharpeRatio')}}: {{statsData.sr | roundToFixed}}</p>
                </div>
                <div style="width:50%; float: right;">
                  <p :title="$t('terms.perfStats.maxDD')">{{$t('maxDD')}}: {{statsData.maxdd | roundToFixed}}</p>
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
import FancyChart from '@/custom/components/FancyChart';

export default {
  name: "strategy-card",
  components: {
    Card,
    FancyChart
  },
  props: {
    title: {
      type: String,
      description: "Chart title"
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
    apiUrls: {
      type: Array,
      default: () => {
        return []
      },
      description: "URLs to API data sources"
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
  }
};
</script>
<style>
</style>