<template>
  <card class="card">
    <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>
    <h4 v-if="showTitle" slot="header" class="card-title">{{title}}</h4>
    <div>
      <section v-if="isError">
        <p>{{ $t('dataError') }}</p>
      </section>
      <section v-else>
        <DualRingLoader v-if="loading" :color="'#54f1d2'" :class="[finishedLoadings ? dataClass : noDataClass, loaderClass]"/>
        <base-table :data="tableData"
                    :titles="titles"
                    :columns="columns"
                    thead-classes="text-primary"
                    :sortable="sortable"
                    :filtrable="filtrable"
                    :headerTitle="headerTitle">
        </base-table>
      </section>
    </div>
  </card>
</template>
<script>
import BaseTable from './BaseTable.vue';
import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';

import constants from '@/custom/assets/js/constants';
import helper from '@/custom/assets/js/helper';


export default {
  name: 'fancy-table',
  components: {
    BaseTable,
    DualRingLoader    
  },
  props: {
    title: {
      type: String,
      description: "Table title"
    },
    showTitle: {
      type: Boolean,
      default: true,
      description: "Whether to show table title"
    },
    apiUrls: {
      type: Array,
      default: () => [],
      description: "URLs to API data sources"
    },
    rowsCreator: {
      type: Function,
      default: (responseData) => {
        return responseData
      },
      description: "How to create rows values (of shape [#rows, #columns]) from response data"
    },
    aggregator: {
      type: Function,
      default: (oldRows, newRows, weight) => {
        return helper.weightedAverageAggregator(oldRows, newRows, weight)
      },
      description: "How to aggregate created rows from all sources (result of shape [#oldRows + #newRows, #columns])"
    },    
    titles: {
      type: Object,
      default: () => {},
      description: "Table data values descriptions"
    },
    headerTitle: {
      type: String,
      description: "Table header description"
    },
    columns: {
      type: Array,
      default: () => [],
      description: "Table columns"
    },
    sortable: {
      type: Boolean,
      description: "Whether columns can be sorted by header click"
    },
    filtrable: {
      type: Boolean,
      description: "Whether columns can be filtered by header double-click"
    },
  },

  data() {
    return {
      error: false,
      loading: false,
      tableData: [],
      finishedLoadings: 0,
      
      // css classes
      dataClass: 'data',      
      noDataClass: 'noData',
      loaderClass: 'loader'
    }
  },

  computed: {
    isError() {
      return !this.tableData.length && this.error
    }
  },

  methods: {
    initData() {
      this.loadData();
        
      setInterval(() => { 
        this.loadData();
      }, constants.dataReloadInterval );
    },

    loadData() {
      this.finishedLoadings = 0
      let errorLoadings = 0
      if (this.apiUrls.length > 0) {
        this.loading = true
        this.error = false
      }

      const loadRoutine = () => new Promise ((resolve, reject) => {           
        let responses = []

        this.apiUrls.forEach(apiUrl => {
          this.$http
          .get(apiUrl)
          .then(response => {
            if (!this.finishedLoadings) {
              this.tableData = []
            }

            responses.push(response)          
          })
          .catch(error => {
            console.log(error);
            if (++errorLoadings === this.apiUrls.length) {
              this.error = true
              reject()
            }

            if (error.message === constants.strings.networkError) {
              this.notifyAudio('connectionLost', 'warning', this.$t('notifications.beConnectionLost') + '(' + this.title + ' ' + this.$t('table') + ')')
            }
          })
          .finally(() => {
            if (++this.finishedLoadings === this.apiUrls.length) {
              this.loading = false
              resolve(responses)
            }
          });
        })
      })

      loadRoutine()
      .then((responses) => {
        let eqOutsSum = 0
        responses.forEach(response => eqOutsSum += (response.data.equity ? response.data.equity[response.data.equity.length - 1] : 0))

        responses.forEach(response => {
          let newTableData = [];

          this.rowsCreator(response.data).forEach(rowValues => {
            let row = {}
            let clNr = 0

            // add keys to values (ie.column names)
            this.columns.forEach(column => {
              row[column.toLowerCase()] = clNr > rowValues.length - 1 ? null : rowValues[clNr]
              clNr++
            })

            newTableData.push(row);
          });

          // aggregation
          let weight = response.data.equity ? response.data.equity[response.data.equity.length - 1] / eqOutsSum : 1
          this.tableData = this.aggregator(this.tableData, newTableData, weight).slice(0, constants.maxRows)
        })
      })
    },   

    notifyAudio(audioEl, type, msg) {
      document.getElementById(audioEl).play();

      this.$notify({
        type: type, 
        message: msg
      })
    }
  },

  mounted() {
    this.initData();
  }
};
</script>
<style>
.loader {
  width: 80px; 
  height: 80px;  
  position: absolute; 
}

.loader.noData {
  top: 20%; 
  left: 40%;    
}

.loader.data {
  top: 40%; 
  left: 42.5%;
}
</style>
