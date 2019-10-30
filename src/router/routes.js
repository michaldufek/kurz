// LayoutViews
import LandingLayout from "@/custom/layout/landing/LandingLayout.vue";
import DashboardLayout from "@/custom/layout/application/DashboardLayout.vue";
import ResearchLayout from "@/custom/layout/application/ResearchLayout.vue";
import SettingsLayout from "@/custom/layout/application/SettingsLayout.vue";

// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";
const About = () => import(/* webpackChunkName: "about" */"@/custom/apps/About.vue");
const Login = () => import(/* webpackChunkName: "login" */"@/custom/apps/Login.vue");

// SubViews
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/custom/apps/dashboard/Dashboard.vue");
const Details = () => import(/* webpackChunkName: "details" */"@/custom/apps/dashboard/Details.vue");
const PortfolioManager = () => import(/* webpackChunkName: "portfolioManager" */"@/custom/apps/research/PortfolioManager.vue");
const StockPickingLab = () => import(/* webpackChunkName: "stockPickingLab" */"@/custom/apps/research/StockPickingLab.vue");
// const PatternLab = () => import(/* webpackChunkName: "patternLab" */"@/custom/apps/research/PatternLab.vue");
// const RelativeValuesLab = () => import(/* webpackChunkName: "relativeValuesLab" */"@/custom/apps/research/RelativeValuesLab.vue");
const WareHouse = () => import(/* webpackChunkName: "wareHouse" */"@/custom/apps/research/WareHouse.vue");
const Settings = () => import(/* webpackChunkName: "settings" */"@/custom/apps/Settings.vue");
const Profile = () => import(/* webpackChunkName: "profile" */"@/pages/Profile.vue");

import auth from '@/custom/assets/js/auth'


function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/landing',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

const routes = [
  // landing pages
  {
    path: "/landing",
    component: LandingLayout,
    redirect: "/login",
    children: [
      {
        path: "/login",
        component: Login
      },
      { 
        path: '/about', 
        name: 'about',
        component: About 
      },
      { 
        path: '/logout',
        name: "logout",
        component: Login
      },
      // password reset & registration verification pages
      {
        path: "/fe/verify-register/:key",
        component: Login
      },
      {
        path: "/fe/verify-reset/:uid/:token",
        component: Login
      }      
    ]
  },
  // logged in pages
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
    beforeEnter: requireAuth
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
        component: StockPickingLab
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
    ],
    beforeEnter: requireAuth
  },
  // user settings & profile pages
  {
    path: "/profile",
    component: SettingsLayout,
    redirect: "/profile",
    children: [
      {
        path: "/profile",
        name: "profile",
        component: Profile        
      },   
      {
        path: "/settings",
        name: "settings",
        component: Settings
      }      
    ],
    beforeEnter: requireAuth
  },    
  // all other pages
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