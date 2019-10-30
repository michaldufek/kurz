<template>
  <div>
    <audio id="open" src="media/open.mp3" preload="auto"></audio>
    <audio id="win" src="media/win.mp3" preload="auto"></audio>
    <audio id="lose" src="media/lose.mp3" preload="auto"></audio>
    <audio id="breakEven" src="media/breakEven.mp3" preload="auto"></audio>    
    <audio id="jumpOnAsset" src="media/jumpOnAsset.mp3" preload="auto"></audio>
    <audio id="jumpOnSP500" src="media/jumpOnSP500.mp3" preload="auto"></audio>

    <div class="row">
      <div class="col-12">
        <fancy-chart :apiUrls="chartApiUrls">
        </fancy-chart>
      </div>
    </div>
  

     <div class="row">      
      <div class="col-lg-4 col-md-12">
        <card class="card">
          <h4 slot="header" class="card-title">{{$t('dashboard.dashboard.lastTradesTable.title')}}</h4>
          <div>
            <section v-if="ordersError">
              <p>{{$t('errorPrefix') + " " + $t('dashboard.dashboard.lastTradesTable.title').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else>
              <div v-if="ordersLoading">{{$t('loading') + " " + $t('dashboard.dashboard.lastTradesTable.title').toLowerCase() + "..."}}</div>
              <div v-else>
                <base-table :data="tradesData"
                            :titles="$t('terms.tradeTypes')"
                            :columns="$t('dashboard.dashboard.lastTradesTable.columns')"
                            thead-classes="text-primary">
                </base-table>
              </div>
            </section>
          </div>
        </card>
      </div>

      <div class="col-lg-4 col-md-12">  
        <card class="card">
          <h4 slot="header" class="card-title">{{$t('dashboard.dashboard.pendingOrdersTable.title')}}</h4>
          <div>
            <section v-if="ordersError">
              <p>{{$t('errorPrefix') + " " + $t('dashboard.dashboard.pendingOrdersTable.title').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else>
              <div v-if="ordersLoading">{{$t('loading') + " " + $t('dashboard.dashboard.pendingOrdersTable.title').toLowerCase() + "..."}}</div>
              <div v-else>
                <base-table :data="ordersData"
                            :titles="$t('terms.tradeTypes')"
                            :columns="$t('dashboard.dashboard.pendingOrdersTable.columns')"
                            thead-classes="text-primary">
                </base-table>
              </div>
            </section>
          </div>
        </card>
      </div>

      <div class="col-lg-4 col-md-12">
        <card class="card">
          <h4 slot="header" class="card-title">{{$t('dashboard.performanceStatistics')}}</h4>
          <div>
             <!-- with scrollers: class="table-responsive" -->
            <section v-if="statsError">
              <p>{{$t('errorPrefix') + " " + $t('dashboard.performanceStatistics').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else>
              <div v-if="statsLoading">{{$t('loading') + " " + $t('dashboard.performanceStatistics').toLowerCase() + "..."}}</div>
              <div v-else>
                <base-table :data="roundStatsData"
                            :titles="$t('terms.perfStats')"
                            :columns="$t('dashboard.dashboard.performanceStatisticsTable.columns')"
                            thead-classes="text-primary">
                            <!--  -->
                </base-table>
              </div>
            </section>
          </div>
        </card>
      </div>
    </div> 
    
  </div>
</template>
<script>
  import { BaseTable } from "@/components";
  import FancyChart from '@/custom/components/FancyChart';
  import axios from '@/../node_modules/axios';
  import helper from '@/custom/assets/js/helper';
  import constants from '@/custom/assets/js/constants';


  export default {
    components: {
      FancyChart,
      BaseTable
    },
    data() {
      return {
        tradesData: null,
        ordersData: null,
        statsData: [],
        ordersLoading: true,
        statsLoading: true,
        statsError: false,
        ordersError: false,
        heardOrders: {
          open: [],
          win: [],
          lose: [],
          breakEven: []
        }
      }
    },
    computed: {
      roundStatsData() {
        // rounds performace statistics data table to 2 mantissa places
        let newTable = []
        this.statsData.forEach(row => {
          let newRow = []
          let firstColumn = true
          this.$t("dashboard.dashboard.performanceStatisticsTable.columns").forEach(column => {
            if (firstColumn) {
              newRow[column.toLowerCase()] = row[column.toLowerCase()]
              firstColumn = false
              return
            }
            newRow[column.toLowerCase()] = row[column.toLowerCase()].toFixed(2)
          })
          newTable.push(newRow)
        })
        return newTable
      },

      chartApiUrls() {
        // get just urls from apiUrls dictionary
        let urls = []
        for (const [key, value] of Object.entries(constants.apiUrls)) {
          urls.push(value + 2)
        }
        return urls
      }
    },
    methods: {
      initTradesOrdersTablesData() {        
        this.loadTradesOrdersTablesData();

        setInterval(() => { 
          this.loadTradesOrdersTablesData();
        }, constants.dataReloadInterval );
      },

      initStatsTableData() {
        this.loadStatsTableData();
        
        setInterval(() => { 
          this.loadStatsTableData();
        }, constants.dataReloadInterval );
      },

      initSoundSignals() {
        setInterval(() => { 
          // this.checkOrdersStatusChange();
        }, constants.soundSignalInterval );
      },

      notify(audioEl, type, msg) {
        document.getElementById(audioEl).play();

        this.$notify({
          type: type, 
          message: msg
        })
      },

      checkOrdersStatusChange() {
        axios
        .get(constants.apiUrls["MF Report"])
        .then(response => {
          response.data.openTrades.forEach(openTrade => {
            if (!(openTrade.order.orderId in heardOrders.open) && openTrade.orderStatus === "Submitted") {
              this.notify('open', 'info', this.$t('notifications.open'))
              this.heardOrders.open.push(openTrade.order.orderId)
            } else if (!(openTrade.order.orderId in heardOrders.win) && openTrade.orderStatus === "Filled") {
              this.notify('win', 'success', this.$t('notifications.win'))
              this.heardOrders.win.push(openTrade.order.orderId)
            } else if (!(openTrade.order.orderId in heardOrders.lose) && openTrade.orderStatus === "Cancelled") {
              this.notify('lose', 'warning', this.$t('notifications.lose'))
              this.heardOrders.lose.push(openTrade.order.orderId)
            } else if (!(openTrade.order.orderId in heardOrders.breakEven) && openTrade.orderStatus === "Inactive") {
              this.notify('breakEven', 'info', this.$t('notifications.breakEven'))
              this.heardOrders.breakEven.push(openTrade.order.orderId)
            }
          })
        })
      },

      loadTradesOrdersTablesData() {
        this.ordersLoading = true
        // to-do: get right sources

        axios
        .get(constants.apiUrls["MF Report"])
        .then(response => {
          let tradesTableData = [];
          let ordersTableData = [];

          response.data.openTrades.forEach(openTrade => {
            let row = {}

            // symbol: openTrade.contract.symbol,
            row[this.$t('dashboard.dashboard.lastTradesTable.columns')[0].toLowerCase()] = helper.formatDateOnly(openTrade.contract.lastTradeDateOrContractMonth) // date time
            row[this.$t('dashboard.dashboard.lastTradesTable.columns')[1].toLowerCase()] = openTrade.order.action // trade type
            row[this.$t('dashboard.dashboard.lastTradesTable.columns')[2].toLowerCase()] = openTrade.order.auxPrice // result (usd)
            row[this.$t('dashboard.dashboard.lastTradesTable.columns')[3].toLowerCase()] = null // result(%)

            tradesTableData.push(row);
          });

          response.data.fills.forEach(fill => {
            let row = {}
            row[this.$t('dashboard.dashboard.pendingOrdersTable.columns')[0].toLowerCase()] = helper.formatDate(fill.time) // date
            row[this.$t('dashboard.dashboard.pendingOrdersTable.columns')[1].toLowerCase()] = fill.execution.side // trade type
            row[this.$t('dashboard.dashboard.pendingOrdersTable.columns')[2].toLowerCase()] = null // target (usd)
            row[this.$t('dashboard.dashboard.pendingOrdersTable.columns')[3].toLowerCase()] = null // stop loss (usd)
            // result: fill.execution.price,
            // PnL: fill.commissionReport.realizedNL

            ordersTableData.push(row);        

            this.tradesData = tradesTableData
            this.ordersData = ordersTableData
          });     
        })
        .catch(error => {
          console.log(error);

          this.ordersError = true;
          this.notify('connectionLost', 'danger', this.$t('notifications.connectionLost') + '(Dashboard orders)')
        })
        .finally(() => {
          this.ordersLoading = false
        });
      },

      loadStatsTableData() {
        this.statsLoading = true

        axios
        .get(constants.apiUrls["MF Report"] + 2)
        .then(response => {
          let tableData = [];
          let statsTableData = []

          // 3 Months
          tableData.push({            
            ytd: response.data.ytd,
            cagr: response.data.cagr,
            "sharpe ratio": response.data.sharpe,
            "max drawdown": response.data.maxdd,
            "equity outstanding": -33.821
          });     
          // 12 Months
          tableData.push({
            ytd: response.data.ytd,
            cagr: response.data.cagr,
            "sharpe ratio": response.data.sharpe,
            "max drawdown": response.data.maxdd,
            "equity outstanding": -33.821
          });     
          // Since Inception
          tableData.push({
            ytd: response.data.ytd,
            cagr: response.data.cagr,
            "sharpe ratio": response.data.sharpe,
            "max drawdown": response.data.maxdd,
            "equity outstanding": -33.821
          });     

          // transposing tableData
          var idCounter = 1;
          this.$t('dashboard.dashboard.performanceStatisticsTable.lines').forEach(line => {
            var jsonObj = {};
            jsonObj.id = idCounter++;
            jsonObj[this.$t("dashboard.dashboard.performanceStatisticsTable.columns")[0].toLowerCase()] = line;
            jsonObj[this.$t("dashboard.dashboard.performanceStatisticsTable.columns")[1].toLowerCase()] = tableData[0][line.toLowerCase()];
            jsonObj[this.$t("dashboard.dashboard.performanceStatisticsTable.columns")[2].toLowerCase()] = tableData[1][line.toLowerCase()];
            jsonObj[this.$t("dashboard.dashboard.performanceStatisticsTable.columns")[3].toLowerCase()] = tableData[2][line.toLowerCase()];

            statsTableData.push(jsonObj);
          });          

          this.statsData = statsTableData
        })
        .catch(error => {
          console.log(error);
          this.statsError = true
        })
        .finally(() => {
          this.statsLoading = false          
        });
      }
    },    
    mounted() {
      this.initTradesOrdersTablesData();
      this.initStatsTableData();
      this.initSoundSignals();
    }
  };
</script>
<style>
</style>