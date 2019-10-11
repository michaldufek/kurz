import DashboardLayout from "@/custom/layout/DashboardLayout.vue";
import ResearchLayout from "@/custom/layout/ResearchLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// SubViews
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/custom/apps/dashboard/Dashboard.vue");
const Details = () => import(/* webpackChunkName: "details" */"@/custom/apps/dashboard/Details.vue");
const PortfolioManager = () => import(/* webpackChunkName: "portfolio manager" */"@/custom/apps/research/PortfolioManager.vue");
const StockPickingLab = () => import(/* webpackChunkName: "stockPicking lab" */"@/custom/apps/research/StockPickingLab.vue");
const StockPickingLabFilters = () => import(/* webpackChunkName: "stockPicking lab filters" */"@/custom/apps/research/stockPickingLab/Filters.vue");
const StockPickingLabResults = () => import(/* webpackChunkName: "stockPicking lab results" */"@/custom/apps/research/stockPickingLab/Results.vue");
// const PatternLab = () => import(/* webpackChunkName: "pattern lab" */"@/custom/apps/research/PatternLab.vue");
// const RelativeValuesLab = () => import(/* webpackChunkName: "relativeValues lab" */"@/custom/apps/research/RelativeValuesLab.vue");
const WareHouse = () => import(/* webpackChunkName: "ware house" */"@/custom/apps/research/WareHouse.vue");

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
      {
        path: "/stockPickingLab",
        name: "stockPickingLab",
        component: StockPickingLab,
        children: [
          {
            path: "/stockPickingLab/filters",
            name: "stockPickingLabFilters",
            component: StockPickingLabFilters          
          },
          {
            path: "/stockPickingLab/results",
            name: "stockPickingLabResults",
            component: StockPickingLabResults          
          }
        ]
      },
      // {
      //   path: "/patternLab",
      //   name: "patternLab",
      //   component: PatternLab
      // },
      // {
      //   path: "/relativeValuesLab",
      //   name: "relativeValuesLab",
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