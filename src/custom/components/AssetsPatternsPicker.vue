<template>
    <div>
        <audio id="connectionLost" src="media/connectionLost.mp3" preload="auto"></audio>

        <div v-if="showDatePickers">
            <!-- timeframe dropdown -->
            <div :style="'position: relative; left: ' + tfLeftPos + 'px; z-index: 1' + (tfLeftPos === defaultTfLeftPos ? '' : '; top: 10px')">
                <base-dropdown class="dd" 
                               menu-classes="dropdown-black" 
                               title-classes="btn btn-secondary"
                               :title="timeframe">
                    <ul style="list-style-type: none;">
                        <li v-for="tframe in $t('research.patternLab.timeframes').filter(el => el !== timeframe)">            
                            <a class="dropdown-item" 
                               @click="selectTimeframe(tframe)" 
                               href="#">
                               {{ tframe }}
                            </a>
                        </li>
                    </ul>
                </base-dropdown>
            </div>

            <!-- date pickers -->
            <div class="col-xs-3" :style="'position: relative' + (tfLeftPos === defaultTfLeftPos ? '' : '; top: -25px')">
                <div class="controls">
                    <table class="table tablesorter">
                        <tbody>
                            <tr>
                                <!-- <slot :row="item"> -->
                                <td style="border-top: 0px; text-align: right">
                                    {{ $t('research.patternLab.from') }}
                                </td>
                                <td style="border-top: 0px;">
                                    <datepicker v-model="from" 
                                                :disabled-dates="disabledDatesFrom" 
                                                :clear-button="true" 
                                                :format="dateFormat" 
                                                :placeholder="$t('research.patternLab.pickDate')" />
                                </td>
                                <!-- </slot> -->
                            </tr>
                            <tr>
                                <!-- <slot :row="item"> -->
                                <td style="border-top: 0px; text-align: right">
                                    {{ $t('research.patternLab.to') }}
                                </td>
                                <td style="border-top: 0px;">
                                    <datepicker v-model="to" 
                                                :disabled-dates="disabledDatesTo" 
                                                :clear-button="true" 
                                                :format="dateFormat" 
                                                :placeholder="$t('research.patternLab.pickDate')" />
                                </td>
                                <!-- </slot> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- assets -->
        <card style="text-align: center;">
            <label>{{ $t('research.patternLab.assets') }}</label>
            <Dropdown :options="assets"
                      :disabled="false"
                      name="ddAssets"
                      :maxItem="maxItems"
                      :placeholder="$t('research.patternLab.type2search')"
                      @filter="getAssets"
                      @selected="ddSelectAsset">
            </Dropdown>
            <base-table :data="selectedAssets" :columns="[ 'symbol', 'name' ]">
                <template slot="columns">
                    <th></th>
                    <th></th>
                </template>  
                <template slot-scope="{row}">
                    <div>
                        <td style="border: none">
                            <input v-if="oneAssetLimit" type="radio" :id="row.id" :value="row" v-model="checkedAsset">
                            <!-- <label for="one">One</label> -->
                            <!-- <input v-if="oneAssetLimit" type="checkbox" :id="row.id" :value="row" v-model="checkedAsset"> -->
                            <input v-else type="checkbox" :id="row.id" :value="row" v-model="checkedAssets">
                        </td>
                        <td style="font-size: 0.65rem; border: none">{{row.symbol}}</td>
                        <td style="font-size: 0.65rem; border: none; border-left: 1px; text-align: left">{{row.name}}</td>
                    </div>
                    <td class="td-actions text-right" style="border: none">                        
                        <base-button size="sm" icon @click="removeAsset(row)" style="height: 1rem;width: 1rem;min-width: 1rem;font-size: 0.5rem;">
                            <i class="tim-icons icon-simple-remove"></i>
                        </base-button>
                    </td>
                </template>    
            </base-table>
        </card>

        <!-- patterns -->
        <card style="text-align: center;">
            <label>{{ $t('research.patternLab.patterns') }}</label>
            <Dropdown :options="patterns"
                      :disabled="false"
                      name="ddPatterns"
                      :maxItem="maxItems"
                      :placeholder="$t('research.patternLab.type2search')"
                      @filter="getPatterns"
                      @selected="ddSelectPattern">
            </Dropdown>
            <ul style="list-style-type: none; text-align: left; margin-top: 15px; padding-left: 0px">
                <li v-if="selectedPatterns.length" :title="checkedAllPatterns ? $t('research.patternLab.uncheckAll') : $t('research.patternLab.checkAll')">   
                    <input type="checkbox" @click="checkAllPatterns" v-model="checkedAllPatterns">
                </li>
                <li v-for="selectedPattern in selectedPatterns">   
                    <input type="checkbox" :id="selectedPattern.id" :value="selectedPattern" v-model="checkedPatterns">
                    <label :for="selectedPattern.id" style="margin-left: 10px">{{ selectedPattern.name }}</label>
                </li>
            </ul> 
        </card>

        <!-- Add chart button -->
        <base-button native-type="submit" type="secondary" @click="btnClick" style="width: 100%">{{ btnText }}</base-button>

    </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker';
