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
        <card class="card">
          <fancy-table :title="title + ' ' + $t('research.portfolioManager.statsTable.title').toLowerCase()"
                       :apiUrls="strategiesUrls"
                       :rowsCreator="rowsCreator"
                       :aggregator="aggregator"
                       :titles="$t('terms.perfStats')"
                       :columns="$t('research.portfolioManager.statsTable.columns')">
          </fancy-table>
        </card>
      </div>
    <!-- </card> -->
  </div>
</template>
<script>
import { BaseButton } from "@/components";
import FancyTable from '@/custom/components/FancyTable';

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
      this.strategies.forEach(strat => urls.push(strat[1] + 2))
      return urls
    }
  },

  methods: {
    rowsCreator(responseData) {
      return [
        [ 
          this.$t('cagr') + ": " + response.data.cagr, 
          this.$t('research.portfolioManager.statsTable.rows.beta') + ": " + 43 
        ],
        [ 
          this.$t('research.portfolioManager.statsTable.rows.sr') + ": " + response.data.sharpe, 
          this.$t('research.portfolioManager.statsTable.rows.alfa') + ": " + 43 
        ],
        [
          this.$t('equityOuts') + ": " + 5345,
          this.$t('research.portfolioManager.statsTable.rows.__miss.proposal')
        ],
        [
          this.$t('maxDD') + ": " + response.data.maxdd,
          this.$t('research.portfolioManager.statsTable.rows.__miss.proposal')      
        ]
      ]
    },

    aggregator(oldRows, newRows) {
      // to-do: get rid of this copy-paste from Dashboard
      const roundStatsData = (statsData) => {
        // rounds performace statistics data table to 2 mantissa places
        let newTable = []

        statsData.forEach(row => {
          let newRow = []

          this.$t('research.portfolioManager.statsTable.columns').forEach(column => {
            newRow[column.toLowerCase()] = row[column.toLowerCase()].toFixed(2)
          })
          
          newTable.push(newRow)
        })

        return newTable
      }

      // average values at same place (to-do: except eq.outs. - only sum these)
      let rows = []
      if (!oldRows.length || !newRows.length) {
        rows = oldRows.concat(newRows)
      } else {
        let rowNr = 0

        oldRows.forEach(oldRow => {
          let aggRow = []
          let valNr = 0

          oldRow.forEach(oldVal => { 
            let newVal = oldVal + newRows[rowNr][valNr]
            if (newVal instanceof Number) {
              newVal /= 2
            }

            aggRow.push(newVal)
            valNr++
          })

          rows.push(aggRow)
          rowNr++
        })
      }

      return roundStatsData(rows)
    }
  }
}
</script>
<style>
</style>