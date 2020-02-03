<template>
    <div>
        <fancy-table :title="$t(perfMetricsKey + '.title')"
                    :showTitle="false"
                    :apiUrls="patternResults"
                    :noDataText="noDataText"
                    :columns="$t(perfMetricsKey + '.columns')"
                    :rowsCreator="rowsCreator"
                    :sortable="true"
                    :filterable="true"
                    :key="tableKey">
        </fancy-table>

        <p v-if="warningText" style="color: yellow; text-align: center">{{warningText}}</p>            
    </div>
</template>
<script>
import FancyTable from '@/custom/components/Tables/FancyTable'; 
import constants from '@/custom/assets/js/constants'; 
import helper from '@/custom/assets/js/helper';


export default {
    components: {
        FancyTable
    },

    data() {
        return {
            perfMetricsKey: 'research.patternLab.backtestPatterns.performanceResults.performanceMetrics',
            loading: true,
            noDataText: '',
            warningText: '',
            tableKey: 0
        }
    },

    computed: {
        patternResults() {
            return !this.loading ? [ constants.urls.patternLab.backtestPatterns.results ] : []
        }
    },

    methods: {
        initData() {            
            let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
            if (data) {
                this.loading = data.loading
                this.tableKey++
            } else {
                this.loading = false
            }
        },

        rowsCreator(data) {
            let columns = this.$t(this.perfMetricsKey + '.columns')
            let rows = []

            data.forEach(datum => {
                let base = helper.getBacktestPatternsTableBase(datum, this.$store, this.$t(constants.patternsKey + '.columns'))

                if (datum.error) {
                    this.warningText += `Pattern results of '${base.name}' has some problems: ${datum.msg} `
                } else {
                    rows.push([
                        base.symbol,    // Asset
                        base.pattern,    // Pattern
                        Object.keys(datum.output.trades.pnl).length,   // # of trades
                        `${datum.initial_capital} ${constants.defaultUnit}`,   // Initial capital
                        `${datum.initial_capital + datum.output.stats["Cummulative pnl final"]} ${constants.defaultUnit}`,   // End capital
                        `${datum.output.stats["Cummulative pnl final"]} ${constants.defaultUnit}`,    // Cummulative PnL final
                        'CAGR',    // CAGR
                        datum.output.stats["Sharpe ratio"],  // Sharpe ratio
                        `${datum.profit_take_value} ${datum.profit_take_unit}`,   // PT
                        `${datum.stop_loss_value} ${datum.stop_loss_unit}`,   // SL
                        datum.output.stats["Avg. trade net profit per trade"],  // Average trade
                        datum.output.stats["Max drawdown strategy"]  // Max drawdown strategy
                    ])
                }
            })

            if (!rows.length && this.warningText) { // all pattern results has error
                this.noDataText = this.warningText
                this.warningText = null
            }

            return rows
        }        
    },

    mounted() {
        this.initData()
    }
}
</script>
<style scoped>

</style>