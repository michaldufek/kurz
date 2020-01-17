<template>

    <base-table :data="data" 
                :columns="columns"
                :editable="true">
    </base-table>
    
</template>
<script>
import { BaseTable } from '@/components'
import constants from '@/custom/assets/js/constants'

export default {
    components: {
        BaseTable
    },

    data() {
        return {
            data: null,
            columns: this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')
        }
    },

    methods: {
        initData() {
            this.data = []

            let data = this.$store.getItem('research.patternLab.backtestPatterns.title')

            // add or delete dynamic columns and get their indexes
            let movingAverageClName = this.$t('research.patternLab.movingAverage').toLowerCase()
            let indexes = {
                entryRules: this.addDeleteColumn(data.strategy.trendFilter.entryRules, this.$t('research.patternLab.entry') + ' ' + movingAverageClName),
                exitRules: this.addDeleteColumn(data.strategy.trendFilter.exitRules, this.$t('research.patternLab.exit') + ' ' + movingAverageClName)            
            }

            console.log(this.columns)
            console.log(indexes)

            if (data) {
                if ('pattern' in data) {
                    data.pattern.assets.forEach(asset => {
                        data.pattern.patterns.forEach(pattern => {
                            let row = {}
                            let nr = 0

                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.pattern.from    // From
                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.pattern.to    // To
                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.pattern.timeframe    // Time frame
                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = asset.symbol    // Asset
                            row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = pattern.name    // Pattern

                            if ('strategy' in data) {                
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.strategy.initialCapital ? + ' ' + constants.defaultUnit : null    // Initial capital
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.strategy.analyze ? + data.strategy.analyze + ' ' + this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.bars') : null    // Analyze
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.strategy.profitTarget.value ? data.strategy.profitTarget.value + ' ' + data.strategy.profitTarget.unit : null    // Profit Target
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.strategy.stopLoss.value ? data.strategy.stopLoss.value + ' ' + data.strategy.stopLoss.unit : null    // Stop Loss
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.strategy.entryType    // Entry type
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.strategy.direction    // Direction
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.strategy.price.offset ? data.strategy.price.ohlc + ' ' + data.strategy.price.offset + ' ' + data.strategy.price.unit : null    // Price 
                                row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[nr++].toLowerCase()] = data.strategy.expiration ? data.strategy.expiration + ' ' + this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.days') : null    // Expiration

                                // columns that can be dynamically added or deleted
                                if (data.strategy.trendFilter.entryRules) {
                                    console.log(this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[indexes.trendFilter.entryRules])
                                    row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[indexes.trendFilter.entryRules].toLowerCase()] = data.strategy.movingAverage.entryRules ? data.strategy.movingAverage.entryRules + ' ' + constants.defaultUnit : null    // Entry moving average
                                }
                                if (data.strategy.trendFilter.exitRules) { 
                                    row[this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')[indexes.trendFilter.exitRules].toLowerCase()] = data.strategy.movingAverage.exitRules ? data.strategy.movingAverage.exitRules + ' ' + constants.defaultUnit : null     // Exit moving average
                                }
                            }                                            

                            this.data.push(row)
                        })
                    });
                }
            }
        },

        addDeleteColumn(allowed, clName) {
            console.log(clName)
            let index = this.columns.indexOf(clName)
            if (allowed) {  
                if (index === -1) {   // column named clName should be in columns and isn't there -> add it to the end of columns
                    this.columns = this.columns.concat([ clName ])
                    index = this.columns.length -1
                }
            } else if (index !== -1) { // otherwise -> delete it   
                this.columns.splice(index, 1)
                index = -1
            }

            return index
        }
    },

    mounted() {
        this.initData()
    }
}
</script>
<style scoped>

</style>