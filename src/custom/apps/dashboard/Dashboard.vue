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
        .get(constants.urls.stats["MF Report"])
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

            row.push(helper.formatDateOnly(openTrade.contract.lastTradeDateOrContractMonth)) // date and time
            row.push(openTrade.order.action) // trade type
            row.push(openTrade.order.auxPrice) // result (%)
            // result (usd)

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
        return helper.sortAggregator(oldRows, newRows, this.$t('dashboard.lastTradesTable.columns')[0].toLowerCase())
      },

      ordersAggregator(oldRows, newRows) {
        return helper.sortAggregator(oldRows, newRows, this.$t('dashboard.pendingOrdersTable.columns')[0].toLowerCase())
      },

      statsAggregator(oldRows, newRows) {
        // average values at same place (to-do: except eq.outs. - only sum these)
        let rows = []
        if (!oldRows.length || !newRows.length) {
          rows = oldRows.concat(newRows)
        } else {
          let rowNr = 0

          oldRows.forEach(oldRow => {
            let aggRow = {}

            for (const [key, oldVal] of Object.entries(oldRow)) {
              let newVal = oldVal
              if (!isNaN(Number(newVal))) {
                newVal = (Number(newVal) + newRows[rowNr][key]) / 2
              }
              aggRow[key] = newVal
            }

            rows.push(aggRow)
            rowNr++
          })
        }

        return rows // roundStatsData(rows)
      },

      apiUrls(forChart=false) {
        // get just urls from named urls dictionary
        let urls = []

        if (forChart) {
          var type = 'chart'
        } else {
          type = 'stats'          
        }
        for (const [key, value] of Object.entries(constants.urls[type])) {
          urls.push(value)
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