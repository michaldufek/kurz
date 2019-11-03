<template>
  <card class="card">
    <h4 slot="header" class="card-title">{{title}}</h4>
    <div>
      <section v-if="isError">
        <p>{{$t('errorPrefix') + " " + title.toLowerCase() + ". " + $t('errorSuffix')}}</p>
      </section>
      <section v-else>
        <DualRingLoader v-if="loading" :color="'#54f1d2'" :class="[finishedLoadings ? dataClass : noDataClass, loaderClass]"/>
        <base-table :data="tableData"
                    :titles="titles"
                    :columns="columns"
                    thead-classes="text-primary">
        </base-table>
      </section>
    </div>
  </card>
</template>
<script>
import BaseTable from './BaseTable.vue';
import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';

import axios from '@/../node_modules/axios';
import constants from '@/custom/assets/js/constants';


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
    apiUrls: {
      type: Array,
      default: () => [],
      description: "URLs to API data sources"
    },
    rowsCreator: {
      type: Function,
      default: (responseData) => {
        return [new Array(this.columns.length)]
      },
      description: "How to create rows values (of shape [#rows, #columns]) from response.data"
    },
    aggregator: {
      type: Function,
      default: (oldRows, newRows) => {
        return [new Array(this.columns.length)]
      },
      description: "How to aggregate created rows from all sources (result of shape [#oldRows + #newRows, #columns])"
    },    
    titles: {
      type: Object,
      default: () => {},
      description: "Table data values descriptions"
    },
    columns: {
      type: Array,
      default: () => [],
      description: "Table columns"
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
      this.loading = true
      this.error = false      

      this.apiUrls.forEach(apiUrl => {
        axios
        .get(apiUrl)
        .then(response => {
          if (!this.finishedLoadings) {
            this.tableData = []
          }

          let newTableData = [];
          let rowsValues = this.rowsCreator(response.data)

          rowsValues.forEach(rowValues => {
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
          this.tableData = this.aggregator(this.tableData, newTableData)
        })
        .catch(error => {
          console.log(error);

          if (++errorLoadings === this.apiUrls.length) {
            this.error = true
          }
          this.notifyAudio('connectionLost', 'danger', this.$t('notifications.connectionLost') + '(' + this.title + ' table)')
        })
        .finally(() => {
          if (++this.finishedLoadings === this.apiUrls.length) {
            this.loading = false
          }
        });
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
