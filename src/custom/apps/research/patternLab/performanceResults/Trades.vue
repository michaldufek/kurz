<template>

    <fancy-table :title="$t(tradesKey + '.title')"
                 :showTitle="false"
                 :apiUrls="url"
                 :columns="$t(tradesKey + '.columns')"
                 :rowsCreator="rowsCreator"
                 :sortable="true"
                 :filterable="true"
                 :headerTitle="$t(tradesKey + '.title')"
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
            assetsPatterns: null,
            rules: null,
            tradesKey: 'research.patternLab.backtestPatterns.performanceResults.trades',

            url: null,
            tableKey: 0
        }
    },
    
    methods: {
        initData() {
            this.assetsPatterns = helper.getAssetsPatternsPickerData(this.$store)
            this.rules = this.$store.getItem(constants.storeKeys.backtestPatterns)   // entry/exit rules

            this.url = this.assetsPatterns && this.rules && this.rules.event === constants.events.runStrategy 
                        ? [ constants.urls.patternLab.backtestPatterns + helper.encodeRouteParams(this.getRouteParams()) 
                            + "?" + helper.encodeQueryData(this.getQueryData()) ] 
                        : []
            this.tableKey++
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
            let rows = []
            
            data.forEach(d => d.forEach(datum => {
                let rowNr = 0

                Object.keys(datum.trades.trades.pnl).forEach(_ => 
                    rows.push([
                        rowNr + 1,    // #
                        datum.symbol,   // Asset
                        this.assetsPatterns.checkedPatterns.find(cp => cp.id === datum.pattern_id).name,    // Pattern
                        'Direction',   // Direction
                        'Entry price',   // Entry price
                        'Exit price',   // Exit price
                        helper.formatDateTime(datum.trades.trades.start[rowNr]),   // Entry time
                        helper.formatDateTime(datum.trades.trades.finish[rowNr]),   // Exit time
                        'Amount',   // Amount
                        datum.trades.trades.pnl[rowNr++]   // PnL
                    ]))
           }))

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