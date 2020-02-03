<template>

    <fancy-table :title="$t(tradesKey + '.title')"
                 :showTitle="false"
                 :apiUrls="patternResults"
                 :noDataText="noDataText"
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

const btsColumns = i18n.t(constants.patternsKey + '.columns')


export default {
    components: {
        FancyTable
    },

    data() {
        return {
            tradesKey: 'research.patternLab.backtestPatterns.performanceResults.trades',
            loading: true,
            noDataText: null,
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
            if (data) {    // to-do: add loader here so there's no 'No data' text until it shows data
                this.loading = data.loading
                this.tableKey++
            } else {
                this.loading = false
            }
        },  
        
        rowsCreator(data) {
            if (data.error) {
                this.noDataText = data.msg
                return 
            }

            let columns = this.$t(this.tradesKey + '.columns')
            let rows = []
            
            let bpData = this.$store.getItem(constants.storeKeys.backtestPatterns)
            data.forEach(datum => {
                let rowNr = 0

                Object.keys(datum.output.trades.pnl).forEach(_ => {
                    let row = {}
                    let clNr = 0

                    row[columns[clNr++].toLowerCase()] = rowNr + 1    // #

                    let symbols = bpData ? bpData.backtests.filter(bt => bt['assetId'] === datum.ticker) : null
                    row[columns[clNr++].toLowerCase()] = symbols ? symbols[0][btsColumns[4].toLowerCase()] : datum.ticker    // Asset
                    let patterns = bpData ? bpData.backtests.filter(bt => bt['patternId'] === datum.pattern) : null
                    row[columns[clNr++].toLowerCase()] = patterns ? patterns[0][btsColumns[5].toLowerCase()] : datum.pattern    // Pattern

                    row[columns[clNr++].toLowerCase()] = datum.direction,   // Direction
                    row[columns[clNr++].toLowerCase()] = 'Entry price'   // Entry price
                    row[columns[clNr++].toLowerCase()] = 'Exit price'   // Exit price
                    row[columns[clNr++].toLowerCase()] = helper.formatDateTime(datum.output.trades.start[rowNr])   // Entry time
                    row[columns[clNr++].toLowerCase()] = helper.formatDateTime(datum.output.trades.finish[rowNr])   // Exit time
                    row[columns[clNr++].toLowerCase()] = 'Amount'   // Amount
                    row[columns[clNr++].toLowerCase()] = datum.output.trades.pnl[rowNr++]   // PnL
                    
                    rows.push(row)
                })
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