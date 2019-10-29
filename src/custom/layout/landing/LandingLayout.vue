<template>
  <div class="wrapper">
    <!-- <side-bar>
      <template slot="links">
        <sidebar-link to="/login" :name="$t('landing.home')" icon="tim-icons icon-coins"/>
        <sidebar-link to="/about" :name="$t('landing.about')" icon="tim-icons icon-chart-bar-32"/>
      </template>
    </side-bar> -->
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
import TopNavbar from "@/custom/layout/landing/TopNavbar.vue";
import ContentFooter from "@/custom/layout/landing/ContentFooter.vue";
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
