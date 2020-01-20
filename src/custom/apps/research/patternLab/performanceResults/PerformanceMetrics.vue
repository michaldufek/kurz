<template>

    <fancy-table :title="$t(perfMetricsKey + '.title')"
                :showTitle="false"
                :apiUrls="url"
                :columns="$t(perfMetricsKey + '.columns')"
                :rowsCreator="rowsCreator"
                :sortable="true"
                :filterable="true"
                :headerTitle="$t(perfMetricsKey + '.title')"
                :key="tableKey">
    </fancy-table>
    
</template>
<script>
import FancyTable from '@/custom/components/Tables/FancyTable'; 
import constants from '@/custom/assets/js/constants'; 

export default {
    components: {
        FancyTable
    },

    data() {
        return {
            assetsPatterns: null,
            rules: null,
            perfMetricsKey: 'research.patternLab.backtestPatterns.performanceResults.performanceMetrics',

            tableKey: 0
        }
    },
    
    computed: {
      url() {
          return this.assetsPatterns && this.rules && this.rules.event === constants.events.runStrategy 
                  ? [ constants.urls.patternLab.backtestPatterns + helper.encodeRouteParams(this.getRouteParams()) 
                       + "?" + helper.encodeQueryData(this.getQueryData()) ] 
                  : []
      }
    },

    methods: {
        initData() {
            this.assetsPatterns = helper.getAssetsPatternsPickerData(this.$store)
            this.rules = this.$store.getItem(constants.storeKeys.backtestPatterns)   // entry/exit rules
        },

        getRouteParams() {
            return [ helper.convertTimeframe(this.assetsPatterns.timeframe), 
                     helper.formatDate(this.assetsPatterns.from ? this.assetsPatterns.from : Number.MIN_VALUE, ''), 
                     helper.formatDate(this.assetsPatterns.to ? this.assetsPatterns.to : new Date(), ''), 
                     this.assetsPatterns.checkedAssets.map(ca => ca.symbol).join(';'), 
                     this.assetsPatterns.checkedPatterns.map(cp => cp.id).join(',')         // mandatory ? if yes, notify when no no patterns
                    ]            
        },
        getQueryData() {
            let query = {}
            query['params'] = JSON.stringify(this.rules.strategy)            
            return query
        },

        rowsCreator(data) {
            let clsKey = this.perfMetricsKey + '.columns'
            let rows = []

            data.forEach(d => d.forEach(datum => {
                let row = {}

                let clNr = 0
                row[this.$t(clsKey)[clNr++].toLowerCase()] = datum.symbol   // Asset
                row[this.$t(clsKey)[clNr++].toLowerCase()] = this.assetsPatterns.checkedPatterns.find(cp => cp.id === datum.pattern_id).name    // Pattern
                row[this.$t(clsKey)[clNr++].toLowerCase()] = Object.keys(datum.trades.trades.pnl).length   // # of trades
                row[this.$t(clsKey)[clNr++].toLowerCase()] = this.rules.strategy.initialCapital ? `${this.rules.strategy.initialCapital} ${constants.defaultUnit}` : null   // Initial capital
                row[this.$t(clsKey)[clNr++].toLowerCase()] = `${ (this.rules.strategy.initialCapital
                                                                  ? this.rules.strategy.initialCapital + datum["Cummulative pnl final"]
                                                                  : datum["Cummulative pnl final"])
                                                                } ${constants.defaultUnit}`   // End capital
                row[this.$t(clsKey)[clNr++].toLowerCase()] = datum["Cummulative pnl final"] ? `${datum["Cummulative pnl final"]} ${constants.defaultUnit}` : null    // Cummulative PnL final
                row[this.$t(clsKey)[clNr++].toLowerCase()] = 'CAGR'    // CAGR
                row[this.$t(clsKey)[clNr++].toLowerCase()] = datum["Sharpe ratio"]  // Sharpe ratio
                row[this.$t(clsKey)[clNr++].toLowerCase()] = this.rules.strategy.profitTarget.value 
                                                              ? `${this.rules.strategy.profitTarget.value} ${this.rules.strategy.profitTarget.unit}` 
                                                              : null   // PT
                row[this.$t(clsKey)[clNr++].toLowerCase()] = this.rules.strategy.stopLoss.value 
                                                              ? `${this.rules.strategy.stopLoss.value} ${stratData.stopLoss.unit}` 
                                                              : null   // SL
                row[this.$t(clsKey)[clNr++].toLowerCase()] = datum["Avg. trade net profit per trade"]  // Average trade
                row[this.$t(clsKey)[clNr++].toLowerCase()] = datum["Max drawdown strategy"]  // Max drawdown strategy

                rows.push(row)
           }))

           return rows
        }
    }
}
</script>
<style scoped>

</style>