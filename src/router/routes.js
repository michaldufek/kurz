// LayoutViews
import DashboardLayout from "@/custom/layout/DashboardLayout.vue";
import ResearchLayout from "@/custom/layout/ResearchLayout.vue";

// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";
const About = () => import(/* webpackChunkName: "about" */"@/custom/apps/About.vue");
const Contact = () => import(/* webpackChunkName: "contact" */"@/custom/apps/Contact.vue");
const Login = () => import(/* webpackChunkName: "login" */"@/custom/apps/Login.vue");
const Settings = () => import(/* webpackChunkName: "settings" */"@/custom/apps/Settings.vue");
const Profile = () => import(/* webpackChunkName: "profile" */"@/pages/Profile.vue");

// SubViews
const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/custom/apps/dashboard/Dashboard.vue");
const Details = () => import(/* webpackChunkName: "details" */"@/custom/apps/dashboard/Details.vue");
const PortfolioManager = () => import(/* webpackChunkName: "portfolioManager" */"@/custom/apps/research/PortfolioManager.vue");
const StockPickingLab = () => import(/* webpackChunkName: "stockPickingLab" */"@/custom/apps/research/StockPickingLab.vue");
// const PatternLab = () => import(/* webpackChunkName: "patternLab" */"@/custom/apps/research/PatternLab.vue");
// const RelativeValuesLab = () => import(/* webpackChunkName: "relativeValuesLab" */"@/custom/apps/research/RelativeValuesLab.vue");
const WareHouse = () => import(/* webpackChunkName: "wareHouse" */"@/custom/apps/research/WareHouse.vue");

import auth from '@/custom/assets/js/auth'


function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

function verifyRegister (to, from, next) {
  auth.verifyRegister( (success) => {
    next({
      path: '/login?verifyRegister=' + success,
      query: { redirect: to.fullPath }
    })
  }) 
}

function verifyReset (to, from, next) {
  auth.verifyReset( (success) => {
    next({
      path: '/login?verifyReset=' + success,
      query: { redirect: to.fullPath }
    })
  }) 
}


const routes = [
  // landing pages
  { 
    path: '/about', 
    name: 'about',
    component: About 
  },
  { 
    path: '/contact', 
    name: 'contact',
    component: Contact 
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
    path: "/settings",
    name: "settings",
    component: Settings,
    beforeEnter: requireAuth
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    beforeEnter: requireAuth
  },
  // login & registration pages
  {
    path: "/login",
    component: Login
  },
  { 
    path: '/logout',
    beforeEnter (to, from, next) {
      auth.logout(() => {
        next('/')
      })
    }
  },
  // reset & registration verification pages
  {
    path: "/fe",
    redirect: "/",
    children: [
      {
        path: "/fe/verify-register",
        beforeEnter: verifyRegister
      },
      {
        path: "/fe/verify-reset",
        beforeEnter: verifyReset
      }
    ]
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