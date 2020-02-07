<template>
<div>

    <div class="row">
        <!-- select backtest -->
        <span style="float: left; margin: 8px 15px 30px 30px">{{ $t(storeKey + '.selectBacktest') }}</span>
        <base-dropdown class="dd" 
                        menu-classes="dropdown-black" 
                        title-classes="btn btn-secondary"
                        :title="selectedBacktest ? selectedBacktest.name : null"
                        style="width: 20%">
            <ul style="list-style-type: none;">
                <li v-for="bt in btNamesFiltered" :key="bt.id">            
                    <a class="dropdown-item" 
                        @click="selectBacktest(bt)" 
                        href="#">
                        {{ bt.name }}
                    </a>
                </li>
            </ul>
        </base-dropdown>    
    </div>

    <div class="row">
        <!-- parameters checkboxes       -->
        <card class="col-lg-2 col-md-12 container">
            <h4>{{ $t(storeKey + '.parameters') }}</h4>
            <base-checkbox v-model="profitTarget.checked">
                {{ $t(storeKey + '.profitTarget') }}
            </base-checkbox>
            <base-checkbox v-model="stopLoss.checked">
                {{ $t(storeKey + '.stopLoss') }}
            </base-checkbox>
        </card>

        <!-- date pickers -->
        <card class="col-lg-2 col-md-12 container">
            <h4>{{ $t(storeKey + '.period') }}</h4>
            <div class="controls">
                <table class="table tablesorter">
                    <tbody>
                        <tr>
                            <!-- <slot :row="item"> -->
                            <td style="border-top: 0px; text-align: right">
                                {{ $t('research.from') }}
                            </td>
                            <td style="border-top: 0px;">
                                <datepicker v-model="period.from" 
                                            :clear-button="true" 
                                            :format="dateFormat" 
                                            :placeholder="$t('research.pickDate')" />
                            </td>
                            <!-- </slot> -->
                        </tr>
                        <tr>
                            <!-- <slot :row="item"> -->
                            <td style="border-top: 0px; text-align: right">
                                {{ $t('research.to') }}
                            </td>
                            <td style="border-top: 0px;">
                                <datepicker v-model="period.to" 
                                            :clear-button="true" 
                                            :format="dateFormat" 
                                            :placeholder="$t('research.pickDate')" />
                            </td>
                            <!-- </slot> -->
                        </tr>
                    </tbody>
                </table>
            </div>
        </card>

        <!-- Profit Target range -->
        <card v-if="profitTarget.checked" class="col-lg-2 col-md-12 container">
            <h4>{{ $t(storeKey + '.profitTarget') + ' ' + $t(storeKey + '.range') }}</h4>

            <table>
                <tr>
                    <td style="width: 50%">
                        <p>{{ $t('research.from') }}</p>
                    </td>
                    <td>
                        <base-input alternative
                                    type="text"
                                    v-model="profitTarget.from"
                                    :placeholder="$t('number')">
                        </base-input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>{{ $t('research.to') }}</p>
                    </td>
                    <td>
                        <base-input alternative
                                    type="text"
                                    v-model="profitTarget.to"
                                    :placeholder="$t('number')">
                        </base-input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>{{ $t(storeKey + '.step') }}</p>
                    </td>
                    <td>
                        <base-input alternative
                                    type="text"
                                    v-model="profitTarget.step"
                                    :placeholder="$t('number')">
                        </base-input>
                    </td>
                </tr>
            </table>
        </card>

        <!-- Stop Loss range -->
        <card v-if="stopLoss.checked" class="col-lg-2 col-md-12 container">
            <h4>{{ $t(storeKey + '.stopLoss') + ' ' + $t(storeKey + '.range') }}</h4>

            <table>
                <tr>
                    <td style="width: 50%">
                        <p>{{ $t('research.from') }}</p>
                    </td>
                    <td>
                        <base-input alternative
                                    type="text"
                                    v-model="stopLoss.from"
                                    :placeholder="$t('number')">
                        </base-input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>{{ $t('research.to') }}</p>
                    </td>
                    <td>
                        <base-input alternative
                                    type="text"
                                    v-model="stopLoss.to"
                                    :placeholder="$t('number')">
                        </base-input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>{{ $t(storeKey + '.step') }}</p>
                    </td>
                    <td>
                        <base-input alternative
                                    type="text"
                                    v-model="stopLoss.step"
                                    :placeholder="$t('number')">
                        </base-input>
                    </td>
                </tr>
            </table>
        </card>

        <!-- estimated time of run -->
        <card class="col-lg-2 col-md-12 container">
            <h4 :class="[ warnEstimated ? 'warning' : 'noWarning' ]" style="margin-top: 60px">{{ $t(storeKey + '.estimatedTime') + ' ' + estimated + ' .' }}</h4>
        </card>

        <!-- run button -->
        <base-button native-type="submit" type="secondary" @click="runClick" style="height: 10%; margin-top: auto; margin-bottom: auto;">{{ $t(storeKey + '.run') }}</base-button>
    </div>

    <div class="row">
        <!-- results table -->
        <card class="col-lg-8 col-md-12 container">
            <fancy-table :title="$t(storeKey + '.results.title')"
                        :showTitle="true"
                        :columns="$t(storeKey + '.results.columns')">
            </fancy-table>
            <!-- save button -->
            <base-button native-type="submit" type="secondary" @click="saveClick">{{ $t(storeKey + '.save') }}</base-button>
        </card>

        <!-- results chart -->
        <card class="col-lg-3 col-md-12 container">
            <fancy-chart :title="$t(storeKey + '.results.chart')" />
        </card>
    </div>

