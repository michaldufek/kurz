<template>
  <div>

    <div class="row">
      <div class="col-12">
        <card type="chart">
          <div class="card-header">
            <h5 class="card-title" style="float: right;"><i class="tim-icons icon-heart-2 text-success"></i>  {{$t('chartUpdatedPrefix') + ' ' + mins2Reload + $t('chartUpdatedSuffix')}}</h5>
          </div>
          <br/>
          <div class="chart-area">
            <!-- <section v-if="statsChartErrored">
      <p>{{$t('errorPrefix') + " " + $t('dashboard.chart').toLowerCase() + ". " + $t('errorSuffix')}}</p>
    </section>
    <section v-else> -->
      <div v-if="statsChartLoading" style="text-align: center;">{{$t('loading') + " " + $t('dashboard.chart').toLowerCase() + "..."}}</div>
            <line-chart v-if="!statsChartLoading" style="height: 100%"
                        ref="bigChart"
                        chart-id="big-line-chart"
                        :chart-data="bigLineChart.chartData"
                        :gradient-colors="bigLineChart.gradientColors"
                        :gradient-stops="bigLineChart.gradientStops"
                        :extra-options="bigLineChart.extraOptions">
            </line-chart>
            <!-- to-do: interactive chart - sounds etc. -->
            <!-- </section> -->
          </div>
        </card>
      </div>
    </div>
  
     <div class="row">      
      <div class="col-lg-4 col-md-12">
        <card class="card" :header-classes="{'text-right': isRTL}">
          <h4 slot="header" class="card-title">{{$t('dashboard.dashboard.lastTradesTable.title')}}</h4>
          <div>
            <section v-if="tradesOrdersErrored">
              <p>{{$t('errorPrefix') + " " + $t('dashboard.dashboard.lastTradesTable.title').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else>
              <div v-if="tradesOrdersLoading">{{$t('loading') + " " + $t('dashboard.dashboard.lastTradesTable.title').toLowerCase() + "..."}}</div>
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
        <card class="card" :header-classes="{'text-right': isRTL}">
          <h4 slot="header" class="card-title">{{$t('dashboard.dashboard.pendingOrdersTable.title')}}</h4>
          <div>
            <section v-if="tradesOrdersErrored">
              <p>{{$t('errorPrefix') + " " + $t('dashboard.dashboard.pendingOrdersTable.title').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else>
              <div v-if="tradesOrdersLoading">{{$t('loading') + " " + $t('dashboard.dashboard.pendingOrdersTable.title').toLowerCase() + "..."}}</div>
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
        <card class="card" :header-classes="{'text-right': isRTL}">
          <h4 slot="header" class="card-title">{{$t('dashboard.performanceStatistics')}}</h4>
          <div>
             <!-- with scrollers: class="table-responsive" -->
            <section v-if="statsChartErrored">
              <p>{{$t('errorPrefix') + " " + $t('dashboard.performanceStatistics').toLowerCase() + ". " + $t('errorSuffix')}}</p>
            </section>
            <section v-else>
              <div v-if="statsChartLoading">{{$t('loading') + " " + $t('dashboard.performanceStatistics').toLowerCase() + "..."}}</div>
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
  import config from '@/config';
  import axios from '@/../node_modules/axios';
  import helper from '@/custom/assets/js/helper';

  export default {
    components: {
      LineChart,
      BaseTable
    },
    data() {
      return {
        tradesData: null,
        ordersData: null,
        statsData: [],
        tradesOrdersLoading: true,
        tradesOrdersErrored: false,
        statsChartLoading: true,
        statsChartErrored: false,
        mins2Reload: 3,
        bigLineChart: 
        {
          allData: [
            [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
            [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
            [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
          ],
          activeIndex: 0,
          chartData: null,
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
          categories: []
        }        
      }
    },
    computed: {
      enableRTL() {
        return this.$route.query.enableRTL;
      },
      isRTL() {
        return this.$rtl.isRTL;
      },
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
      }
    },
    methods: {
      initTradesOrdersTablesData() {
        // to-do: get right sources
        axios
        .get("https://app1.objectively.info/api/mfreport")
        .then(response => {
          var tradesTableData = [];
          var idCounter = 1;
          response.data.openTrades.forEach(openTrade => {
            tradesTableData.push({
              id: idCounter++,
              // symbol: openTrade.contract.symbol,
              date: helper.formatDateOnly(openTrade.contract.lastTradeDateOrContractMonth),
              "trade type": openTrade.order.action,
              "result (usd)": openTrade.order.auxPrice,
              "result (%)": null
            });        
          });

          var ordersTableData = [];
          var idCounter = 1;
          response.data.fills.forEach(fill => {
            ordersTableData.push({
              id: idCounter++,
              date: helper.formatDate(fill.time),
              "trade type": fill.execution.side,
              "target (usd)": null,
              "stop loss (usd)": null
              // result: fill.execution.price,
              // PnL: fill.commissionReport.realizedNL
            });        
          });

          this.tradesData = tradesTableData
          this.ordersData = ordersTableData          
        })
        .catch(error => {
          console.log(error);
          this.tradesOrdersErrored = true;
        })
        .finally(() => {
          this.tradesOrdersLoading = false;
          });
      },
      initStatsTablesData() {
        axios
        .get("https://app1.objectively.info/api/mfreport2")
        .then(response => {
          let tableData = [];
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

            this.statsData.push(jsonObj);
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
            labels: helper.formatDatetimes(response.data.time)
          }
          this.bigLineChart.chartData = chartData;
        })
        .catch(error => {
          console.log(error);
          this.statsChartErrored = true;
        })
        .finally(() => (this.statsChartLoading = false));
      }
    },    
    mounted() {
      this.i18n = this.$i18n;
      if (this.enableRTL) {
        this.i18n.locale = 'ar';
        this.$rtl.enableRTL();
      }
      this.initTradesOrdersTablesData();
      this.initStatsTablesData();
    },
    beforeDestroy() {
      if (this.$rtl.isRTL) {
        this.i18n.locale = 'en';
        this.$rtl.disableRTL();
      }
    }
  };
</script>
<style>
</style>