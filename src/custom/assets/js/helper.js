import i18n from "@/i18n"

export default { 
    sortAggregator(oldRows, newRows, sortCl) {
        return oldRows.concat(newRows).sort((row1, row2) => {
          // sort in descending order by dateTime
          if (row1[sortCl] > row2[sortCl]) return -1;
          if (row1[sortCl] < row2[sortCl]) return 1;
          /* else */ return 0;
        })
    },

    averageAggregator(oldRows, newRows, lastRowNoAverage=true) {
        // average values at same place (to-do: except eq.outs. - only sum these)
        let rows = []

        if (!oldRows.length || !newRows.length) {
            rows = oldRows.concat(newRows)
        } else {
            let rowNr = 0

            oldRows.forEach(oldRow => {
                let aggRow = {}

                for (const [key, oldVal] of Object.entries(oldRow)) {
                    debugger
                    if (oldVal instanceof Number || typeof oldVal === 'number') {
                        var newVal = oldVal
                    } else {
                        // split because in portfolio card it is in '<statisticName>: <number>' format
                        var sep = ': '
                        var oldValSplitted = oldVal.split(sep)

                        newVal = oldValSplitted[oldValSplitted.length - 1]
                    }

                    if (!isNaN(Number(newVal))) {
                        // final average of old and new value
                        newVal = Number(newVal) 
                                 + ((oldValSplitted && oldValSplitted.length > 1) ? Number(newRows[rowNr][key].split(sep)[1]) : newRows[rowNr][key])
                        if (!(lastRowNoAverage && rowNr === oldRows.length - 1)) {
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
        }

        return rows
    },

    pad(nr) {
        return String(nr).length < 2 ? "0" + nr : nr
    },

    // date-time types formatting
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

    // global filters
    roundToFixed(value) {
        // rounds to 2 mantissa places
        return value ? value.toFixed(2) : value
    },
    
    chartUpdateTsText(ts) {
        // returns RRRR-M-D H:M:S like formatted text for chart
        if (ts) {
            let newDt = new Date(ts + "Z")
            return i18n.t('chartUpdatedPrefix') + ' ' + newDt.getFullYear() + "-" + Number(newDt.getMonth() + 1) + "-" + newDt.getDate() + " " + newDt.getHours() + ":" + newDt.getMinutes() + ":" + newDt.getSeconds()
        }
        return i18n.t('chartNeverUpdated')
    }
}