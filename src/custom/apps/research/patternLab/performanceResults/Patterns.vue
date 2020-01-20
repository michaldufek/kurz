<template>

    <base-table :data="tableData" 
                :columns="columns"
                :editable="true">
    </base-table>
    
</template>
<script>
import { BaseTable } from '@/components'
import constants from '@/custom/assets/js/constants'
import helper from '@/custom/assets/js/helper';

export default {
    components: {
        BaseTable
    },

    data() {
        return {
            storeKey: 'research.patternLab.backtestPatterns.performanceResults.patterns',
            tableData: null,
            columns: this.$t('research.patternLab.backtestPatterns.performanceResults.patterns.columns')
        }
    },

    methods: {
        initData() {
            this.tableData = []            
            let columnsKey = 'research.patternLab.backtestPatterns.performanceResults.patterns.columns'
            let apData = helper.getAssetsPatternsPickerData(this.$store)
            let bpData = this.$store.getItem(constants.storeKeys.backtestPatterns)  // entry/exit rules
            let stratData = null
            let eventName = null
            if (bpData) {
                ({ strategy:stratData, event:eventName } = bpData)
            }

            if (eventName === constants.events.addPattern && apData) {
                // create new rows
                apData.checkedAssets.forEach(asset => {
                    apData.checkedPatterns.forEach(pattern => {
                        let row = {}
                        let nr = 0

                        row[this.$t(columnsKey)[nr++].toLowerCase()] = helper.formatDate(apData.from)    // From
                        row[this.$t(columnsKey)[nr++].toLowerCase()] = helper.formatDate(apData.to)    // To
                        row[this.$t(columnsKey)[nr++].toLowerCase()] = apData.timeframe    // Time frame
                        row[this.$t(columnsKey)[nr++].toLowerCase()] = asset.symbol    // Asset
                        row[this.$t(columnsKey)[nr++].toLowerCase()] = pattern.name    // Pattern

                        if (stratData) {   
                            this.updateRow(row, columnsKey, nr, stratData)                            
                        }                                            

                        this.tableData.push(row)
                    })
                })
            } else if (eventName === constants.events.runStrategy && stratData) {
                // update rows with new strategy data
                let oldTableData = this.$store.getItem(this.storeKey)

                oldTableData.forEach(row => {
                    let nr = 3

                    if (apData.checkedAssets.map(ca => ca.symbol).includes(row[this.$t(columnsKey)[nr++].toLowerCase()]) 
                        && apData.checkedPatterns.map(cp => cp.name).includes(row[this.$t(columnsKey)[nr++].toLowerCase()])) {
                            this.updateRow(row, columnsKey, nr, stratData) 
                        }
                })

                this.tableData = oldTableData
            }
            
            this.$store.setItem(this.storeKey, this.tableData)
        },
        updateRow(row, columnsKey, nr, stratData) {
            row[this.$t(columnsKey)[nr++].toLowerCase()] = stratData.initialCapital ? `${stratData.initialCapital} ${constants.defaultUnit}` : null    // Initial capital
            row[this.$t(columnsKey)[nr++].toLowerCase()] = stratData.analyze ? `${stratData.analyze} ${helper.pluralize(stratData.analyze, 'research.patternLab.backtestPatterns.performanceResults.patterns.bar')}` : null    // Analyze
            row[this.$t(columnsKey)[nr++].toLowerCase()] = stratData.profitTarget.value ? `${stratData.profitTarget.value} ${stratData.profitTarget.unit}` : null    // Profit Target
            row[this.$t(columnsKey)[nr++].toLowerCase()] = stratData.stopLoss.value ? `${stratData.stopLoss.value} ${stratData.stopLoss.unit}` : null    // Stop Loss
            row[this.$t(columnsKey)[nr++].toLowerCase()] = stratData.trendFilter && stratData.movingAverage ? `${stratData.movingAverage} ${constants.defaultUnit}` : null    // Trend filter (moving average)
            row[this.$t(columnsKey)[nr++].toLowerCase()] = stratData.direction    // Direction
            row[this.$t(columnsKey)[nr++].toLowerCase()] = stratData.price.offset ? `${stratData.price.ohlc} ${stratData.price.offset} ${stratData.price.unit}` : null    // Price 
            row[this.$t(columnsKey)[nr++].toLowerCase()] = stratData.expiration ? `${stratData.expiration} ${helper.pluralize(stratData.expiration, 'research.patternLab.backtestPatterns.performanceResults.patterns.day')}` : null    // Expiration
        },

        addDeleteColumn(allowed, clName) {
            let index = this.columns.indexOf(clName)

            if (allowed) {  
                if (index === -1) {   // column named clName should be in columns and isn't there -> add it to the end of columns
                    this.columns = this.columns.concat([ clName ])
                }
            } else if (index !== -1) { // otherwise -> delete it   
                this.columns.splice(index, 1)
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