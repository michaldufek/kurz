<template>
  <div>
    <audio id="open" src="media/open.mp3" preload="auto"></audio>
    <audio id="win" src="media/win.mp3" preload="auto"></audio>
    <audio id="lose" src="media/lose.mp3" preload="auto"></audio>
    <audio id="breakEven" src="media/breakEven.mp3" preload="auto"></audio>    
    <!-- <audio id="jumpOnAsset" src="media/jumpOnAsset.mp3" preload="auto"></audio> -->
    <audio id="jumpOnSP500" src="media/jumpOnSP500.mp3" preload="auto"></audio>

    <div class="row">
      <div class="col-12">
        <fancy-chart title="Dashboard"
                     :fullTitle="$t('dashboard.chart')"
                     :apiUrls="apiUrls(forChart=true)">
        </fancy-chart>
      </div>
    </div>  

     <div class="row">      
      <div class="col-lg-4 col-md-12">
        <fancy-table :title="$t('dashboard.lastTradesTable.title')"
                     :apiUrls="apiUrls()"
                     :rowsCreator="tradesRowsCreator"
                     :aggregator="tradesAggregator"
                     :titles="$t('terms.tradeTypes')"
                     :columns="$t('dashboard.lastTradesTable.columns')">
        </fancy-table>
      </div>

      <div class="col-lg-4 col-md-12">  
        <fancy-table :title="$t('dashboard.pendingOrdersTable.title')"
                     :apiUrls="apiUrls()"
                     :rowsCreator="ordersRowsCreator"
                     :aggregator="ordersAggregator"
                     :titles="$t('terms.tradeTypes')"
                     :columns="$t('dashboard.pendingOrdersTable.columns')">
        </fancy-table>
      </div>

      <div class="col-lg-4 col-md-12">
        <fancy-table :title="$t('dashboard.performanceStatistics')"
                     :apiUrls="apiUrls(forChart=true)"
                     :rowsCreator="statsRowsCreator"
                     :aggregator="statsAggregator"
                     :titles="$t('terms.perfStats')"
                     :columns="$t('dashboard.performanceStatisticsTable.columns')">
        </fancy-table>
      </div>
    </div> 
    
  </div>
</template>
<script>
  import FancyChart from '@/custom/components/FancyChart';
  import FancyTable from '@/custom/components/FancyTable';

  import axios from '@/../node_modules/axios';
  import helper from '@/custom/assets/js/helper';
  import constants from '@/custom/assets/js/constants';


  export default {
    components: {
      FancyChart,
      FancyTable
    },
    data() {
      return {
        heardOrders: {
          open: [],
          win: [],
          lose: [],
          breakEven: []
        }
      }
    },

    methods: {
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
        // to-do: right definitions when to notify (blocker: BE)
        axios
        .get(constants.reportUrls["MF Report"])
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

      // fancy-tables props functions
      tradesRowsCreator(responseData) {
        let rows = []

        responseData.openTrades.forEach(openTrade => {
            let row = []

            // symbol: openTrade.contract.symbol,
            row.push(helper.formatDateOnly(openTrade.contract.lastTradeDateOrContractMonth)) // date time
            row.push(openTrade.order.action) // trade type
            row.push(openTrade.order.auxPrice) // result (usd)
            // result(%)

            rows.push(row);
          });

        return rows
      },

      ordersRowsCreator(responseData) {
        let rows = []

        responseData.fills.forEach(fill => {
            let row = []

            row.push(helper.formatDate(fill.time)) // date
            row.push(fill.execution.side) // trade type
            // target (usd)
            // stop loss (usd)
            // result: fill.execution.price,
            // PnL: fill.commissionReport.realizedNL

            rows.push(row);
        })

        return rows
      },

      statsRowsCreator(responseData) {
        let rows = [];
        let rowsT = []

        // 3 Months
        rows.push({            
          ytd: responseData.ytd,
          cagr: responseData.cagr,
          "sharpe ratio": responseData.sharpe,
          "max drawdown": responseData.maxdd,
          "equity outstanding": -33.821
        });     
        // 12 Months
        rows.push({
          ytd: responseData.ytd,
          cagr: responseData.cagr,
          "sharpe ratio": responseData.sharpe,
          "max drawdown": responseData.maxdd,
          "equity outstanding": -33.821
        });     
        // Since Inception
        rows.push({
          ytd: responseData.ytd,
          cagr: responseData.cagr,
          "sharpe ratio": responseData.sharpe,
          "max drawdown": responseData.maxdd,
          "equity outstanding": -33.821
        });     

        // transposing rows
        this.$t('dashboard.performanceStatisticsTable.lines').forEach(line => {
          var row = []

          row.push(line)
          rows.forEach(origRow => row.push(origRow[line.toLowerCase()]))

          rowsT.push(row);
        });          

        return rowsT
      },

      tradesAggregator(oldRows, newRows) {
        return oldRows.concat(newRows).sort((row1, row2) => {
          // sort in descending order by dateTime
          let sortCl = this.$t('dashboard.lastTradesTable.columns')[0].toLowerCase()
          if (row1[sortCl] > row2[sortCl]) return -1;
          if (row1[sortCl] < row2[sortCl]) return 1;
          /* else */ return 0;
        })
      },

      ordersAggregator(oldRows, newRows) {
        return oldRows.concat(newRows).sort((row1, row2) => {
          // sort in descending order by dateTime
          let sortCl = this.$t('dashboard.pendingOrdersTable.columns')[0].toLowerCase()
          if (row1[sortCl] > row2[sortCl]) return -1;
          if (row1[sortCl] < row2[sortCl]) return 1;
          /* else */ return 0;
        })
      },

      statsAggregator(oldRows, newRows) {
        const roundStatsData = (statsData) => {
          // rounds performace statistics data table to 2 mantissa places
          let newTable = []

          statsData.forEach(row => {
            let newRow = []
            let firstColumn = true

            this.$t("dashboard.performanceStatisticsTable.columns").forEach(column => {
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

        // average values at same place (to-do: except eq.outs. - only sum these)
        let rows = []
        if (!oldRows.length || !newRows.length) {
          rows = oldRows.concat(newRows)
        } else {
          let rowNr = 0

          oldRows.forEach(oldRow => {
            let aggRow = []
            let valNr = 0

            oldRow.forEach(oldVal => { 
              if (valNr) {
                aggRow.push((oldVal + newRows[rowNr][valNr]) / 2)
              }
              valNr++
            })

            rows.push(aggRow)
            rowNr++
          })
        }

        return roundStatsData(rows)
      },

      apiUrls(forChart=false) {
        // get just urls from reportUrls dictionary
        let urls = []
        for (const [key, value] of Object.entries(constants.reportUrls)) {
          urls.push(value + (forChart ? 2 : ""))
        }
        return urls
      }
    },

    mounted() {
      this.initSoundSignals();
    }
  };
</script>
<style>
</style>