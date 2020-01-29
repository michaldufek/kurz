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
            let clNr = 0

            switch(data.position[1]) {
                case this.columns[clNr++]:  // Name - no need to check, just note that it was changed (because it should be in 'bt_name (bt_id)' format)
                    this.tableData[data.position[0]]['defaultName'] = false
                    data.value = `${data.value} (${this.tableData[data.position[0]]['btId']})`
                    break
                case this.columns[clNr++]:   // From
                case this.columns[clNr++]:   // To
                    if (isNaN(new Date(data.value).getMonth())) {
                        return
                    }
                    break;
                case this.columns[clNr++]:   // Time frame
                    if (helper.convertTimeframe(data.value) === -1) {
                        return
                    }
                    break
                case this.columns[clNr++]:   // Asset
                    if (!this.assetsPatterns.selectedAssets.map(sa => sa.symbol).includes(data.value)) {
                        return
                    }
                    break
                case this.columns[clNr++]:   // Pattern
                    if (!this.assetsPatterns.selectedPatterns.map(sa => sa.name).includes(data.value)) {
                        return
                    }
                    break
                case this.columns[clNr++]:   // Initial capital
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${constants.defaultUnit}`
                    break
                case this.columns[clNr++]:   // Analyze
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${helper.pluralize(data.value, constants.patternsKey + '.bar')}`
                    break
                case this.columns[clNr++]:   // Profit Target
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${this.tableData[data.position[0]][this.columns[clNr-1].toLowerCase()].split(' ')[1]}`
                    break
                case this.columns[clNr++]:   // Stop Loss
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${this.tableData[data.position[0]][this.columns[clNr-1].toLowerCase()].split(' ')[1]}`
                    break
                case this.columns[clNr++]:   // Trend filter (moving average)
                    if (isNaN(Number(data.value))) {
                        return
                    }
                    data.value = `${data.value} ${constants.defaultUnit}`
                    break
                case this.columns[clNr++]:   // Direction
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