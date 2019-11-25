import i18n from "@/i18n"

export default { 
    // statistics
    cagr(equity, nrOfQuarters) {
        // cagr = (df['equity'].iloc[-1] / df['equity'].iloc[0]) ** (1 / (time_span.days/365)) - 1
        return Math.pow(equity[equity.length - 1] / equity[0], 1 / (nrOfQuarters / 4)) - 1
    },

    ytd(data, nrOfQuarters) {
        // ytd = (this_year['equity'].iloc[-1] / this_year['equity'].iloc[0]) * 100 - 100
        let last_equity = this.last_quarters_equity(data, nrOfQuarters)
        return (last_equity[last_equity.length - 1] / last_equity[0]) * 100 - 100
    },

    maxDD(data, nrOfQuarters) {
        // maxdd = ((df['equity'] - df['equity'].cummax()) / df['equity']).min() * 100
        let last_equity = this.last_quarters_equity(data, nrOfQuarters)
        return Math.min(...last_equity.map((val,ind) => (val - Math.max(...last_equity.slice(0, ind + 1))) / val)) * 100
    },

    last_quarters_equity(data, nr) {
        // this_year = df[df['time'] > dt.datetime(now.year, 1, 1)]
        let timeFiltered = data.time.filter(dt => new Date(dt) >= new Date(new Date(Date.now()).getFullYear(), 12 - (nr * 3) - 1, 1))
        return data.equity.slice(data.equity.length - timeFiltered.length, data.equity.length)
    },

    // agregators
    sortAggregator(oldRows, newRows, sortCl) {
        return oldRows.concat(newRows).sort((row1, row2) => {
          // sort in descending order by dateTime
          if (row1[sortCl] > row2[sortCl]) return -1;
          if (row1[sortCl] < row2[sortCl]) return 1;
          /* else */ return 0;
        })
    },

    weightedAverageAggregator(oldRows, newRows, weight, lastRowNoAverage=true) {
        // average values at same place
        let rows = []
        let firstTime = !oldRows.length || !newRows.length

        let allRows = firstTime ? oldRows.concat(newRows) : oldRows
        let rowNr = 0

        allRows.forEach(oldRow => {
            let aggRow = {}
            
            for (const [key, oldVal] of Object.entries(oldRow)) {
                if (oldVal instanceof Number || typeof oldVal === 'number') {
                    var newVal = oldVal
                } else {
                    // split because in portfolio card it is in '<statisticName>: <number>' format
                    var sep = ': '
                    var oldValSplitted = oldVal.split(sep)

                    newVal = oldValSplitted[oldValSplitted.length - 1]
                }

                if (!isNaN(Number(newVal))) {
                    // final weighted average of old and new value
                    let noAverage = !(lastRowNoAverage && rowNr === allRows.length - 1)
                    let newWeight = noAverage ? weight : 1

                    newVal = ((firstTime ? newWeight : 1) * Number(newVal))
                                + (firstTime
                                    ? 0
                                    : (newWeight * ((oldValSplitted && oldValSplitted.length > 1) 
                                                    ? Number(newRows[rowNr][key].split(sep)[1]) 
                                                    : newRows[rowNr][key]))
                                    )
                    if (noAverage && !firstTime) {  
                        // it's probably Equity outstanding statistic                          
                        newVal /= 2
                    }
                }
                
                if (oldValSplitted && oldValSplitted.length > 1) {
                    newVal = [ oldValSplitted[0], newVal ].join(sep)
                } 
                aggRow[key] = newVal
            }

            rows.push(aggRow)
            rowNr++
        })

        return rows
    },

    // date-time types formatting    
    pad(nr) {
        return String(nr).length < 2 ? "0" + nr : nr
    },

    formatDate(dt) {
        // returns RRRR-MM-DD format
        let newDt = new Date(dt)
        return newDt.getFullYear() + "-" + this.pad(Number(newDt.getMonth() + 1)) + "-" + this.pad(newDt.getDate())
    },

    formatDateTime(dt) {
        // returns RRRR-MM-DD HH:MM:SS formatted date from string of type YYYY-MM-DDTHH:MM:SS
        let newDt = new Date(dt)
        return this.formatDate(newDt) + " " + this.pad(newDt.getHours()) + ":" + this.pad(newDt.getMinutes()) + ":" + this.pad(newDt.getSeconds())
    },

    formatDateOnly(date) {
        // for RRRRMMDD formatted inputs
        // retuns in RRRR-M-D format
        return date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8)
    },

    formatDateTimes(datetimes) {
        // formatDatetime on array
        let newDatetimes = []
        datetimes.forEach(dt => {
          newDatetimes.push(this.formatDateTime(dt))
        })
        return newDatetimes
    },

    isNumber(val) {
        return val instanceof Number || typeof val === 'number'
    },

    // global filters
    roundToFixed(value) {
        // rounds to 2 mantissa places
        return value ? ((value instanceof Number || typeof value === 'number')
                        ? value.toFixed(2)
                        : [ Number(value.split(' ')[0]).toFixed(2), value.split(' ')[1] ].join(' '))
                    : value
    },
    
    chartUpdateTsText(ts) {
        // returns RRRR-M-D H:M:S like formatted text for chart
        if (ts) {
            let newDt = new Date(ts)
            return i18n.t('chartUpdatedPrefix') + ' ' + newDt.getFullYear() + "-" + Number(newDt.getMonth() + 1) + "-" + newDt.getDate() + " " + newDt.getHours() + ":" + newDt.getMinutes() + ":" + newDt.getSeconds()
        }
        return i18n.t('chartNeverUpdated')
    }
}