export default { 
    // date-time types formatting

    formatDatetime(dt) {
        // returns RRRR-M-D H:M:S formatted date from general string defined one
        let newDt = new Date(dt)
        return this.formatDate(newDt) + " " + newDt.getHours() + ":" + newDt.getMinutes() + ":" + newDt.getSeconds()
    },

    formatDate(dt) {
        // returns in RRRR-M-D format
        let newDt = new Date(dt)
        return newDt.getFullYear() + "-" + newDt.getMonth() + "-" + newDt.getDay()
    },

    formatDateOnly(date) {
        // for RRRRMMDD formatted inputs
        // retuns in RRRR-M-D format
        return date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8)
    },

    formatDatetimes(datetimes) {
        // formatDatetime on array
        let newDatetimes = []
        datetimes.forEach(dt => {
          newDatetimes.push(this.formatDatetime(dt))
        })
        return newDatetimes
    },

    // global filters
    roundToFixed(value) {
        // rounds to 2 mantissa places
        return value.toFixed(2)
    }
}