import Dropdown from 'vue-simple-search-dropdown';
import { BaseTable } from '@/components'

import constants from '@/custom/assets/js/constants';
import helper from '@/custom/assets/js/helper';


export default {
    name: 'assets-patterns-picker',
    components: {  
      Datepicker,   
      Dropdown,
      BaseTable   
    },
    props: {
        title: {
            type: String,
            description: "Title used in errors"
        },
        oneAssetLimit: {
            type: Boolean,
            description: "Whether only one asset can be checked"
        },
        showDatePickers: {
            type: Boolean,
            default: true,
            description: "Whether datepickers (and timeFrame dropdown) section should be showed"
        },
        tfLeftPos: {
            type: Number,
            default: 30,
            description: "Position of timeFrame dropdown from left in pixels"
        },
        btnText: {
            type: String,
            description: "Text of main submit button"
        }
    },

    data() {
        return {
            defaultTfLeftPos: 30,
            timeframe: this.$t('research.patternLab.timeframes')[0],

            // datepickers
            from: null,
            to: null,

            // assets
            disabledDatesAsset: null,            
            selectedAssets: [],
            checkedAssets: [],
            checkedAsset: null, // only used when oneAssetLimit is true
            assets: [],

            // patterns
            selectedPatterns: [],
            checkedPatterns: [],
            checkedAllPatterns: false,
            patterns: []
        }
    },

    computed: {
        dateFormat() {
            return "yyyy-MM-dd"
        },
        disabledDatesFrom() {
            return {
                from: this.disabledDatesAsset 
                      ? (this.to ? new Date(Math.min(this.to, this.disabledDatesAsset.from)) 
                      : this.disabledDatesAsset.from) : this.to,
                to: this.disabledDatesAsset ? this.disabledDatesAsset.to : null
            }
        },
        disabledDatesTo() {
            return {
                from: this.disabledDatesAsset ? this.disabledDatesAsset.from : null,
                to: this.disabledDatesAsset 
                    ? (this.from ? new Date(Math.max(this.from, this.disabledDatesAsset.to)) 
                    : this.disabledDatesAsset.to) : this.from
            }
        },
        maxItems() {
            return constants.maxRows
        },
    },

    methods: {
        initData() {
            let data = helper.getAssetsPatternsPickerData(this.$store)
            if (data) {
                ({ timeframe:this.timeframe, from:this.from, to:this.to, selectedAssets:this.selectedAssets, checkedAssets:this.checkedAssets, 
                   checkedAsset:this.checkedAsset, selectedPatterns:this.selectedPatterns, checkedPatterns:this.checkedPatterns, 
                   checkedAllPatterns:this.checkedAllPatterns } 
                = data)
            }
        },

        selectTimeframe(timeframe) {
            this.timeframe = timeframe
            helper.updateStore(this.$store, 'timeframe', this.timeframe)            
            this.$emit('timeframeChanged')
        },

        // selecting asset/patterns
        ddSelectAsset(asset) {
            if (!('id' in asset)) {
                return
            }

            this.ddSelect(asset, asset => asset.id, this.selectedAssets)

            if (this.oneAssetLimit) {
                this.checkedAsset = asset
            } else {
                this.ddSelect(asset, asset => asset.id, this.checkedAssets)
            }
        },
        ddSelectPattern(pattern) {
            if (!('id' in pattern)) {
                return
            }

            this.ddSelect(pattern, pattern => pattern.id, this.selectedPatterns)
            this.ddSelect(pattern, pattern => pattern.id, this.checkedPatterns)

            if (this.checkedAllPatterns) {  // works only in debug - why?
                this.checkedAllPatterns = false
            } else if (this.checkedPatterns.length === this.selectedPatterns.length) {
                this.checkedAllPatterns = true
            }
        },
        ddSelect(item, itemKeySelector, selectedItems) {
            if (!selectedItems.map(itemKeySelector).includes(itemKeySelector(item))) {
                selectedItems.push(item)
            }
        },

        removeAsset(asset) {
            this.selectedAssets.splice(this.selectedAssets.map(sa => sa.symbol).indexOf(asset.symbol), 1);

            // remove also checked asset
            if (this.oneAssetLimit) {
                if (this.checkedAsset && this.checkedAsset.id === asset.id) {
                    if (this.selectedAssets.length) {
                        this.checkedAsset = this.selectedAssets[0]
                    } else {
                        this.checkedAsset = null                    
                    }
                }
            } else if (this.checkedAssets.map(a => a.symbol).includes(asset.symbol)) {                
                this.checkedAssets.splice(this.checkedAssets.map(a => a.symbol).indexOf(asset.symbol), 1)                
            }

            // if only checked asset was removed
            if (!this.checkedAssets.length && this.selectedAssets.length) {
                this.checkedAssets.push(this.selectedAssets[0])                
            }
        },
        updateDisabledDatesAsset() {
            this.disabledDatesAsset = null
            let fromChanged = false
            let toChanged = false
            let checkedAssets = this.oneAssetLimit ? (this.checkedAsset ? [ this.checkedAsset ] : []) : this.checkedAssets

            checkedAssets.forEach(asset => {
                this.$http
                .get(constants.urls.patternLab.chart + asset.id + '/' + helper.convertTimeframe(this.timeframe)) // to-do: cache this result !
                .then(response => {
                    let newFrom = new Date(Math.max(...Object.keys(response.data.Close)))    // maximum asset date !                    
                    let newTo = new Date(Math.min(...Object.keys(response.data.Close)))       // minimum asset date !

                    this.disabledDatesAsset = {
                        from: new Date(this.disabledDatesAsset ? Math.min(this.disabledDatesAsset.from, newFrom) : newFrom),
                        to: new Date(this.disabledDatesAsset ? Math.max(this.disabledDatesAsset.to, newTo) : newTo)
                    }
                })
                .catch(error => {
                    console.log(error);
                    
                    if (error.message === constants.strings.networkError) {
                        helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', this.$t('notifications.beConnectionLost') + '(' + this.$t('sidebar.patternLab') + ')')
                    }
                })
                .finally(() => {
                    if (this.from && (this.from < this.disabledDatesAsset.to || this.from > this.disabledDatesAsset.from)) {
                        this.from = this.disabledDatesAsset.to

                        if (!fromChanged) {
                            this.$notify({
                                type: 'warning', 
                                message: this.$t('notifications.fromChanged') + ' (' + this.$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.chart.title') + ').'
                            })
                            fromChanged = true
                        }
                    }
                    if (this.to && (this.to > this.disabledDatesAsset.from || this.to < this.disabledDatesAsset.to)) {
                        this.to = this.disabledDatesAsset.from

                        if (!toChanged) {
                            this.$notify({
                                type: 'warning', 
                                message: this.$t('notifications.toChanged') + ' (' + this.$t('sidebar.patternLab') + ' ' + this.$t('research.patternLab.chart.title') + ').'
                            })
                            toChanged = true
                        }
                    }
                })
            })
        },
        getAssets(query) {
            // to-do: eliminate component's bug - redudant call for selected item
            if (query) {
                this.$http
                .get(constants.urls.patternLab.asset + query)
                .then(response => {
                    this.assets = response.data.results
                                .filter(result => !this.selectedAssets.map(sa => sa.symbol).includes(result.symbol))
                                .map(result => {                                     
                                    return {
                                        id: result.id, 
                                        symbol: result.symbol,
                                        name: result.name ? result.name : result.symbol
                                    }
                                })
                })
                .catch(error => {
                    console.log(error);
                    
                    if (error.message === constants.strings.networkError) {
                        helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', this.$t('notifications.beConnectionLost') + '(' + this.$t('sidebar.patternLab') + ')')
                    }
                })
                .finally(() => {})
            }
        },

        checkAllPatterns() {
            if (this.checkedAllPatterns) {
                this.checkedPatterns = []
            } else {          
                this.checkedPatterns = this.selectedPatterns          
            }
        },
        getPatterns(query) {
            // to-do: eliminate component's bug - redudant call for selected item        
            if (query) {
                this.$http
                .get(constants.urls.patternLab.pattern + query)
                .then(response => {
                    this.patterns = response.data.filter(result => !this.selectedPatterns.map(sp => sp.name).includes(result.name))
                })
                .catch(error => {
                    console.log(error);
                    
                    if (error.message === constants.strings.networkError) {
                        helper.notifyAudio(this, document.getElementById('connectionLost'), 'danger', this.$t('notifications.beConnectionLost') + '(' + this.$t('sidebar.patternLab') + ')')
                    }
                })
                .finally(() => {})
            }
        },

        btnClick() {
            if ((!this.oneAssetLimit && !this.checkedAssets.length) || (this.oneAssetLimit && !this.checkedAsset)) {
                this.$notify({
                    type: 'warning', 
                    message: this.$t('notifications.addNoAsset') + ' (' + this.$t('sidebar.patternLab') + ' ' + this.title + ').'
                })    

                return
            }
            
            if (!this.checkedPatterns.length) {
                this.$notify({
                    type: 'warning', 
                    message: this.$t('notifications.addNoPattern') + ' (' + this.$t('sidebar.patternLab') + ' ' + this.title + ').'
                })  
            }

            this.$emit('btnClicked')
        }
    },

    mounted() {
      this.initData()
    },

    watch: {
        from(value) {
            helper.updateStore(this.$store, 'from', value)            
        },
        to(value) {
            helper.updateStore(this.$store, 'to', value)            
        },

        // assets
        selectedAssets(value) {
            helper.updateStore(this.$store, 'selectedAssets', value)            
        },
        checkedAssets(value) {
            helper.updateStore(this.$store, 'checkedAssets', value) 
            this.updateDisabledDatesAsset()
        },
        checkedAsset(value) {
            helper.updateStore(this.$store, 'checkedAsset', value) 
            this.updateDisabledDatesAsset()
        },

        // patterns
        selectedPatterns(value) {
            helper.updateStore(this.$store, 'selectedPatterns', value)            
        },
        checkedPatterns(value) {
            helper.updateStore(this.$store, 'checkedPatterns', value)            
        },
        checkedAllPatterns(value) {
            helper.updateStore(this.$store, 'checkedAllPatterns', value)            
        }
    }
}
</script>
<style>
  .form-control {
    box-shadow: gray 0px 0px 7px;
  }

  .dropdown input,
  .vdp-datepicker span,
  .vdp-datepicker input {
    box-shadow: gray 0px 0px 7px;
    width: 94%;
    text-align: center;
    background-color: transparent;
    border-radius: 0.4285rem !important;
    color: gray; 
    border: none;
  }

  .vdp-datepicker span {
    box-shadow: none;    
    color: inherit; 
  }

  .dropdown input {
    background: transparent !important;
    color: gray !important;
    border: none !important;
    min-width: 100% !important;
  }

  /* .dropdown:focus { // to-do: this focus should be on all inputs (ie.dtpicker, dropdowns)
    border-color: #1d8cf8 !important
  } */

  .dropdown .dropdown-content,
  .vdp-datepicker__calendar {
    background-color: darkslategrey !important;
    border-radius: 0.4285rem;
    opacity: 0.8;
    min-width: 100% !important;
    border: none !important;
    box-shadow: gray 0px 0px 7px !important;
  }

  .disabled {
    color: gray !important
  }

  .day__month_btn up {
    color: white !important
  }

  .vdp-datepicker__calendar header .prev:not(.disabled):hover, .vdp-datepicker__calendar header .next:not(.disabled):hover, .vdp-datepicker__calendar header .up:not(.disabled):hover {
    background: darkgray !important
  }

  .selectedAsset {
    background-color: #1d8cf8;
    border-radius: 0.4285rem
  }
</style>