<template>

    <fancy-table :title="$t(storeKey + '.title')"
                :showTitle="false"
                :apiUrls="url"
                :columns="$t(storeKey + '.columns')"
                :rowsCreator="rowsCreator"
                :sortable="true"
                :filterable="true"
                :headerTitle="$t(storeKey + '.title')"
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
            storeKey: 'research.patternLab.backtestPatterns.performanceResults.performanceMetrics',

            assetsPatterns: null,
            rules: null,            

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
                              + ' / ' + this.$t(this.storeKey + '.title') + ').'
                })
                
                return  
            }

            this.rules = this.$store.getItem(constants.storeKeys.backtestPatterns)   // entry/exit rules

            this.url = helper.getBacktestPatternsUrl(this.assetsPatterns, this.rules)
            this.tableKey++
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
                    this.rules.strategy.profit_take.value ? `${this.rules.strategy.profit_take.value} ${this.rules.strategy.profit_take.unit}` : null,   // PT
                    this.rules.strategy.stoploss.value ? `${this.rules.strategy.stoploss.value} ${this.rules.strategy.stoploss.unit}` : null,   // SL
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