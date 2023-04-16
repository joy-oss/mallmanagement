import { createApp } from 'vue'
import {router} from './router/index.js'
import App from './App.vue'
import HelperAxios from 'axios'
import ElementPlus from "element-plus"
import "element-plus/dist/index.css";
const AppNew=createApp(App)
router.beforeEach((to,from,next)=>{
    if(to.meta.loginFlag!==undefined&&to.meta.loginFlag==='alreadyLgn'){
        const token=window.localStorage.getItem('token')
       if(token===null){
        next({path:'/'})
       }else{
        next()
       }
    }else{
        next()
    }
})
AppNew.use(router)
AppNew.use(ElementPlus);
AppNew.config.globalProperties.$HelperAxios=HelperAxios
AppNew.mount('#app')
