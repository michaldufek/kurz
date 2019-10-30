import i18n from "@/i18n"

export default { 
    // date-time types formatting
    formatDate(dt) {
        // returns RRRR-M-D format
        let newDt = new Date(dt)
        return newDt.getFullYear() + "-" + Number(newDt.getMonth() + 1) + "-" + newDt.getDate()
    },

    formatDateTime(dt) {
        // returns RRRR-M-D H:M:S formatted date from string of type YYYY-MM-DDTHH:MM:SS
        let newDt = new Date(dt)
        return this.formatDate(newDt) + " " + newDt.getHours() + ":" + newDt.getMinutes() + ":" + newDt.getSeconds()
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
        return value.toFixed(2)
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