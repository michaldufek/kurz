<template>

    <fancy-table :title="$t('research.patternLab.backtestPatterns.performanceResults.trades.title')"
                 :showTitle="false"
                 :apiUrls="url"
                 :columns="$t('research.patternLab.backtestPatterns.performanceResults.trades.columns')"
                 :rowsCreator="rowsCreator"
                 :sortable="true"
                 :filterable="true"
                 :headerTitle="$t('research.patternLab.backtestPatterns.performanceResults.trades.title')"
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

            tableKey: 0
        }
    },
    
    computed: {
      url() {
        // https://dev.analyticalplatform.com/api/pl/ComplexBacktest?timeframe=1&start_date=20010102&finish_date=20101230&assets=MSFT&pattern_ids=3&params={"entry_type": "market", "direction": "buy", "profit_take": 0.01, "stoploss": 0.01}
        let ret = this.assetsPatterns && this.rules && this.rules.event === constants.events.runStrategy 
                   ? [ constants.urls.patternLab.backtestPatterns + helper.encodeRouteParams(this.getRouteParams()) 
                        + "?" + helper.encodeQueryData(this.getQueryData()) ] 
                   : []
        console.log(ret)
        return ret
      }
    },

    methods: {
        initData() {
            console.log('initData - trades')
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
            let clsKey = 'research.patternLab.backtestPatterns.performanceResults.trades.columns'
            let rows = []

            data.forEach(d => d[1].forEach(datum => {
                let rowNr = 1
                Object.keys(datum.trades.trades.pnl).forEach(trade => {
                    let row = {}

                    let clNr = 0
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = rowNr++    // #
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = datum.symbol   // Asset
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = this.assetsPatterns.checkedPatterns.find(cp => cp.id === datum.pattern_id).name    // Pattern
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = 'Direction'   // Direction
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = 'Entry price'   // Entry price
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = 'Exit price'   // Exit price
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = helper.formatDateTime(datum.trades.trades.start[rowNr])   // Entry time
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = helper.formatDateTime(datum.trades.trades.finish[rowNr])   // Exit time
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = 'Amount'   // Amount
                    row[this.$t(clsKey)[clNr++].toLowerCase()] = datum.trades.trades.pnl   // PnL

                    rows.push(row)
                })
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