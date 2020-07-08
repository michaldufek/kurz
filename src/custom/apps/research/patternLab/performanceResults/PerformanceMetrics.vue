<template>
    <div>
        <fancy-table :title="$t(perfMetricsKey + '.title')"
                    :showTitle="false"
                    :apiUrls="patternResults"
                    :noDataText="noDataText"
                    :columns="$t(perfMetricsKey + '.columns')"
                    :rowsCreator="rowsCreator"
                    :sortable="true"
                    :filterable="true"
                    :key="tableKey">
        </fancy-table>

        <p v-if="warningText" style="color: yellow; text-align: center">{{warningText}}</p>            
    </div>
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
            perfMetricsKey: constants.translationKeys.performanceMetrics,

            loading: true,
            noDataText: '',
            warningText: '',
            tableKey: 0
        }
    },

    computed: {
        patternResults() {
            return !this.loading ? [ constants.urls.patternLab.backtestPatterns.results ] : []
        }
    },

    methods: {
        initData() {            
            let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
            if (data) {
                this.loading = data.loading
                this.tableKey++
            } else {
                this.loading = false
            }
        },

        rowsCreator(data) {
            let columns = this.$t(this.perfMetricsKey + '.columns')
            let rows = []

            data.forEach(datum => {
                let base = helper.getBacktestPatternsTableBase(datum, this.$store, this.$t(constants.translationKeys.patterns + '.columns'))

                if (datum.error) {
                    this.warningText += `Pattern results of '${base.name}' has some problems: ${datum.msg} `
                } else {
                    helper.createPerfMetricsRow(rows, datum, base)
                }
            })

            if (!rows.length && this.warningText) { // all pattern results has error
                this.noDataText = this.warningText
                this.warningText = null
            }

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