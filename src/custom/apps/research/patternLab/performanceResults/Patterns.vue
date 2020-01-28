<template>

        <fancy-table :title="$t(patternsKey + '.title')"
                     :showTitle="false"
                     :data="tableData"
                     :columns="columns"
                     :editable="true"
                     @edited="edited" />

</template>
<script>
import FancyTable from '@/custom/components/Tables/FancyTable';  
import constants from '@/custom/assets/js/constants'
import helper from '@/custom/assets/js/helper';


export default {
    components: {
        FancyTable
    },

    data() {
        return {
            patternsKey: constants.patternsKey,
            assetsPatterns: null,
            tableData: null,
            columns: this.$t(constants.patternsKey + '.columns')
        }
    },

    methods: {
        initData() { 
            this.assetsPatterns = helper.getAssetsPatternsPickerData(this.$store)
            let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
            if (data) {
                this.tableData = data.backtests          
            }
        },        

        // FancyTable emited event
        edited(data) {
            // check if new value is valid
            switch(data.position[1]) {
                case this.columns[0]:   // From
                case this.columns[1]:   // To
                    if (isNaN(new Date(data.value).getMonth())) {
                        return
                    }
                    break;
                case this.columns[2]:   // Time frame
                    if (helper.convertTimeframe(data.value) === -1) {
                        return
                    }
                    break
                case this.columns[3]:   // Asset
                    if (!this.assetsPatterns.selectedAssets.map(sa => sa.symbol).includes(data.value)) {
                        return
                    }
                    break
                case this.columns[4]:   // Pattern
                    if (!this.assetsPatterns.selectedPatterns.map(sa => sa.name).includes(data.value)) {
                        return
                    }
                    break
                case this.columns[5]:   // Initial capital
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${constants.defaultUnit}`
                    break
                case this.columns[6]:   // Analyze
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${helper.pluralize(data.value, constants.patternsKey + '.bar')}`
                    break
                case this.columns[7]:   // Profit Target
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${this.tableData[data.position[0]][this.columns[7].toLowerCase()].split(' ')[1]}`
                    break
                case this.columns[8]:   // Stop Loss
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${this.tableData[data.position[0]][this.columns[8].toLowerCase()].split(' ')[1]}`
                    break
                case this.columns[9]:   // Trend filter (moving average)
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${constants.defaultUnit}`
                    break
                case this.columns[10]:   // Direction
                    if (!this.$t('research.patternLab.backtestPatterns.entryRules.directions').includes(data.value)) {
                        return
                    }
                    break
                default:
                    return
            }

            this.tableData[data.position[0]][data.position[1].toLowerCase()] = data.value
            helper.updateStore(this.$store, 'backtests', this.tableData, constants.storeKeys.backtestPatterns)
        }
    },

    mounted() {
        this.initData()
    }
}
</script>
<style scoped>
</style>