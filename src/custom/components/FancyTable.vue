<template>
  <card class="card">
    <h4 v-if="showTitle" slot="header" class="card-title">{{title}}</h4>
    <div>
      <section v-if="isError">
        <p>{{$t('errorPrefix') + " " + title.toLowerCase() + ". " + $t('errorSuffix')}}</p>
      </section>
      <section v-else>
        <DualRingLoader v-if="loading" :color="'#54f1d2'" style="width: 80px; height: 80px; position: absolute; top: 40%; left: 45%;" />
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
import { BaseTable } from "@/components";
import axios from '@/../node_modules/axios';

export default {
  name: 'fancy-table',
  props: {
    title: {
      type: String,
      description: "Chart title"
    },
    showTitle: {
      type: Boolean,
      default: false,
      description: "Whether to show chart title"
    },
    dataDefinitions: {
      type: Object,
      default: () => {
        return [{
          apiUrl: null,
          responseField: null,
          getters: [
            { 
              tranformFunc: () => {},
              subFields: [null, null]
            }
          ]
        }]
      },
      description: "URLs to API data sources"
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
      tableData: null
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
      this.tableData = []

      this.dataDefinitions.forEach(dataDef => {
        this.loading = true

        axios
        .get(dataDef.apiUrl)
        .then(response => {
          let newTableData = [];

          response.data[dataDef.responseField].forEach(item => {
            let row = {}

            let i = 0
            for (var column in columns) {
              row[column.toLowerCase()] = dataDef.getters[i].transformFunc(item[dataDef.getters[i].subFields[0]][dataDef.getters[i].subFields[1]])
              // row[columns[0].toLowerCase()] = helper.formatDateOnly(openTrade.contract.lastTradeDateOrContractMonth) // date time
              // row[columns[1].toLowerCase()] = openTrade.order.action // trade type
              // row[columns[2].toLowerCase()] = openTrade.order.auxPrice // result (usd)
              // row[columns[3].toLowerCase()] = null // result(%)
              i++
            }

            newTableData.push(row);
          });

          // response.data.fills.forEach(fill => {
          //   let row = {}
          //   row[this.$t('dashboard.dashboard.pendingOrdersTable.columns')[0].toLowerCase()] = helper.formatDate(fill.time) // date
          //   row[this.$t('dashboard.dashboard.pendingOrdersTable.columns')[1].toLowerCase()] = fill.execution.side // trade type
          //   row[this.$t('dashboard.dashboard.pendingOrdersTable.columns')[2].toLowerCase()] = null // target (usd)
          //   row[this.$t('dashboard.dashboard.pendingOrdersTable.columns')[3].toLowerCase()] = null // stop loss (usd)
          //   // result: fill.execution.price,
          //   // PnL: fill.commissionReport.realizedNL

          //   ordersTableData.push(row);        

          // });    

          this.tableData = newTableData
          this.error = false
        })
        .catch(error => {
          console.log(error);

          this.error = this.error && true // to-do: test it works OK
          this.notifyAudio('connectionLost', 'danger', this.$t('notifications.connectionLost') + '(' + this.title + ' table)')
        })
        .finally(() => {
          this.loading = false
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
</style>
