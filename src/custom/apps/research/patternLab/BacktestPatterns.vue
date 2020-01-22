<template>
  <div class="row">

    <div class="col-lg-2 col-md-12 container" style="max-width: 15%">
      <assets-patterns-picker :title="$t('research.patternLab.backtestPatterns.title')"
                              :btnText="$t('research.patternLab.backtestPatterns.addPattern')" 
                              @btnClicked="addPattern" />
    </div>

    <!-- strategy settings  -->
    <div class="col-lg-2 col-md-12">
      <!-- initial capital -->
      <p class="label" style="margin-left: 10px">{{ $t('research.patternLab.backtestPatterns.initialCapital') }}</p>
      <base-input alternative
                  type="text"
                  class="input"
                  style="margin-left: -5px; width: 56%"
                  v-model="strategy.initialCapital"
                  :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
      </base-input>

      <!-- entry rules -->
      <card>
        <h4 slot="header" class="card-title" style="float: left">{{ $t('research.patternLab.entry') + ' ' + $t('research.patternLab.rules') }}</h4>

        <!-- direction -->
        <p class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.direction') }}</p>
        <base-dropdown class="input" 
                       menu-classes="dropdown-black" 
                       title-classes="btn btn-secondary"
                       :title="strategy.direction">
          <ul style="list-style-type: none;">
            <li v-for="dir in $t('research.patternLab.backtestPatterns.entryRules.directions').filter(d => d !== strategy.direction)">            
              <a class="dropdown-item" 
                 @click="strategy.direction = dir" 
                 href="#">
                 {{ dir }}
              </a>
            </li>
          </ul>
        </base-dropdown>

        <!-- trend filter -->
        <p :title="$t('research.patternLab.backtestPatterns.entryRules.trendFilterTip')" class="label">{{ $t('research.patternLab.backtestPatterns.entryRules.trendFilter') }}</p>
        <!-- to-do: tip not visible because of position:relative of moving average -->
        <input type="checkbox" v-model="strategy.trendFilter" class="input" style="margin-top: 15px">
        <!-- moving average -->
        <div v-if="strategy.trendFilter" :title="$t('research.patternLab.backtestPatterns.entryRules.movingAverageTip')">
          <p style="width: 46%; position: relative; top: 10px">{{ $t('research.patternLab.backtestPatterns.entryRules.movingAverage') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 52%; margin-top: -25px"
                      v-model="strategy.movingAverage"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>

        <!-- risk (fix-amount) -->
        <div>
          <p style="width: 40%; position: relative; top: 25px">{{ $t('research.patternLab.backtestPatterns.entryRules.risk') }}</p>
          <base-input alternative
                      type="text"
                      style="float: right; width: 60%"
                      v-model="strategy.risk"
                      :placeholder="$t('research.patternLab.backtestPatterns.numberUSD')">
          </base-input>
        </div>
      </card>

      <!-- exit rules -->
      <card>
        <h4 slot="header" class="card-title" style="float: left">{{ $t('research.patternLab.exit') + ' ' + $t('research.patternLab.rules') }}</h4>

        <!-- analyze -->
        <div :title="$t('research.patternLab.backtestPatterns.exitRules.analyzeTip')">
          <p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.analyze') }}</p>
          <base-input alternative
                      type="text"
                      class="input"
                      v-model="strategy.analyze"
                      :placeholder="$t('research.patternLab.backtestPatterns.exitRules.numberBars')">
          </base-input>
        </div>

        <table>
          <!-- profit target -->
          <tr>
            <td><p class="label">{{ $t('research.patternLab.backtestPatterns.exitRules.profitTarget') }}</p></td>
            <td><base-input alternative
                        type="text"                        
                        v-model="strategy.profitTarget.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="strategy.profitTarget.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.units').filter(u => u !== strategy.profitTarget.unit)">
                  <a class="dropdown-item" 
                    @click="strategy.profitTarget.unit = unit" 
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
                        v-model="strategy.stopLoss.value"
                        :placeholder="$t('number')">
            </base-input></td>
            <td><base-dropdown menu-classes="dropdown-black" 
                          title-classes="btn btn-secondary"
                          :title="strategy.stopLoss.unit">
              <ul style="list-style-type: none;">
                <li v-for="unit in $t('research.patternLab.units').filter(u => u !== strategy.stopLoss.unit)">
                  <a class="dropdown-item" 
                    @click="strategy.stopLoss.unit = unit" 
                    href="#">
                    {{ unit }}
                  </a>
                </li>
              </ul>
            </base-dropdown></td>
          </tr>

        </table>

      </card>

      <!-- Run strategy button -->
      <base-button native-type="submit" type="secondary" @click="runStrategyClick" style="width: 100%">{{ $t('research.patternLab.backtestPatterns.runStrategy') }}</base-button>

    </div>

    <!-- performance results  -->
    <card class="col-lg-8 col-md-12" :key="cardKey">
      <h4 slot="header" class="card-title" style="float: left">{{ $t('research.patternLab.backtestPatterns.performanceResults.title') }}</h4>

      <top-navbar />

      <dashboard-content @click.native="toggleSidebar" style="margin-top: 15px" />
    </card>

  </div>
</template>
<script>
  import AssetsPatternsPicker from '@/custom/components/AssetsPatternsPicker'
  import constants from '@/custom/assets/js/constants'
  import helper from '@/custom/assets/js/helper';
  import i18n from "@/i18n"
  
  import TopNavbar from "@/custom/layout/application/patternLab/performanceResults/TopNavbar.vue";
  import DashboardContent from "@/custom/layout/application/patternLab/Content.vue";
  import MobileMenu from "@/layout/dashboard/MobileMenu";

  
  const defaultStrategy = {
    initialCapital: null,

    // entry rules
    direction: i18n.t('research.patternLab.backtestPatterns.entryRules.directions')[0],
    trendFilter: false,
    movingAverage: null,
    risk: null,
    
    // exit rules
    analyze: null,
    profitTarget: {
      value: null,
      unit: constants.defaultUnit
    },
    stopLoss: {
      value: null,
      unit: constants.defaultUnit
    }
  }

  export default {
    components: {
      AssetsPatternsPicker,
      TopNavbar,
      DashboardContent,
      MobileMenu
    },

    data() {
      return {
        // strategy settings
        strategy: defaultStrategy,
        
        cardKey: 0
      }
    },
    
    methods: {
      initStrategyData() {
        let data = this.$store.getItem(constants.storeKeys.backtestPatterns)
        this.strategy = data ? data.strategy : defaultStrategy
      },

      // methods from AssetsPatternsPicker emits
      addPattern() {
        this.storeAndReloadCard(constants.events.addPattern)
      },

      runStrategyClick() {
        let data = helper.getAssetsPatternsPickerData(this.$store)
        if (data) {   
          if (!data.checkedAssets.length) {
            this.$notify({
                            type: 'warning', 
                            message: this.$t('notifications.addNoAsset') + ' (' + this.$t('research.patternLab.backtestPatterns.title') + ').'
                        })
            return
          }

          if (!data.checkedPatterns.length) {
            this.$notify({
                type: 'warning', 
                message: this.$t('notifications.addNoPattern') + ' (' + this.$t('research.patternLab.backtestPatterns.title') + ').'
            })  
          } else {
            this.storeAndReloadCard(constants.events.runStrategy)            
          }
        }
      },

      storeAndReloadCard(event) {
        this.$store.setItem(constants.storeKeys.backtestPatterns, {
          strategy: this.strategy,
          event: event
        })

        this.cardKey++
      },

      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    },

    mounted() {
      this.initStrategyData()     
      this.cardKey++
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