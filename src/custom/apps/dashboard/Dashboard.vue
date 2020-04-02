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
        <fancy-chart :title="$t('dashboard.title')"
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
                     :titles="$t('terms.perfStats')"
                     :columns="$t('dashboard.performanceStatisticsTable.columns')">
        </fancy-table>

        <div v-if="connected" style="float: right;">
          <DualRingLoader v-if="loading" :color="'#54f1d2'" style="width: 80px; height: 80px;margin-right: 50px;margin-bottom: -35px;" />
          <base-button type="secondary" class="my-4" @click="liquidate">{{$t('dashboard.liquidate')}}</base-button>
          <p :class="[ error ? errorClass : noErrorClass , msgClass ]">{{message}}</p>
        </div>        
      </div>
    </div> 
    
  </div>
</template>
<script>
  import FancyChart from '@/custom/components/Charts/FancyChart';
  import FancyTable from '@/custom/components/Tables/FancyTable';
  import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';

  import helper from '@/custom/assets/js/helper';
  import constants from '@/custom/assets/js/constants';


  export default {
    components: {
      FancyChart,
      FancyTable,
      DualRingLoader
    },

    data() {
      return {
        connected: false,
        email: '',
        error: false,
        message: '',
        loading: false,

        heardOrders: {
          open: [],
          win: [],
          lose: [],
          breakEven: []
        },
        
        // css classes
        msgClass: 'message',
        noErrorClass: 'noError',
        errorClass: 'error'
      }
    },

    methods: {
      initSoundSignals() {
        setInterval(() => { 
          // this.checkOrdersStatusChange();
        }, constants.intervals.soundSignal );
      },

      initIB() {
        let data = this.$store.getItem(constants.translationKeys.IBLogin)
        if (data) {
          this.connected = data.connected
          this.email = data.email
        }
      },

      notify(audioEl, type, msg) {
        document.getElementById(audioEl).play();

        this.$notify({
          type: type, 
          message: msg
        })
      },

      liquidate() {
        this.$confirm(this.$t('dashboard.confirmLiquidate'))
        .then(() => {
          this.loading = true

          this.$http
          .post(constants.urls.liveDepl.liquidate, { userid: this.email })
          .then(response => {
            this.error = false
            this.message = response.data.message
          })
          .catch(error => {
            console.log(error)
            this.error = true

            if (error.message === constants.strings.networkError) {
                helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', `${this.$t('dashboard.title')} ${this.$t('dashboard.liquidate')}`)
                this.message = error.message
            }

            if ('type' in error.response.data) {
                this.message = error.response.data.type + ' error'

                if ('message' in error.response.data) {
                    this.message += ': ' + error.response.data.message
                } else {
                    this.message += '.'
                }
            }                
          })
          .finally(() => this.loading = false)
        })
        .catch(_ => {})
      },

      checkOrdersStatusChange() {
        // to-do: right definitions when to notify (blocker: BE)
        this.$http
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
        let row = {}
        let rows = [];
        let rowsT = []
        let eqOut = responseData.equity[responseData.equity.length - 1]
        
        // 3 Months
        row[this.$t('dashboard.performanceStatisticsTable.lines')[0].toLowerCase()] = helper.ytd(responseData, 1) + ' %' // YTD
        row[this.$t('dashboard.performanceStatisticsTable.lines')[1].toLowerCase()] = helper.cagr(responseData.equity, 1) + ' %' // CAGR
        row[this.$t('dashboard.performanceStatisticsTable.lines')[2].toLowerCase()] = responseData.sharpe + ' &nbsp;&nbsp;' // Sharpe Ratio // to-do: BE - sharpe for 3m and 12m bases
        row[this.$t('dashboard.performanceStatisticsTable.lines')[3].toLowerCase()] = helper.maxDD(responseData, 1) + ' %' // Max DrawDown
        row[this.$t('dashboard.performanceStatisticsTable.lines')[4].toLowerCase()] = eqOut + ' $' // Equity Outstanding
        rows.push(row) 

        // 12 Months
        row = {}
        row[this.$t('dashboard.performanceStatisticsTable.lines')[0].toLowerCase()] = helper.ytd(responseData, 4) + ' %'
        row[this.$t('dashboard.performanceStatisticsTable.lines')[1].toLowerCase()] = helper.cagr(responseData.equity, 4) + ' %'
        row[this.$t('dashboard.performanceStatisticsTable.lines')[2].toLowerCase()] = responseData.sharpe + ' &nbsp;&nbsp;'
        row[this.$t('dashboard.performanceStatisticsTable.lines')[3].toLowerCase()] = helper.maxDD(responseData, 4) + ' %'
        row[this.$t('dashboard.performanceStatisticsTable.lines')[4].toLowerCase()] = eqOut + ' $'
        rows.push(row)  

        // Since Inception
        row = {}
        row[this.$t('dashboard.performanceStatisticsTable.lines')[0].toLowerCase()] = responseData.ytd + ' %'
        row[this.$t('dashboard.performanceStatisticsTable.lines')[1].toLowerCase()] = responseData.cagr + ' %'
        row[this.$t('dashboard.performanceStatisticsTable.lines')[2].toLowerCase()] = responseData.sharpe + ' &nbsp;&nbsp;'
        row[this.$t('dashboard.performanceStatisticsTable.lines')[3].toLowerCase()] = responseData.maxdd + ' %'
        row[this.$t('dashboard.performanceStatisticsTable.lines')[4].toLowerCase()] = eqOut + ' $'
        rows.push(row)     

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

      apiUrls(forChart=false) {
        let urls = []

        this.initIB()

        if (this.connected) {
          urls.push(constants.urls.liveDepl.report + this.email)
        }
        else {
          // get just urls from named urls dictionary
          if (forChart) {
            var type = 'chart'
          } else {
            type = 'stats'          
          }
          for (const [key, value] of Object.entries(constants.urls[type])) {
            urls.push(value)
          }
        }

        return urls
      }
    },

    mounted() {
      this.initSoundSignals()
      this.initIB()
    }
  };
</script>
<style>
.message {
    white-space: pre-line;
}

.noError {
    color: gray;    
}

.error {
  color: red !important;
}
</style>