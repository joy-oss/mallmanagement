<template>
  <div class="orderhome">
    <div style="margin-top:-5px">全部订单</div>
    <div>
    <span>订单号查询：</span><el-input v-model="oder_id" placeholder="请输入订单号" class="odidinput"></el-input>
    <span style="margin-left:10px">订单来源：</span> 
    <el-select v-model="value" class="m-2" placeholder="全部" size="large">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</div>
    <div>
        <span>支付方式：</span>
        <el-select v-model="value1" class="m-2" placeholder="全部" size="large">
            <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            />
        </el-select>
        <span style="margin-left:10px">配送方式：</span>
        <el-select v-model="value2" class="m-2" placeholder="全部" size="large">
            <el-option value="全部" label="全部"></el-option>
            <el-option value="快速配送" label="快速配送"></el-option>
        </el-select>
    </div>
    <div>
       <span>下单时间：</span>
       <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="To"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="default"
      />
       <el-button type="primary" :icon="Search" style="margin-left:10px">搜索</el-button> <el-button>重置</el-button>
    </div>
    <div>
    <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="商品信息" width="120" />
    <el-table-column prop="name" label="单价/数量" width="120" />
    <el-table-column prop="address" label="实付款" width="120"/>
    <el-table-column prop="date" label="买家" width="120" />
    <el-table-column prop="name" label="支付方式" width="120" />
    <el-table-column prop="address" label="配送方式" width="120"/>
    <el-table-column prop="address" label="交易状态" width="120"/>
    <el-table-column prop="date" label="操作"/>
    </el-table>
    </div>
  </div>
</template>

<script setup>
import {ref,getCurrentInstance} from 'vue'
import { Search } from '@element-plus/icons-vue'
let value=ref(''),value1=ref(''),value2=ref('')
let oder_id=ref(0)
const {proxy} =getCurrentInstance()
const token=window.localStorage.getItem('token')
const options=[
    {
        value:'全部',
        label:'全部'
    },
    {
        value:'普通订单',
        lebel:'普通订单'
    },
    {
        value:'砍价订单',
        label:'砍价订单'
    },
    {
        value:'秒杀订单',
        label:'秒杀订单'
    }

]
const options1=[
    {
        value:'全部',
        label:'全部'
    },
    {
        value:'余额支付',
        label:'余额支付'
    },
    {
        value:'微信支付',
        label:'微信支付'
    },
]
function getodrList(){
proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/OrderList',{token:token}).then(res=>{
    console.log(res)
})
}
getodrList()
</script>

<style>
.orderhome>div{
margin:20px 0;
}
.odidinput{
    width:342px;
}
</style>
