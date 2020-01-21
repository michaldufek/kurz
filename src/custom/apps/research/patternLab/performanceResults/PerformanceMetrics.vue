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
import helper from '@/custom/assets/js/helper';

export default {
    components: {
        FancyTable
    },

    data() {
        return {
            assetsPatterns: null,
            rules: null,
            perfMetricsKey: 'research.patternLab.backtestPatterns.performanceResults.performanceMetrics',

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
                              + ' / ' + this.$t(this.perfMetricsKey + '.title') + ').'
                })
                
                return  
            }

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

            data.forEach(d => d.forEach(datum => 
                rows.push([
                    datum.symbol,   // Asset
                    this.assetsPatterns.checkedPatterns.find(cp => cp.id === datum.pattern_id).name,    // Pattern
                    Object.keys(datum.trades.trades.pnl).length,   // # of trades
                    this.rules.strategy.initialCapital ? `${this.rules.strategy.initialCapital} ${constants.defaultUnit}` : null,   // Initial capital
                    this.rules.strategy.initialCapital 
                     ? `${Number(this.rules.strategy.initialCapital) + Number(datum.trades.stats["Cummulative pnl final"]
                                                                              ? datum.trades.stats["Cummulative pnl final"]
                                                                              : 0)} ${constants.defaultUnit}`
                     : (datum.trades.stats["Cummulative pnl final"] 
                        ? `${datum.trades.stats["Cummulative pnl final"]} ${constants.defaultUnit}`
                        : null), // End capital
                    datum.trades.stats["Cummulative pnl final"] ? `${datum.trades.stats["Cummulative pnl final"]} ${constants.defaultUnit}` : null,    // Cummulative PnL final
                    'CAGR',    // CAGR
                    datum.trades.stats["Sharpe ratio"],  // Sharpe ratio
                    this.rules.strategy.profitTarget.value ? `${this.rules.strategy.profitTarget.value} ${this.rules.strategy.profitTarget.unit}` : null,   // PT
                    this.rules.strategy.stopLoss.value ? `${this.rules.strategy.stopLoss.value} ${stratData.stopLoss.unit}` : null,   // SL
                    datum.trades.stats["Avg. trade net profit per trade"],  // Average trade
                    datum.trades.stats["Max drawdown strategy"]  // Max drawdown strategy
                ])
           ))

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