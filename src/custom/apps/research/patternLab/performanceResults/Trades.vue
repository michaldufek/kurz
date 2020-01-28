<template>

    <fancy-table :title="$t(tradesKey + '.title')"
                 :showTitle="false"
                 :data="tableData"
                 :columns="$t(tradesKey + '.columns')"
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
            tradesKey: 'research.patternLab.backtestPatterns.performanceResults.trades',
            tableData: [],
            tableKey: 0
        }
    },
    
    methods: {
        initData() {
            setInterval(() => { 
                this.checkBacktests()   
            }, constants.intervals.backtestsDone )             
        },   
        checkBacktests() {
            let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
            if (data && !data.loading) {
                this.tableData = this.rowsCreator(data.backtestsResults)
                this.tableKey++
            }
        },  
        
        rowsCreator(datum/*a*/) {
            let columns = this.$t(this.tradesKey + '.columns')
            let rows = []
            
            // data.forEach(datum => {
                let rowNr = 0

                Object.keys(datum.backtestbit_set[0].output.trades.pnl).forEach(_ => {
                    let row = {}
                    let clNr = 0

                    row[columns[clNr++].toLowerCase()] = rowNr + 1    // #
                    row[columns[clNr++].toLowerCase()] = datum.tickers[0].symbol   // Asset
                    row[columns[clNr++].toLowerCase()] = datum.patterns[0].name    // Pattern
                    row[columns[clNr++].toLowerCase()] = datum.direction,   // Direction
                    row[columns[clNr++].toLowerCase()] = 'Entry price'   // Entry price
                    row[columns[clNr++].toLowerCase()] = 'Exit price'   // Exit price
                    row[columns[clNr++].toLowerCase()] = helper.formatDateTime(datum.backtestbit_set[0].output.trades.start[rowNr])   // Entry time
                    row[columns[clNr++].toLowerCase()] = helper.formatDateTime(datum.backtestbit_set[0].output.trades.finish[rowNr])   // Exit time
                    row[columns[clNr++].toLowerCase()] = 'Amount'   // Amount
                    row[columns[clNr++].toLowerCase()] = datum.backtestbit_set[0].output.trades.pnl[rowNr++]   // PnL
                    
                    rows.push(row)
                })
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