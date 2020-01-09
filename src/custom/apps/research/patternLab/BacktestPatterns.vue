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
      <p class="label" style="margin-left: 10px">{{ $t('research.patternLab.backtestPatterns.initialCapital') }}</p>
      <base-input alternative
                  type="text"
                  class="input"
                  style="margin-left: -5px"
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
                      v-model="price"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>

        <!-- trend filter -->
        <p class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.trendFilter') }}</p>
        <input type="checkbox" v-model="trendFilter" class="input" style="margin-top: 5px">
        <!-- moving average -->
        <div v-if="trendFilter" :title="$t('research.patternLab.backtestPatterns.entryRules.movingAverageTip')">
          <p style="width: 46%; position: relative; top: 10px">{{ $t('research.patternLab.backtestPatterns.entryRules.movingAverage') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 52%; margin-top: -25px"
                      v-model="movingAverage"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>

        <!-- expiration -->
        <div :title="$t('research.patternLab.backtestPatterns.entryRules.expirationTip')">
          <p style="width: 40%; position: relative; top: 35px">{{ $t('research.patternLab.backtestPatterns.entryRules.expiration') }}</p>
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
      </card>
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
        entryType: this.$t('research.patternLab.backtestPatterns.entryRules.entryTypes')[0],
        direction: this.$t('research.patternLab.backtestPatterns.entryRules.directions')[0],
        price: null,
        trendFilter: false,
        movingAverage: null,
        expiration: null
      }
    },

    computed: {
    },

    methods: {
      addPattern() {

      },

      timeframeChanged() {

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