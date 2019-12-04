<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card -->
      <div class="col-lg-6 col-md-12">
        <card class="card">
          <table class="table tablesorter" :class="tableClass">
            <thead :class="theadClasses">
            <tr>
              <!-- <slot name="columns"> -->
                <h4 class="card-title">{{$t('research.wareHouse.premiumStrategies')}}</h4>
              <!-- </slot> -->
            </tr>
            </thead>
            <tbody :class="tbodyClasses">
            <tr v-for="strategyName in premiumStrategies">
              <!-- <slot :row="item"> -->
                <td style="border-top: 0px; margin-top: 10px;">
                  {{strategyName}}
                </td>
                <td style="border-top: 0px;">
                  <base-button type="secondary" fill style="float:right">
                    {{$t('research.wareHouse.remove')}}
                  </base-button>
                  <p style="float:right">&nbsp;&nbsp;&nbsp;</p>
                  <base-button type="secondary" fill style="float:right;">
                    {{$t('research.wareHouse.select')}}
                  </base-button>
                </td>
                <!-- to-do: export to Portfolio manager/Designed portfolio -->
                <!-- to-do: v-if="strategies.enableLive" -->                        
                <!-- v-if="strategies.enableStore" -->
              <!-- </slot> -->
            </tr>
            </tbody>
          </table>
        </card>
      </div>

      <div class="col-lg-6 col-md-12">
        <card class="card">
          <table class="table tablesorter" :class="tableClass">
            <thead :class="theadClasses">
            <tr>
              <!-- <slot name="columns"> -->
                <h4 class="card-title">{{$t('research.wareHouse.myStrategies')}}</h4>
              <!-- </slot> -->
            </tr>
            </thead>
            <tbody :class="tbodyClasses">
            <tr v-for="strategyName in myStrategies">
              <!-- <slot :row="item"> -->
                <td style="border-top: 0px; margin-top: 10px;">
                  {{strategyName}}
                </td>
                <td style="border-top: 0px;">
                  <base-button type="secondary" fill style="float:right">
                    {{$t('research.wareHouse.remove')}}
                  </base-button>
                  <p style="float:right">&nbsp;&nbsp;&nbsp;</p>
                  <base-button type="secondary" fill style="float:right;">
                    {{$t('research.wareHouse.select')}}
                  </base-button>
                </td>
                <!-- to-do: export to Portfolio manager/Designed portfolio -->
                <!-- to-do: v-if="strategies.enableLive" -->                        
                <!-- v-if="strategies.enableStore" -->
              <!-- </slot> -->
            </tr>
            </tbody>
          </table>
        </card>
      </div>
    <!-- </card> -->
  </div>
</template>
<script>
  import { BaseButton } from "@/components";

  var samplePortfolioNames = ["S1 with very very long title", "S2 with very very long title", "S3 with very very long title", "S4 with very very long title"];

  export default {
    components: {
      BaseButton        
    },
    data() {
      return {    
        premiumStrategies: samplePortfolioNames,  
        myStrategies: samplePortfolioNames
      }
    }
  };
</script>
<style>
.wh-btn {
  box-shadow: 0px 0px 10px black;
}

.btnOver {
  box-shadow: 0px 0px 10px white;
}
</style>