</div>
</template>
<script>
import Datepicker from 'vuejs-datepicker';
import FancyTable from '@/custom/components/Tables/FancyTable';
import FancyChart from '@/custom/components/Charts/FancyChart';
import helper from '@/custom/assets/js/helper';

export default {
    components: {  
      Datepicker,
      FancyTable,
      FancyChart 
    },

    data() {
        return {
            storeKey: 'research.featuresEngineering.parameterSweep',

            backtestsNames: [],
            selectedBacktest: null,
            profitTarget: {
                checked: true,
                from: null,
                to: null,
                step: null
            },
            stopLoss: {
                checked: true,
                from: null,
                to: null,
                step: null
            },

            period: {
                from: null,
                to: null
            },

            estimated: '5.5 hours',
            warnEstimated: false,

            updateKey: 0
        }
    },

    computed: {
        btNamesFiltered() {
            return this.selectedBacktest ? this.backtestsNames.filter(bt => bt.id !== this.selectedBacktest.id) : this.backtestsNames
        },

        dateFormat() {
            return "yyyy-MM-dd"
        }
    },

    methods: {
        initData() {
            ({ backtestsNames:this.backtestsNames, selectedBacktest:this.selectedBacktest, updateKey:this.updateKey } = helper.getBacktestsNames(this.$store, this.storeKey, this.updateKey))

            let splitted = this.estimated.split(' ')
            this.warnEstimated = this.estimated && splitted[0] > 5 && splitted[1] === 'hours'
        },

        runClick() {
            if (this.warnEstimated) {
                this.$confirm(this.$t(this.storeKey + '.estimatedTime') + ' ' + this.$t(this.storeKey + '.confirmEstimated'))
                .then(() => {
                    this.run()
                })
                .catch(() => {})

                return
            }
            
            this.run()
        },
        saveClick() {},

        run() {
            console.log('run!')
        }
    },

    mounted() {
        this.initData()
    },

    watch: {
      selectedBacktest(val) {        
        helper.updateStore(this.$store, 'selectedBacktest', val, this.storeKey)
      }
    },
}
</script>
<style scoped>
.warning {
    color: red
}

.noWarning {
    color: white
}
</style>