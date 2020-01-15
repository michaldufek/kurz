<template>

    <base-table :data="data" 
                :columns="$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')"
                :editable="true">
    </base-table>
      
    <!-- <fancy-table :title="$t('research.patternLab.backtestPatterns.performanceResults.patterns.title')"
                :showTitle="false"
                :apiUrls="url"
                :columns="$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')"
                :rowsCreator="rowsCreator"
                :editable="true"
                :headerTitle="$t('research.patternLab.backtestPatterns.performanceResults.patterns.title')"
                :key="tableKey">
    </fancy-table> -->
    
</template>
<script>
import { BaseTable } from '@/components'

export default {
    components: {
        BaseTable
    },

    data() {
        return {
            data: null
        }
    },

    methods: {
        initData() {
            this.data = []

            let data = this.$store.getItem('research.patternLab.backtestPatterns.title')
            if (data) {
                if ('pattern' in data) {
                    data.pattern.assets.forEach(asset => {
                        data.pattern.patterns.forEach(pattern => {
                            let row = {}
                            
                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[0].toLowerCase()] = data.pattern.from    // From
                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[1].toLowerCase()] = data.pattern.to    // To
                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[2].toLowerCase()] = data.pattern.timeframe    // Time frame
                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[3].toLowerCase()] = asset.symbol    // Asset
                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[4].toLowerCase()] = pattern.name    // Pattern

                            if ('strategy' in data) {                
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[5].toLowerCase()] = data.strategy.initialCapital    // Initial capital
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[6].toLowerCase()] = data.strategy.analyze    // Analyze
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[7].toLowerCase()] = data.strategy.profitTarget ? data.strategy.profitTarget.value : null    // Profit Target
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[8].toLowerCase()] = data.strategy.stopLoss ? data.strategy.stopLoss.value : null    // Stop Loss
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[9].toLowerCase()] = data.strategy.breakEven ? data.strategy.breakEven.value : null    // Break Even
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[10].toLowerCase()] = data.strategy.movingAverageEntryRules    // Moving average
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[11].toLowerCase()] = data.strategy.movingAverageExitRules    // Trend filter (moving average)
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[12].toLowerCase()] = data.strategy.entryType    // Entry type
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[13].toLowerCase()] = data.strategy.direction    // Direction
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[14].toLowerCase()] = data.strategy.price ? data.strategy.price.value : null    // Price 
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[15].toLowerCase()] = data.strategy.expiration    // Expiration
                            }                                            

                            this.data.push(row)
                        })
                    });
                }
            }
        }
    },

    mounted() {
        this.initData()
    }
}
</script>
<style scoped>

</style>