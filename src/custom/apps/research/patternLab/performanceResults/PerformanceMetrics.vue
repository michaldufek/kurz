<template>

    <fancy-table :title="$t(perfMetricsKey + '.title')"
                :showTitle="false"
                :data="tableData"
                :columns="$t(perfMetricsKey + '.columns')"
                :rowsCreator="rowsCreator"
                :sortable="true"
                :filterable="true"
                :key="tableKey">
    </fancy-table>
    
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
            tableData: [],
            tableKey: 0
        }
    },

    methods: {
        initData() {            
            let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
            if (data && !data.loading) {
                this.tableData = this.rowsCreator(data.backtestsResults)
                this.tableKey++
            }
        },

        rowsCreator(datum/*a*/) {
            let columns = this.$t(this.perfMetricsKey + '.columns')
            let rows = []

            // data.forEach(datum => {
                let row = {}
                let clNr = 0

                row[columns[clNr++].toLowerCase()] = datum.tickers[0].symbol   // Asset
                row[columns[clNr++].toLowerCase()] = datum.patterns[0].name    // Pattern
                row[columns[clNr++].toLowerCase()] = Object.keys(datum.backtestbit_set[0].output.trades.pnl).length   // # of trades
                row[columns[clNr++].toLowerCase()] = `${datum.initial_capital} ${constants.defaultUnit}`   // Initial capital
                row[columns[clNr++].toLowerCase()] = `${datum.initial_capital + datum.backtestbit_set[0].output.stats["Cummulative pnl final"]} ${constants.defaultUnit}`   // End capital
                row[columns[clNr++].toLowerCase()] = `${datum.backtestbit_set[0].output.stats["Cummulative pnl final"]} ${constants.defaultUnit}`    // Cummulative PnL final
                row[columns[clNr++].toLowerCase()] = 'CAGR',    // CAGR
                row[columns[clNr++].toLowerCase()] = datum.backtestbit_set[0].output.stats["Sharpe ratio"],  // Sharpe ratio
                row[columns[clNr++].toLowerCase()] = `${datum.profit_take_value} ${datum.profit_take_unit}`   // PT
                row[columns[clNr++].toLowerCase()] = `${datum.stop_loss_value} ${datum.stop_loss_unit}`   // SL
                row[columns[clNr++].toLowerCase()] = datum.backtestbit_set[0].output.stats["Avg. trade net profit per trade"]  // Average trade
                row[columns[clNr++].toLowerCase()] = datum.backtestbit_set[0].output.stats["Max drawdown strategy"]  // Max drawdown strategy

                rows.push(row)
        //    })

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