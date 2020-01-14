<template>

    <fancy-table :title="$t('research.patternLab.backtestPatterns.performanceResults.trades.title')"
                :showTitle="false"
                :apiUrls="url"
                :columns="$t('research.patternLab.backtestPatterns.performanceResults.trades.columns')"
                :rowsCreator="rowsCreator"
                :editable="true"
                :headerTitle="$t('research.patternLab.backtestPatterns.performanceResults.trades.title')"
                :key="tableKey">
    </fancy-table>
    
</template>
<script>
import FancyTable from '@/custom/components/Tables/FancyTable';  

export default {
    components: {
        FancyTable
    },
    
    computed: {
      url() {}
    },

    methods: {
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
    }
}
</script>
<style scoped>

</style>