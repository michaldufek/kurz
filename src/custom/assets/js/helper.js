export default {    
    formatDatetime(dt) {
        let newDt = new Date(dt)
        return this.formatDate(newDt) + " " + newDt.getHours() + ":" + newDt.getMinutes() + ":" + newDt.getSeconds()
    },

    formatDate(dt) {
        let newDt = new Date(dt)
        return newDt.getFullYear() + "-" + newDt.getMonth() + "-" + newDt.getDay()
    },

    formatDateOnly(date) {
        return date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8)
    },

    formatDatetimes(datetimes) {
        let newDatetimes = []
        datetimes.forEach(dt => {
          newDatetimes.push(this.formatDatetime(dt))
        })
        return newDatetimes
      }
}