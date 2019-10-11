<template>
  <div class="row">
    <!-- <card class="card"> to-do: must be in one card -->
      <div class="col-lg-8 col-md-12">
        <card class="card">
          <h4 class="card-title">{{title}}</h4>
          <li v-for="strategyName in strategies.names" style="list-style-type: none;">
            {{strategyName}}
            <base-button  type="secondary" size="1" fill>live</base-button>
            <!-- v-if="strategies.enableLive" -->
            <base-button type="secondary" fill>store</base-button>        
            <!-- v-if="strategies.enableStore" -->
            <br/>
          </li>
        </card>
      </div>
      <div class="col-lg-4 col-md-12">
        <card class="card">
          <base-table :data="statsData"
                      :columns="$t('research.portfolioManager.statsTable.columns')"
                      thead-classes="text-primary">
          </base-table>
        </card>
      </div>
    <!-- </card> -->
  </div>
</template>
<script>
import Card from "@/components/Cards/Card.vue";
import { BaseTable, BaseButton } from "@/components";

export default {
  name: "portfolio-card",
  components: {
    Card,
    BaseButton,
    BaseTable
  },
  props: {
    title: {
      type: String,
      description: "Portfolio title"
    },
    stats: {
      type: Object,
      default: () => {},
      description: "Statistics data"
    },
    strategies: {
      type: Object,
      default: () => {
        return {
          enableLive: true,
          enableStore: true
        };
      },
      description: "Strategies data"
    },
    errored: false,
    loading: true            
  },
  data() {
    return {
      statsData: [{
          "performance statistics": this.$t("research.portfolioManager.statsTable.rows.cagr") + ": " + this.stats.cagr,
          "Risk statistics": this.$t("research.portfolioManager.statsTable.rows.beta") + ": " + this.stats.beta
        },
        {
          "performance statistics": this.$t("research.portfolioManager.statsTable.rows.sr") + ": " + this.stats.sr,
          "Risk statistics": this.$t("research.portfolioManager.statsTable.rows.alfa") + ": " + this.stats.alfa
        },
        {
          "performance statistics": this.$t("research.portfolioManager.statsTable.rows.equityOuts") + ": " + this.stats.equityOuts,
          "Risk statistics": this.stats.missProposal
        },
        {
          "performance statistics": this.$t("research.portfolioManager.statsTable.rows.maxDD") + ": " + this.stats.maxDD,
          "Risk statistics": this.stats.missProposal
        }
      ]
    };
  }
}
</script>
<style>
</style>