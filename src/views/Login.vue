<template>
    <div class="login">
        <div class="loginForm">
            <div class="logo"><img src="/loginImg/logo.jpg" alt=""></div>
            <div class="title"><span>商城登陆系统</span></div>
            <div class="nouser" v-show="nousertip">               
                 <img src="/loginImg/error.jpg" alt=""/>
                <input type="text" placeholder="登陆失败，该用户不存在或者已删除"></div>
            <div class="lgerror" v-show="errortip">
                <img src="/loginImg/error.jpg" alt=""/>
                <input type="text" placeholder="登陆失败，用户名或密码错误">
            </div>
            <div class="unm">
                <img src="/loginImg/user.jpg" alt=""/>
                <input type="text" placeholder="请输入用户名" v-model="uname"  :class="{active:uname===''}">
                <div  class='tip' v-show="unmisnull"><span>您还没有输入用户名</span></div>
            </div>
            
            <div class="pws"><img src="/loginImg/pws.jpg" alt=""/>
                <input type="password" placeholder="请输入用户密码" v-model="upws"  :class="{active:upws===''}"/>
                <div class='tip' v-show="pwsisnull"><span>您还没有输入用户密码</span></div>
            </div>
    
            <div class="ensure">
                <input type="submit" value="确定" @click="ensure">
                <!-- <el-table v-loading="loading"  style="width: 100%"> -->
                <!-- </el-table> -->
            </div>
        </div>
    </div>
</template>
<script setup>
import { ElMessage,ElNotification } from 'element-plus'
import {ref,getCurrentInstance} from 'vue'
const {proxy} =getCurrentInstance()
let uname=ref('')
let upws=ref('')
let errortip=ref(false)
let nousertip=ref(false)
let pwsisnull=ref(false)
let  unmisnull=ref(false)
function ensure(){
    if(uname.value===''){
        unmisnull.value=true
        }
    if(upws.value===''){
        pwsisnull.value=true
    }
    if(uname.value!==''&&upws.value!==''){
        proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/login',{name:uname.value,pw:upws.value}).then(function(res){
        if(res.status===200){
            if(res.data.code===2010){
            if(res.data.msg==='密码错误'){
            ElMessage.error('登录失败，用户名或密码错误')
            errortip.value=!errortip.value
            }else{
            ElMessage.error('登录失败，该用户不存在或已删除')
            nousertip.value=!nousertip.value
            }
            }else{
            ElMessage({
            message: '登陆成功',
            type: 'success',
            })
            ElNotification({
            title: '欢迎',
            message: "下午好，欢迎回来",
            position: 'top-right',
            type:'success'
        })
        const token=res.data.data.token
        window.localStorage.setItem('token',token)
        proxy.$router.push({path:'/shopList'}) 
            }
        }else{
         alert('网络请求错误')
        }
       })  
    }
          
}

</script>

<style > 
.login{
position: relative;
width: 100%;
height:750px;
box-sizing: border-box;
background:url('../../public/loginImg/bg.jpg') no-repeat fixed;
}
.loginForm{
   width: 340px;
   margin-left:45%;
   transform: translateX(-100px)translateY(230px);
}
.loginForm>div{
    width: 100%;
    text-align: center;
}
.loginForm input{
    border-radius: 2px;
}
.logo{
    margin-bottom: 20px;
}
.logo img{
vertical-align: middle;
width:50px;
height:50px;
}
.title{
    margin-bottom: 40px;
    font-size: 20px;
    color: #6c7293;
    font-family: Avenir,Helvetica Neue,Arial,Helvetica,sans-serif;
}
.unm,.pws,.nouser,.lgerror {
    position: relative;
    margin-bottom: 20px;
}
.unm img,.pws img,.nouser img,.lgerror img{
    position: absolute;
    width: 14px;
    height:14px;
    top:13px;
    left:11px;
}
.unm input,.pws input,.nouser input,.lgerror input{
    border: none;
    width: 299px;
    height:28px;
    background: rgba(235,237,242,.4);
    border-radius: 5px;
    font-size: 14px;
    padding:6px 11px 6px 30px;
}
.nouser input,.lgerror input{
    background-color: #fff1f0;
    border: 1px solid #ffa39e;
    color: rgba(0,0,0,.65); 
    font-size: 14px;
}
.unm .active input :focus{
    border:solid 2px #D1E9FF;
}
.unm input::placeholder,.pws input::placeholder{
    color:#BDBEBF;
}
.unm .tip,.pws .tip{
    text-align: left;
    font-size:13px;
    color: rgba(0,0,0,.45);
    transform: translateY(10px);
}
.ensure input{
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    color: #fff;
    margin-top: 20px;
    background-color: #1890ff;
    border:none;
}

</style>