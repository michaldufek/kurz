<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/portfolioManager" :name="$t('sidebar.portfolioManager')" icon="tim-icons icon-chart-pie-36"/>
        <sidebar-link to="/wareHouse" :name="$t('sidebar.wareHouse')" icon="tim-icons icon-tap-02"/>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "@/layout/dashboard/TopNavbar.vue";
import ContentFooter from "@/layout/dashboard/ContentFooter.vue";
import DashboardContent from "@/layout/dashboard/Content.vue";
import MobileMenu from "@/layout/dashboard/MobileMenu";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
