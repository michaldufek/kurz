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