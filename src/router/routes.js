import DashboardLayout from "@/custom/layout/DashboardLayout.vue";
import ResearchLayout from "@/custom/layout/ResearchLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// SubViews
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/custom/pages/dashboard/Dashboard.vue");
const Details = () => import(/* webpackChunkName: "details" */"@/custom/pages/dashboard/Details.vue");
const PortfolioManager = () => import(/* webpackChunkName: "portfolio manager" */"@/custom/pages/research/PortfolioManager.vue");
const WareHouse = () => import(/* webpackChunkName: "ware house" */"@/custom/pages/research/WareHouse.vue");

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "/details",
        name: "details",
        component: Details
      }
    ],
  },
  {
    path: "/research",
    component: ResearchLayout,
    redirect: "/portfolioManager",
    children: [   
      {
        path: "/portfolioManager",
        name: "portfolioManager",
        component: PortfolioManager
      },   
      // {
      //   path: "stockPickingLab",
      //   name: "stockPickingLab",
      //   component: StockPickingLab
      // },
      // {
      //   path: "patternLab",
      //   name: "patternLab",
      //   component: PatternLab
      // },
      // {
      //   path: "relativeValues lab",
      //   name: "relativeValues lab",
      //   component: RelativeValuesLab
      // },
      {
        path: "/wareHouse",
        name: "wareHouse",
        component: WareHouse
      }   
    ]
  },  
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;