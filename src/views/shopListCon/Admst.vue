<template>
    <div class="admt">
           <div class="admtNav">
            <div class="admtNavLeft"><img src="/homePageImg/file.png" alt=""><img src="/homePageImg/load.png" alt="" @click="reloadClick"> <span>管理员</span><span>/</span><span>{{ clickwhich }}</span></div>
            <div class="admtNavRight"><img src="/homePageImg/adms.png" alt=""><span>系统管理员</span></div>
           </div>
<div class="admtListCon">
    <div class="admList">
           <ul>
            <li class="admListfirstli"><span>管理员</span></li>
            <li @click="clickwhich='管理员列表'"><router-link to="/shopList/admst/admMgmt"><span>管理员列表</span></router-link></li>
            <li @click="clickwhich='角色管理'"><router-link to="/shopList/admst/roleMgmt"><span>角色管理</span></router-link></li>
           </ul>
           </div>
           <div class="admListCon">
            <router-view></router-view>
           </div>
</div>

    </div>
</template>
<style>
.admtNav{
    height:64px;
    background-color: #fff;
    margin-left:-10px;
    position: relative;
    font-size:14px;
    box-shadow: 0 1px  3px #F0F2F5;
}
.admtNavLeft{
position: absolute;
left:0;
top:20px;
}
.admtNavRight{
position: absolute; 
right:20px;
top:20px;
}
.admtNav img{
width: 20px;
height:20px;
vertical-align: middle;
}
.admtNav img{
    margin-right:12px;
}
.admtNav img:nth-of-type(1){
    margin-left:26px;
}
.admtNav img:nth-of-type(2){
    margin-left:12px;
}
.admtNavLeft span:nth-of-type(1){
    margin-left:45px;
    color:#CBCACB;
}
.admtNavLeft span:nth-of-type(2){
    margin:0 8px;
    color:#595959;
}
.admtListCon{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
}
.admList{
    margin-left:-10px;
    width: 120px;
    background-color: #fff;
    height:936px;
}
.admList ul{
    margin:0;
    padding:0;
}
.admList ul li{
    margin-left:26px;
    height:50px;
    color:#333333;
    font-size:14px;
    line-height:55px;
}
.admListfirstli{
    font-size:14px;  
}
.admList ul li:not(.admListfirstli){
    font-size:13px;
}
.admList a{
color:#333333
}
.admList a:hover{
    color:rgb(24,144,255)
}
.admList a:link{
    color:rgb(24,144,255)
}
.admListCon{
    background-color: #fff;
    margin:20px;
    width: 1080px;
    padding:24px;
}
</style>
<script>
export default{
    data(){
        return{
            clickwhich:'管理员列表'
        }
    },
    methods:{
        reloadClick(){
            location.reload()
        } 
    }
}
</script>