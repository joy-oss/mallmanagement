import { createRouter, createWebHistory } from "vue-router";
const routerHistory = createWebHistory();
const jsonArrayRoute = [
  {
    path:'/',
    component:()=>import('@/views/Login.vue'),
  },
  {
    path:'/shopList',
    component:()=>import('@/views/Shoplist.vue'),
    meta:{
      loginFlag:'alreadyLgn'
    },
    children:[
      {
        path: "admst",
        component: () => import("@/views/shopListCon/Admst.vue"),
        meta: {
          keepAlive: true,
        },
        children:[
          {
            path: "admMgmt",
            component: () => import("@/views/admstList/AdmMgmt.vue"),
            meta: {
              keepAlive: false,
            },
          },
          {
            path: "roleMgmt",
            component: () => import("@/views/admstList/RoleMgmt.vue"),
            meta: {
              keepAlive: false,
            },
          }
        ]
 
      },
      {
        path: "cmgmgt",
        component: () => import("@/views/shopListCon/Cmgmgt.vue"),
        meta: {
          keepAlive: false,
        },
        children:[
          {
            path: "shopsList",
            component: () => import("@/views/shopItemList/ShopsList.vue"),
            meta: {
              keepAlive: false,
            },
          },
          {
            path: "typeList",
            component: () => import("@/views/shopItemList/TypeList.vue"),
            meta: {
              keepAlive: false,
            },
          },
          {
            path: "createProduct",
            component: () => import("@/views/createShopItem/CreateProduct.vue"),
            meta: {
              keepAlive: false,
            }
          },
          {
            path: "editProduct",
            component: () => import("@/views/createShopItem/editProduct.vue"),
            meta: {
              keepAlive: false,
            }
          }
        ]
      },
      {
        path:'ordermgt',
        component:()=>import('@/views/shopListCon/Odrmgt.vue'),
        meta:{},
        children:[
          {
            path:'orderList',
            component:()=>import('@/views/admstList/Ordermgt.vue')
        
        }
        ]
       }
    ] 
  },
];
// 创建路由实例.
const router = createRouter({
  history: routerHistory,
  routes: jsonArrayRoute,
});
// 输出路由实例和菜单数组 (全局变量).
export { router };