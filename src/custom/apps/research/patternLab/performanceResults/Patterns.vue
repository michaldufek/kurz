<template>

    <fancy-table :title="$t(storeKey + '.title')"
                :showTitle="false"
                :data="tableData"
                :columns="columns"
                :editable="true"
                @edited="edited"
                :headerTitle="$t(storeKey + '.title')" >
    </fancy-table>

</template>
<script>
import FancyTable from '@/custom/components/Tables/FancyTable';  
import constants from '@/custom/assets/js/constants'
import helper from '@/custom/assets/js/helper';

const storeKey = 'research.patternLab.backtestPatterns.performanceResults.patterns'
const columnsKey = storeKey + '.columns'

export default {
    components: {
        FancyTable
    },

    data() {
        return {
            storeKey: storeKey,

            assetsPatterns: null,
            strategy: null,

            tableData: null,
            columns: this.$t(columnsKey)
        }
    },

    methods: {
        initData() {              
            this.assetsPatterns = helper.getAssetsPatternsPickerData(this.$store)
            let bpData = this.$store.getItem(constants.storeKeys.backtestPatterns)  // entry/exit rules
            let eventName = null
            if (bpData) {
                ({ strategy:this.strategy, event:eventName } = bpData)
            }
            let oldTableData = this.$store.getItem(storeKey)
            let newTableData = oldTableData

            if (eventName === constants.events.addPattern && this.assetsPatterns) {
                // create new rows
                newTableData = []

                this.assetsPatterns.checkedAssets.forEach(asset => {
                    this.assetsPatterns.checkedPatterns.forEach(pattern => {
                        let row = {}
                        let clNr = 0

                        row[this.$t(columnsKey)[clNr++].toLowerCase()] = helper.formatDate(this.assetsPatterns.from)    // From
                        row[this.$t(columnsKey)[clNr++].toLowerCase()] = helper.formatDate(this.assetsPatterns.to)    // To
                        row[this.$t(columnsKey)[clNr++].toLowerCase()] = this.assetsPatterns.timeframe    // Time frame
                        row[this.$t(columnsKey)[clNr++].toLowerCase()] = asset.symbol    // Asset
                        row[this.$t(columnsKey)[clNr++].toLowerCase()] = pattern.name    // Pattern

                        if (this.strategy) {   
                            this.updateRow(row, clNr, this.strategy)                            
                        }                                            

                        newTableData.push(row)
                    })
                })
            } else if (eventName === constants.events.runStrategy && this.strategy) {
                // update rows with new strategy data

                newTableData = []

                oldTableData.forEach(row => {
                    let clNr = 3    // starting from asset column (for the if)

                    if (this.assetsPatterns.checkedAssets.map(ca => ca.symbol).includes(row[this.$t(columnsKey)[clNr++].toLowerCase()]) 
                        && this.assetsPatterns.checkedPatterns.map(cp => cp.name).includes(row[this.$t(columnsKey)[clNr++].toLowerCase()])) {
                            this.updateRow(row, clNr, this.strategy) 
                        }

                    newTableData.push(row)
                })
            }

            this.tableData = newTableData
            this.$store.setItem(storeKey, this.tableData)
            this.$store.setItem(constants.storeKeys.backtestPatterns, { strategy: this.strategy })      // eliminate event
        },
        updateRow(row, clNr, stratData) {
            row[this.$t(columnsKey)[clNr++].toLowerCase()] = stratData.initialCapital ? `${stratData.initialCapital} ${constants.defaultUnit}` : null    // Initial capital
            row[this.$t(columnsKey)[clNr++].toLowerCase()] = stratData.analyze ? `${stratData.analyze} ${helper.pluralize(stratData.analyze, storeKey + '.bar')}` : null    // Analyze
            row[this.$t(columnsKey)[clNr++].toLowerCase()] = stratData.profit_take.value ? `${stratData.profit_take.value} ${stratData.profit_take.unit}` : null    // Profit Target
            row[this.$t(columnsKey)[clNr++].toLowerCase()] = stratData.stoploss.value ? `${stratData.stoploss.value} ${stratData.stoploss.unit}` : null    // Stop Loss
            row[this.$t(columnsKey)[clNr++].toLowerCase()] = stratData.trendFilter && stratData.ma_filter_period ? `${stratData.ma_filter_period} ${constants.defaultUnit}` : null    // Trend filter (moving average)
            row[this.$t(columnsKey)[clNr++].toLowerCase()] = stratData.direction    // Direction
        },

        // FancyTable emited event
        edited(data) {
            // check if new value is valid
            switch(data.position[1]) {
                case this.$t(columnsKey)[0]:   // From
                case this.$t(columnsKey)[1]:   // To
                    if (isNaN(new Date(data.value).getMonth())) {
                        return
                    }
                    break;
                case this.$t(columnsKey)[2]:   // Time frame
                    if (helper.convertTimeframe(data.value) === -1) {
                        return
                    }
                    break
                case this.$t(columnsKey)[3]:   // Asset
                    if (!this.assetsPatterns.selectedAssets.map(sa => sa.symbol).includes(data.value)) {
                        return
                    }
                    break
                case this.$t(columnsKey)[4]:   // Pattern
                    if (!this.assetsPatterns.selectedPatterns.map(sa => sa.name).includes(data.value)) {
                        return
                    }
                    break
                case this.$t(columnsKey)[5]:   // Initial capital
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${constants.defaultUnit}`
                    break
                case this.$t(columnsKey)[6]:   // Analyze
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${helper.pluralize(data.value, storeKey + '.bar')}`
                    break
                case this.$t(columnsKey)[7]:   // Profit Target
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${this.strategy.profit_take.unit}`
                    break
                case this.$t(columnsKey)[8]:   // Stop Loss
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${this.strategy.stoploss.unit}`
                    break
                case this.$t(columnsKey)[9]:   // Trend filter (moving average)
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${constants.defaultUnit}`
                    break
                case this.$t(columnsKey)[10]:   // Direction
                    if (!this.$t('research.patternLab.backtestPatterns.entryRules.directions').includes(data.value)) {
                        return
                    }
                    break
                default:
                    return
            }

            this.tableData[data.position[0]][data.position[1].toLowerCase()] = data.value
            this.$store.setItem(storeKey, this.tableData)
        }
    },

    mounted() {
        this.initData()
    }
}
</script>
<style scoped>

</style>