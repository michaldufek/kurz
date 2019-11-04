<template>
  <div class="row">
    <!-- <card class="card">  -->
      <!-- to-do: must be in one card -->
      <div class="col-lg-8 col-md-12">
        <card class="card">
          <h4 class="card-title">{{title}}</h4>
          <ul style="list-style-type: none;">
            <li v-for="strategy in strategies">
              {{strategy[0]}}
              <base-button v-if="enableLive" type="secondary" size="1" fill>{{$t('research.portfolioManager.live')}}</base-button>
              <base-button v-if="enableStore" type="secondary" fill>{{$t('research.portfolioManager.store')}}</base-button>        
              <br/>
            </li>
          </ul>
        </card>
      </div>

      <div class="col-lg-4 col-md-12">
        <fancy-table :title="title + ' ' + $t('research.portfolioManager.statsTable.title').toLowerCase()"
                      :showTitle="false"
                      :apiUrls="strategiesUrls"
                      :rowsCreator="rowsCreator"
                      :aggregator="averageAggregator"
                      :titles="$t('terms.perfStats')"
                      :columns="$t('research.portfolioManager.statsTable.columns')">
        </fancy-table>
      </div>
    <!-- </card> -->
  </div>
</template>
<script>
import { BaseButton } from "@/components";
import FancyTable from '@/custom/components/FancyTable';
import helper from '@/custom/assets/js/helper';

export default {
  name: "portfolio-card",
  components: {
    BaseButton,
    FancyTable
  },

  props: {
    title: {
      type: String,
      description: "Portfolio title"
    },
    strategies: {
      type: Array,
      default: () => {
        return [ [null, null] ]
      },
      description: "Array of strategies names with their API urls"
    },
    enableLive: {
      type: Boolean,
      default: true
    },
    enableStore: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    strategiesUrls() {
      // get all strategies urls only
      let urls = []
      this.strategies.forEach(strat => urls.push(strat[1]))
      return urls
    }
  },

  methods: {
    rowsCreator(responseData) {
      return [
        [ 
          this.$t('cagr') + ": " + responseData.cagr, 
          this.$t('research.portfolioManager.statsTable.rows.beta') + ": " + 43 
        ],
        [ 
          this.$t('sr') + ": " + responseData.sharpe, 
          this.$t('research.portfolioManager.statsTable.rows.alfa') + ": " + 43 
        ],
        [
          this.$t('equityOuts') + ": " + 5345,
          this.$t('research.portfolioManager.statsTable.rows.__miss_proposal')
        ],
        [
          this.$t('maxDD') + ": " + responseData.maxdd,
          this.$t('research.portfolioManager.statsTable.rows.__miss_proposal')      
        ]
      ]
    },

    averageAggregator(oldRows, newRows) {
      return helper.averageAggregator(oldRows, newRows)
    }    
  }
}
</script>
<style>
</style>