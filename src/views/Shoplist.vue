<template>
    <div class="shopList">
        <div class="listTitle">
            <div class="shopName"><h1>萤火商城<span>2.0</span></h1></div>
            <ul class="shoCon">
       <li @click="changeColor" :class="{isclick:isclick}"><router-link to="/shopList/admst"><img src="/listImg/gly.png" alt=""><span>管理员</span></router-link></li>
       <li @click="changeColor" :class="{isclick:isclick}"><router-link to="/shopList/cmgmgt"><img src="/listImg/spgl.png" alt=""><span>商品管理</span></router-link></li>
       <li @click="changeColor" :class="{isclick:isclick}"><router-link to="/shopList/ordermgt"><img src="/listImg/dingdan.png" alt=""><span>订单管理</span></router-link></li>
            </ul>
        </div>
        <div class="listCon">
            <router-view>
            </router-view>
        </div>
    </div>
</template>
<script setup>
import { getCurrentInstance,ref } from 'vue';
const {proxy} =getCurrentInstance()
let isclick=ref(false)
// proxy.$HelperAxios.get('')
// function changeColor(e){
// isclick.value=true
// }
</script>
<style>
a{
    text-decoration: none;
    color:#A6ADB4;
}
a:active{
    color:#fff;
}
li{
    list-style:none;
}
ul{
    padding:0;
    margin:0;
}
.shopList{
    display:flex;
    flex-flow:row nowrap;
    justify-items: flex-start;
    align-items: flex-start;
    height:500px;
}
.isclick{
    background-color: #fff;
}
.listTitle{
    width:160px;
    height:1000px;
    color: hsla(0,0%,100%,.65);
    background-color:#001529;
}
.shopName h1{
    box-sizing: border-box;
    color: #fff;
    font-size: 15px;
    font-weight: 400;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    height:64px;
    line-height: 64px;
    padding-left:18px;
}
h1 span{
    font-size:14px;
}

.shoCon li{
    box-sizing: border-box;
    padding-left:24px;
    padding-right:16px;
    margin-top:4px;
    margin-bottom: 8px;
    width: 154px;
    height: 40px;
    line-height: 40px;;  
}
.isactive{
    background-color: #1890FF;
}
.shoCon img{
    vertical-align: middle;
    width:1.2em;
    height:1.2em;
    margin-top:-3px;
    margin-right:10px;
}
.shoCon span{
font-size:14px;
}
.listCon{
    width: 100%;
    height:1000px;
    background-color: #F0F2F5;
    padding-left:10px;
}
</style>