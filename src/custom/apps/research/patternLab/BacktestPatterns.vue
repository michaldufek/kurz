<template>
  <div class="row">

    <div class="col-lg-2 col-md-12 container">
      <assets-patterns-picker :title="$t('research.patternLab.backtestPatterns.title')"
                              :btnText="$t('research.patternLab.backtestPatterns.addPattern')" 
                              @btnClicked="addPattern" 
                              @timeframeChanged="timeframeChanged" />
    </div>

    <!-- strategy settings  -->
    <div class="col-lg-2 col-md-12">
      <!-- initial capital -->
      <p class="label" style="margin-left: 10px">{{ $t('research.patternLab.backtestPatterns.initialCapital') }}</p>
      <base-input alternative
                  type="text"
                  class="input"
                  style="margin-left: -5px; width: 56%"
                  v-model="initialCapital"
                  :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
      </base-input>

      <!-- entry rules -->
      <card>
        <h4 slot="header" class="card-title" style="float: left">{{ $t('research.patternLab.backtestPatterns.entryRules.title') }}</h4>

        <!-- entry types -->
        <p class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.entryType') }}</p>
        <base-dropdown class="input" 
                       menu-classes="dropdown-black" 
                       title-classes="btn btn-secondary"
                       :title="entryType">
          <ul style="list-style-type: none;">
            <li v-for="eType in $t('research.patternLab.backtestPatterns.entryRules.entryTypes').filter(et => et !== entryType)">            
              <a class="dropdown-item" 
                 @click="entryType = eType" 
                 href="#">
                 {{ eType }}
              </a>
            </li>
          </ul>
        </base-dropdown>

        <!-- direction -->
        <p class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.direction') }}</p>
        <base-dropdown class="input" 
                       menu-classes="dropdown-black" 
                       title-classes="btn btn-secondary"
                       :title="direction">
          <ul style="list-style-type: none;">
            <li v-for="dir in $t('research.patternLab.backtestPatterns.entryRules.directions').filter(d => d !== direction)">            
              <a class="dropdown-item" 
                 @click="direction = dir" 
                 href="#">
                 {{ dir }}
              </a>
            </li>
          </ul>
        </base-dropdown>

        <!-- price (show only if Entry type not MARKET) -->
        <div v-if="entryType !== $t('research.patternLab.backtestPatterns.entryRules.entryTypes')[0]">
          <p class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.price') }}</p>
          <base-input alternative
                      type="text"
                      class="input"
                      v-model="price"n
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>

        <!-- trend filter -->
        <p :title="$t('research.patternLab.backtestPatterns.entryRules.trendFilterTip')" class="label">{{ $t('research.patternLab.backtestPatterns.trendFilter') }}</p>
        <!-- to-do: tip not visible because of position:relative of moving average -->
        <input type="checkbox" v-model="trendFilterEntryRules" class="input" style="margin-top: 5px">
        <!-- moving average -->
        <div v-if="trendFilterEntryRules" :title="$t('research.patternLab.backtestPatterns.entryRules.movingAverageTip')">
          <p style="width: 46%; position: relative; top: 10px">{{ $t('research.patternLab.backtestPatterns.movingAverage') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 52%; margin-top: -25px"
                      v-model="movingAverageEntryRules"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>

        <!-- expiration -->
        <div :title="$t('research.patternLab.backtestPatterns.entryRules.expirationTip')">
          <p style="width: 40%; position: relative; top: 30px">{{ $t('research.patternLab.backtestPatterns.entryRules.expiration') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 60%"
                      v-model="expiration"
                      :placeholder="$t('research.patternLab.backtestPatterns.entryRules.numberDays')">
          </base-input>
        </div>
      </card>

      <!-- exit rules -->
      <card>
        <h4 slot="header" class="card-title" style="float: left">{{ $t('research.patternLab.backtestPatterns.exitRules.title') }}</h4>

        <!-- analyze -->
        <div :title="$t('research.patternLab.backtestPatterns.exitRules.analyzeTip')">
          <p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.analyze') }}</p>
          <base-input alternative
                      type="text"
                      class="input"
                      v-model="analyze"
                      :placeholder="$t('research.patternLab.backtestPatterns.exitRules.numberBars')">
          </base-input>
        </div>

        <table>
          <!-- profit target -->
          <tr>
            <td><p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.profitTarget') }}</p></td>
            <td><base-input alternative
                        type="text"                        
                        v-model="profitTarget.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="profitTarget.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.backtestPatterns.exitRules.units').filter(u => u !== profitTarget.unit)">
                  <a class="dropdown-item" 
                    @click="profitTarget.unit = unit" 
                    href="#">
                    {{ unit }}
                  </a>
                </li>
              </ul>
            </base-dropdown></td>

          <!-- stop loss -->
          <tr>
            <td><p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.stopLoss') }}</p></td>
            <td><base-input alternative
                        type="text"
                        v-model="stopLoss.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="stopLoss.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.backtestPatterns.exitRules.units').filter(u => u !== stopLoss.unit)">
                  <a class="dropdown-item" 
                    @click="stopLoss.unit = unit" 
                    href="#">
                    {{ unit }}
                  </a>
                </li>
              </ul>
            </base-dropdown></td>
          </tr>

          <!-- break even -->
          <tr :title="$t('research.patternLab.backtestPatterns.exitRules.breakEvenTip')">            
            <td><p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.breakEven') }}</p></td>
            <td><base-input alternative
                        type="text"
                        v-model="breakEven.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="breakEven.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.backtestPatterns.exitRules.units').filter(u => u !== breakEven.unit)">
                  <a class="dropdown-item" 
                    @click="breakEven.unit = unit" 
                    href="#">
                    {{ unit }}
                  </a>
                </li>
              </ul>
            </base-dropdown></td>
          </tr>
        </table>

        <!-- moving average -->
        <div :title="$t('research.patternLab.backtestPatterns.movingAverageTip')">
          <p style="width: 46%; top: 10px; position: relative;">{{ $t('research.patternLab.backtestPatterns.movingAverage') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 52%; margin-top: -25px"
                      v-model="movingAverageExitRules"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>

        <!-- break even check -->
        <div>
          <p class="label" style="margin-top: 17px">{{ $t('research.patternLab.backtestPatterns.exitRules.breakEven') }}</p>
          <input type="checkbox" v-model="breakEven.check" class="input">
        </div>

        <!-- trend filter check -->
        <div :title="$t('research.patternLab.backtestPatterns.entryRules.trendFilterTip')">
          <input type="checkbox" style="width: 60%; position: relative; top: 25px" v-model="trendFilterExitRules">
          <p style="width: 60%">{{ $t('research.patternLab.backtestPatterns.trendFilter') + ' (' + $t('research.patternLab.backtestPatterns.movingAverage') + ')' }}</p>          
        </div>

      </card>

      <!-- Run strategy button -->
      <base-button native-type="submit" type="secondary" @click="runStrategyClick" style="width: 100%">{{ $t('research.patternLab.backtestPatterns.runStrategy') }}</base-button>

    </div>

    <!-- performance results  -->
    <div class="col-lg-8 col-md-12">
    </div>

  </div>
</template>
<script>
  import AssetsPatternsPicker from '@/custom/components/AssetsPatternsPicker'

  export default {
    components: {
      AssetsPatternsPicker
    },

    data() {
      return {
        // assets-patterns picker data
        timeframe: null,
        startDate: null,    
        endDate: null,

        // strategy settings
        initialCapital: null,
        // entry rules
        entryType: this.$t('research.patternLab.backtestPatterns.entryRules.entryTypes')[0],
        direction: this.$t('research.patternLab.backtestPatterns.entryRules.directions')[0],
        price: null,
        trendFilterEntryRules: false,
        trendFilterExitRules: false,
        movingAverageEntryRules: null,
        movingAverageExitRules: null,
        expiration: null,
        // exit rules
        analyze: null,
        profitTarget: {
          value: null,
          unit: this.$t('research.patternLab.backtestPatterns.exitRules.units')[0]
        },
        stopLoss: {
          value: null,
          unit: this.$t('research.patternLab.backtestPatterns.exitRules.units')[0]
        },
        breakEven: {
          value: null,
          unit: this.$t('research.patternLab.backtestPatterns.exitRules.units')[0],
          check: false
        }
      }
    },

    computed: {
    },

    methods: {
      addPattern() {

      },

      timeframeChanged() {

      },

      runStrategyClick() {
        
      }
    }
  }  
</script>
<style>
.label {
  float: left;
  width: 40%;
  padding-top: 5px;
}

.input {
  float: left;
  width: 60%;
}
</style>