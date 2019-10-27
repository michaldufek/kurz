<template>
  <div>

    <div class="row">
      <div class="col-12">
        <card type="chart">
          <div class="card-header">
            <h5 class="card-title" style="float: right;"><i class="tim-icons icon-heart-2" :class="{ 'text-success': live }" style="color:red"></i>  {{updateTs | chartUpdateTsText}}</h5>
          </div>
          <br/>
          <div class="chart-area" style="height: 400px">
            <section v-if="isChartError" style="text-align: center">
              <p >{{$t('errorPrefix') + " " + $t('dashboard.chart').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else>
              <DualRingLoader v-if="statsLoading" :color="'#54f1d2'" style="width: 80px; height: 80px;position: absolute;top: 40%;left: 45%;" />
              <!-- <div  style="text-align: center;">{{$t('loading') + " " + $t('dashboard.chart').toLowerCase() + "..."}}</div> -->
              <line-chart ref="bigChart"
                          chart-id="big-line-chart"
                          :chart-data="bigLineChart.chartData"
                          :gradient-colors="bigLineChart.gradientColors"
                          :gradient-stops="bigLineChart.gradientStops"
                          :extra-options="bigLineChart.extraOptions">
              </line-chart>
              <!-- to-do: interactive chart - sounds etc. -->
            </section>
          </div>
        </card>
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
                            :columns="$t('dashboard.dashboard.performanceStatisticsTable.columns')"
                            thead-classes="text-primary">
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
  import LineChart from '@/components/Charts/LineChart';
  import * as chartConfigs from '@/components/Charts/config';
  import { BaseTable } from "@/components";
  import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';

  import config from '@/config';
  import axios from '@/../node_modules/axios';

  import helper from '@/custom/assets/js/helper';
  import constants from '@/custom/assets/js/constants';


  export default {
    components: {
      LineChart,
      BaseTable,
      DualRingLoader
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
        updateTs: null,
        live: false,
        bigLineChart: 
        {
          allData: [
            [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
            [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
            [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
          ],
          activeIndex: 0,
          chartData: {
                datasets: [{
                  data: []
                }],
                labels: []
          },
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
          categories: []
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

      isChartError() {
        return !this.bigLineChart.chartData.datasets[0].data.length && this.statsError
      }
    },
    methods: {
      initTradesOrdersTablesData() {        
        this.loadTradesOrdersTablesData();

        setInterval(() => { 
          this.loadTradesOrdersTablesData();
        }, constants.dataReloadInterval );
      },

      initStatsTablesData() {
        this.loadStatsTablesData();
        
        setInterval(() => { 
          this.loadStatsTablesData();
        }, constants.dataReloadInterval );
      },

      initSoundSignals() {
        setInterval(() => { 
          // this.checkOrdersStatusChange();
        }, constants.soundSignalInterval );
      },

      checkOrdersStatusChange() {
                  // seen_orders = []
          // listOfOders = [{fills: }, 
          // {stopLosses: }, 
          // profitTarget: }]
          // if orderId not in seen_orders and orderStatus == "filled"
          // zahraj sound1.avi
          // seen_orders.append(orderId)
      },

      loadTradesOrdersTablesData() {
        this.ordersLoading = true
        // to-do: get right sources

        axios
        .get("https://app1.objectively.info/api/mfreport")
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
        })
        .finally(() => {
          this.ordersLoading = false
        });
      },

      loadStatsTablesData() {
        this.statsLoading = true

        axios
        .get("https://app1.objectively.info/api/mfreport2")
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

          let chartData = {
            datasets: [{
              fill: true,
              borderColor: config.colors.primary,
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: config.colors.primary,
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: config.colors.primary,
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: response.data.equity
            }],
            labels: helper.formatDateTimes(response.data.time)
          }

          this.statsData = statsTableData
          this.bigLineChart.chartData = chartData;
          this.live = true
          this.updateTs = Date.now()
        })
        .catch(error => {
          console.log(error);
          this.statsError = true;
          this.live = false
        })
        .finally(() => {
          this.statsLoading = false          
        });
      }
    },    
    mounted() {
      this.initTradesOrdersTablesData();
      this.initStatsTablesData();
      this.initSoundSignals();
    }
  };
</script>
<style>
</style>