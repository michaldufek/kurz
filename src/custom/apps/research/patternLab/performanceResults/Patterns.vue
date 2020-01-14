<template>

    <fancy-table :title="$t('research.patternLab.backtestPatterns.performanceResults.patterns.title')"
                :showTitle="false"
                :apiUrls="url"
                :columns="$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')"
                :rowsCreator="rowsCreator"
                :editable="true"
                :headerTitle="$t('research.patternLab.backtestPatterns.performanceResults.patterns.title')"
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

    props: {
        params: {
            type: Object,
            default: () => {
                return {
                    pattern: null,
                    strategy: null
                }
            },
            description: 'All parameters used in the component.'
        }
    },

    data() {
        return {
            tableKey: 0
        }
    },
    
    computed: {
      url() {
          return this.params.pattern && this.params.strategy ? [ constants.urls.patternLab.backtestPatterns  + "?" + helper.encodeQueryData(this.getQueryData()) ] : []
      }
    },

    methods: {
        getQueryData() {
            //    https://dev.analyticalplatform.com/api/pl/ComplexBacktest?timeframe=1&start_date=20010102&finish_date=20101230&assets=MSFT&pattern_ids=3&params={"entry_type": "market", "direction": "buy", "profit_take": 0.01, "stoploss": 0.01}
            let query = {}

            query['timeframe'] = helper.convertTimeframe(this.params.pattern.timeframe)
            query['start_date'] = helper.formatDate(this.params.pattern.from, '')
            query['finish_date'] = helper.formatDate(this.params.pattern.to, '')
            query['assets'] = this.params.pattern.assets.map(a => a.symbol).join(',')
            query['pattern_ids'] = this.params.pattern.patterns.map(p => p.id).join(',')

            query['params'] = JSON.stringify(this.params.strategy)
            
            return query
        },

        rowsCreator(data) {
            return [
                    "From",
                    "To", 
                    "Time frame", 
                    "Asset", 
                    "Pattern", 
                    "Initial capital", 
                    "Analyze", 
                    "Profit Target", 
                    "Stop Loss", 
                    "Break Even", 
                    "Moving average", 
                    "Trend filter (moving average)", 
                    "Entry price", 
                    "Direction", 
                    "Price", 
                    "Expiration"
                ]
        }
    },

    mounted() {
        // console.log('Patterns')
        // console.log(this.params)
    }
}
</script>
<style scoped>

</style>