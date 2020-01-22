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
            if (!this.assetsPatterns.checkedPatterns.length) {
                this.$notify({
                    type: 'warning', 
                    message: this.$t('notifications.addNoPattern') + ' (' + this.$t('sidebar.patternLab')
                              + ' / ' + this.$t('research.patternLab.backtestPatterns.title') 
                              + ' / ' + this.$t(this.tradesKey + '.title') + ').'
                })
                
                return  
            }

            this.rules = this.$store.getItem(constants.storeKeys.backtestPatterns)   // entry/exit rules

            this.url = helper.getBacktestPatternsUrl(this.assetsPatterns, this.rules)
            this.tableKey++
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