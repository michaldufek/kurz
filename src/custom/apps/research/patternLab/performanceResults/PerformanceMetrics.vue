<template>

    <fancy-table :title="$t(perfMetricsKey + '.title')"
                :showTitle="false"
                :apiUrls="patternResults"
                :columns="$t(perfMetricsKey + '.columns')"
                :rowsCreator="rowsCreator"
                :sortable="true"
                :filterable="true">
                <!-- :key="tableKey"> -->
    </fancy-table>
    
</template>
<script>
import FancyTable from '@/custom/components/Tables/FancyTable'; 
import constants from '@/custom/assets/js/constants'; 
import helper from '@/custom/assets/js/helper';

const btsColumns = i18n.t(constants.patternsKey + '.columns')


export default {
    components: {
        FancyTable
    },

    data() {
        return {
            perfMetricsKey: 'research.patternLab.backtestPatterns.performanceResults.performanceMetrics',
            loading: true,
            // tableKey: 0
        }
    },

    computed: {
        patternResults() {
            return !this.loading ? [ constants.urls.patternLab.backtestPatterns ] : []
        }
    },

    methods: {
        initData() {            
            let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
            if (data) {
                this.loading = data.loading
                // this.tableKey++
            } else {
                this.loading = false
            }
        },

        rowsCreator(data) {
            let columns = this.$t(this.perfMetricsKey + '.columns')
            let rows = []

            data.forEach(datum => {
                let row = {}
                let clNr = 0

                let symbols = bpData ? bpData.backtests.filter(bt => bt['assetId'] === datum.ticker) : null
                row[columns[clNr++].toLowerCase()] = symbols ? symbols[0][btsColumns[4].toLowerCase()] : datum.ticker    // Asset
                let patterns = bpData ? bpData.backtests.filter(bt => bt['patternId'] === datum.pattern) : null
                row[columns[clNr++].toLowerCase()] = patterns ? patterns[0][btsColumns[5].toLowerCase()] : datum.pattern    // Pattern

                row[columns[clNr++].toLowerCase()] = Object.keys(datum.output.trades.pnl).length   // # of trades
                row[columns[clNr++].toLowerCase()] = `${datum.initial_capital} ${constants.defaultUnit}`   // Initial capital
                row[columns[clNr++].toLowerCase()] = `${datum.initial_capital + datum.output.stats["Cummulative pnl final"]} ${constants.defaultUnit}`   // End capital
                row[columns[clNr++].toLowerCase()] = `${datum.output.stats["Cummulative pnl final"]} ${constants.defaultUnit}`    // Cummulative PnL final
                row[columns[clNr++].toLowerCase()] = 'CAGR',    // CAGR
                row[columns[clNr++].toLowerCase()] = datum.output.stats["Sharpe ratio"],  // Sharpe ratio
                row[columns[clNr++].toLowerCase()] = `${datum.profit_take_value} ${datum.profit_take_unit}`   // PT
                row[columns[clNr++].toLowerCase()] = `${datum.stop_loss_value} ${datum.stop_loss_unit}`   // SL
                row[columns[clNr++].toLowerCase()] = datum.output.stats["Avg. trade net profit per trade"]  // Average trade
                row[columns[clNr++].toLowerCase()] = datum.output.stats["Max drawdown strategy"]  // Max drawdown strategy

                rows.push(row)
            })

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