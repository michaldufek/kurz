import i18n from "@/i18n"
import constants from './constants';

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
                if (!oldVal) {
                    continue
                }

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

    formatDate(dt, delimiter="-") {
        // returns RRRR-MM-DD format
        if (dt) {
            let newDt = new Date(dt)
            return newDt.getFullYear() + delimiter + this.pad(Number(newDt.getMonth() + 1)) + delimiter + this.pad(newDt.getDate())
        }
    },

    formatDateTime(dt) {
        // returns RRRR-MM-DD HH:MM:SS formatted date from string of type YYYY-MM-DDTHH:MM:SS
        let newDt = new Date(dt)
        return this.formatDate(newDt) + " " + this.pad(newDt.getHours()) + ":" + this.pad(newDt.getMinutes()) + ":" + this.pad(newDt.getSeconds())
    },

    formatDateOnly(date) {
        // for RRRRMMDD formatted inputs
        // returns in RRRR-M-D format
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

    notifyAudio(self, element, type, msg) {
        element.play();

        self.$notify({
          type: type, 
          message: msg
        })
    },

    // convertors
    convertTimeframe(timeframe) {
        let index = i18n.t('research.patternLab.timeframes').indexOf(timeframe)
        return index > -1 ? index + 1 : -1
    },

    convertDirection(nr) {
        return !nr ? nr : (nr > 0 ? constants.strings.bullish : constants.strings.bearish)
    },

    // query & urls methods
    getBacktestPatternsQueryData(data) {
        let query = {}
        query['params'] = JSON.stringify(data)            
        return query
    },
    getPatternLabQueryData(assets, patterns, timeframe) {
        let data = {}

        data['symbols'] = assets.map(sa => sa.symbol)
        data['patterns'] = patterns.map(sp => sp.id)        
        data['timeframe'] = this.convertTimeframe(timeframe)
        
        return data
    },
    encodeQueryData(data) {
        const ret = [];
        for (let d in data) {
            if (data[d] !== null && data[d] !== undefined) {
                ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
            }
        }
        return ret.join('&');
    },
    getBacktestPatternsUrl(assetsPatterns, rules) {
        return assetsPatterns && rules && rules.event === constants.events.runStrategy 
                ? [ constants.urls.patternLab.backtestPatterns + this.encodeRouteParams(this.getBacktestPatternsRouteParams(assetsPatterns)) 
                + "?" + this.encodeQueryData(this.getBacktestPatternsQueryData(rules.strategy)) ] 
               : [] 
    },
    getPatternLabChartUrl(asset, timeframe) {
        return constants.urls.patternLab.chart + this.encodeRouteParams([ asset.id, this.convertTimeframe(timeframe) ])
    },
    getPatternLabHistoryUrl(assets, patterns, timeframe) {
        return assets.length && patterns.length
                ? [ constants.urls.patternLab.patternsHistory + "?" + this.encodeQueryData(this.getPatternLabQueryData(assets, patterns, timeframe)) ]
                : []
    },
    getBacktestPatternsRouteParams(assetsPatterns) {
        return [ this.convertTimeframe(assetsPatterns.timeframe),    // timeframe
                 this.formatDate(assetsPatterns.from ? assetsPatterns.from : Number.MIN_VALUE, ''),     // start_date
                 this.formatDate(assetsPatterns.to ? assetsPatterns.to : new Date(), ''),   // finish_date
                 assetsPatterns.checkedAssets.map(ca => ca.symbol).join(';'),  // assets
                 assetsPatterns.checkedPatterns.map(cp => cp.id).join(',')     // pattern_ids
                ]            
    },
    encodeRouteParams(data) {
        return data.join('/');
    },

    // store methods
    getAssetsPatternsPickerData(store) {
        let data = store.getItem(constants.storeKeys.assetsPatternsPicker)
        if (data) {
            return {
                timeframe: data.timeframe ? data.timeframe : i18n.t('research.patternLab.timeframes')[0],
                from: data.from ? new Date(data.from) : null,
                to: data.to ? new Date(data.to) : null,
                
                // assets
                selectedAssets: data.selectedAssets ? data.selectedAssets : [],
                checkedAssets: data.checkedAssets ? data.checkedAssets : (data.selectedAssets ? data.selectedAssets : []),
                checkedAsset: data.checkedAsset ? data.checkedAsset : (data.checkedAssets && data.checkedAssets.length ? data.checkedAssets[0] : null),

                // patterns
                selectedPatterns: data.selectedPatterns ? data.selectedPatterns : [],
                checkedPatterns: data.checkedPatterns ? data.checkedPatterns : [],
                checkedAllPatterns: data.checkedAllPatterns
            }
        }
    },
    updateStore(store, key, value, storeKey=constants.storeKeys.assetsPatternsPicker) {
        let storeData = store.getItem(storeKey)
        if (!storeData) {
            storeData = {}
        }
        storeData[key] = value
        store.setItem(storeKey, storeData)
    },

    // plurazlizer
    pluralize(nr, translationKey) {
        let nrsKey = translationKey + 's'

        if (nr === 0) {
            return i18n.t(nrsKey)
        }
        if (nr === 1) {
            return i18n.t(translationKey)
        }
        if (nr < 5) {
            return i18n.t(nrsKey + 'To4')
        } else {
            return i18n.t(nrsKey)
        }
    },

    // global filters
    roundToFixed(value) {
        if (!value || Number.isInteger(value)) {
            return value
        }

        // rounds to 2 mantissa places
        return value ? ((value instanceof Number || typeof value === 'number')
                        ? value.toFixed(2)
                        : [
                            isNaN(Number(value.split(' ')[0])) ? value.split(' ')[0] : Number(value.split(' ')[0]).toFixed(2),
                            value.split(' ')[1].replace(new RegExp('&nbsp;', "g"), ' ')
                          ].join(' '))
                    : value
    },
    
    chartUpdateTsText(ts, loading) {
        // returns RRRR-M-D H:M:S like formatted text for chart (if not loading)
        if (loading) {
            return null
        }

        if (ts) {            
            let newDt = new Date(ts)
            return i18n.t('chartUpdatedPrefix') + ' ' + newDt.getFullYear() + "-" + Number(newDt.getMonth() + 1) + "-" + newDt.getDate() + " " + newDt.getHours() + ":" + newDt.getMinutes() + ":" + newDt.getSeconds()
        }

        return i18n.t('chartNeverUpdated')
    }
}