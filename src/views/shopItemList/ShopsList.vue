<template>
    <div class="admMgmt">
        <div class="admMgtTitle"><span>商品列表</span></div>
        <div><span>商品名称：</span>   
      <el-input
      v-model="input1"
      class="w-30 m-2"
      placeholder="请输入商品名称"
    />
    <span>商品编码：</span>        
    <el-input
      v-model="input2"
      class="w-30 m-2"
      placeholder="请输入商品编码"
    />
    <span>商品分类：</span>      
    <el-tree-select placeholder="全部分类" :data="typelist" v-model="value"  :props="{value:'good_type_id',children:'children',label:'type_name'}" node-key='good_type_id'   @check="getCheck" show-checkbox/> 
    <el-button type="primary" :icon="Search" @click="searchEvent">搜索</el-button>
  </div>
<el-row>
  <el-button-group class="showState">
  <el-button plain>全部</el-button>
  <el-button plain>出售中</el-button>
  <el-button plain>已下架</el-button>
  <el-button plain>已售罄</el-button>
  <el-button type="primary" @click="createProduct">
         +创建商品
  </el-button>
</el-button-group>
  <el-button-group class="changeState" v-show="showChangeState">
  <el-button class='' plain :icon="Upload" @clcik="">上架</el-button>
  <el-button plain :icon="Download" @click="">下架</el-button>
  <el-button plain :icon="Delete" @click="">删除</el-button>
  </el-button-group>
</el-row>
  <div class="admTableCon">
  <el-table :data="tableData" style="width: 100%" @selection-change="selectionChange" >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="good_id" label="商品ID" width="100" />
    <!--elementplus表格里渲染图片  -->
    <el-table-column prop="img" label="商品图片" width="120">
       <template #default="scope" class="imgbox"  >
      <img width="50" height="50" :src="scope.row.img" class="img"/>
    </template>
    </el-table-column>
    <el-table-column class="shopname" prop="good_name" label="商品名称" width="100" />
    <el-table-column prop="price" label="商品价格" width="100" />
    <el-table-column prop="type_id" label="总销量" width="100" />
    <el-table-column prop="type_parent_id" label="库存数量" width="100" />
    <el-table-column prop="status" label="状态" width="180" >
      <!-- 行内获取elementplus table遍历数据  -->
      <template #default="{row}">
        <el-button type="success" plain size="small" v-show="row.status===1">上架</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="" label="排序" width="100" > 100</el-table-column>
    <el-table-column prop="create_time" label="添加时间" width="100" /> 
    <el-table-column label="操作">
      <template #default="{row}">
          <el-button-group>
            <el-button link type="primary" size="small" @click="editProduct(row)">编辑</el-button>
            <el-button link type="primary" size="small">删除</el-button>
          </el-button-group>
      </template>
    </el-table-column>
    </el-table>
  </div>
  <div class="pagin">
            <el-pagination background layout="prev, pager, next" :total="jsonPagin.NumRowQuantity" :page-size="jsonPagin.PageSize" @current-change="handPageTurn"/>
        </div>
    </div>
</template>
<script setup>
import { getCurrentInstance,ref } from 'vue';
import { Search,Upload,Delete,Download } from '@element-plus/icons-vue'
const {proxy} =getCurrentInstance()
const tableData=ref([])
let selectedRow=ref({})
let showChangeState=ref(false)
let typelist=ref([])
const value = ref()
let selecttype=ref(0)
const input1=ref('')
const input2=ref('')
const AccessToken=window.localStorage.getItem('token')
let jsonPagin=ref({
        NumRowQuantity:0,
        PageSize:10,
        PageIndex:1
    })
function accountList(){
proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/goodList',{token:AccessToken,page:jsonPagin.value.PageIndex,size:jsonPagin.value.PageSize})
.then(function(res){
if(res.status===200){
  console.log(res)
    tableData.value=res.data.data.data
    jsonPagin.value.NumRowQuantity=res.data.data.count 
}
})
}
accountList()
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = ref({
  admin_name:'',
  user_name:'',
  user_role: [],
  user_pws:'',
  user_ensurepws:'',
  order:0
})
function addAccount(){
    dialogFormVisible.value = false
    proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/register',{token:AccessToken,name:form.value.user_name,pw:form.value.user_pws,roles:form.value.user_role})
    .then(function(res){
      console.log(res)
        if(res.data.code===2010){
            alert("用户已存在")
        }else{
          //页码+1
            jsonPagin.value.NumRowQuantity=jsonPagin.value.NumRowQuantity+1
            accountList()
        } 
    })
  form.value={
  admin_name:'',
  user_name:'',
  user_role: [],
  user_pws:'',
  user_ensurepws:'',
//   delivery: false,
  pw: '',
  order:0
}
}
    function handPageTurn(CurrenPage){
        jsonPagin.value.PageIndex=CurrenPage
        accountList()
    }
    function selectionChange(section){
       if(section.length!==0){
       showChangeState.value=true
       }else{
       showChangeState.value=false
      }
    }
    function typeList(){
      proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/goodsTypeList',{token:AccessToken}).then(res=>{
         const firstlev=res.data.data.filter(item=>item.parent_id===0)
         firstlev.map(item=>item.children=[])
        for(let i=0;i<firstlev.length;i++){
          for(let j=0;j<res.data.data.length;j++){
            if(firstlev[i].good_type_id===res.data.data[j].parent_id){
              firstlev[i].children.push(res.data.data[j])
            }
          }
        }
        const endtylist=firstlev.filter(item =>item.children.length!==0)
        typelist.value=endtylist
      })
    }
    typeList()
    function searchEvent(){
      console.log(tableData.value)
      const shopname=input1.value
      const shopid=input2.value
      const shoptype=selecttype
    if(shopname!==''&&shopid===''){
      const searchdata=tableData.value.filter(item=>item.good_name.includes(shopname))
      tableData.value=searchdata
    }else if(shopname===''&&shopid!==''){
      const searchdata=tableData.value.filter(item=>item.good_id===Number(shopid))
      tableData.value=searchdata
    }else if(shopname!==''&&shopid!==''){
      const searchdata=tableData.value.filter(item=>item.good_id===Number(shopid)&&item.good_name.includes(shopname))
      tableData.value=searchdata
    }
  }
    function getCheck(obj){
      selecttype.value=obj.good_type_id
     tableData.value=tableData.value.filter(item=>item.type_id===obj.good_type_id)  
     console.log(obj)
    }
    function createProduct(){
    proxy.$router.push({path:'/shopList/cmgmgt/createProduct'})
    }
    function editProduct(row){
      proxy.$router.push({path:'/shopList/cmgmgt/editProduct',query:{good_id:row.good_id}})
    }
</script>
<style>
.admMgmt{
    display: flex;
    flex-flow:column nowrap;
    justify-content: flex-start;
    align-items: flex-start;
}
.admMgtTitle{
    margin-bottom:16px;
}
.addAdm {
    width: 1000px;
    position: relative;
}
.search{
    position: absolute;
    right:0;
    top:0;
}
.search img{
    position: absolute;
    width: 16px;
    height:16px;
    top:10px;
    right:10px;
}
.search input{
    width: 257px;
    height:22px;
    padding:4px 30px 4px 11px;
    border:solid 1px rgb(217,217,217);
    border-radius: 2px;
}
.search input::placeholder{
    color:rgb(217,217,217);
}
.addAdm button{
width: 79px;
height: 32px;
padding:0 15px;
background-color: rgb(24,144,255);
border:none;
color:#fff;
font-size:14px;
border-radius: 2px;
}
table{
    width: 100%;
    background-color: red;
}
table tr{
height:54px;
background-color: #FAFAFA;
}

.el-button--text {
  margin-right: 15px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.pagin{
  margin-top:50px;
  margin-bottom: 115px;
}
.el-input{
  margin-right:20px;
  width: 200px;
}
.el-input:nth-of-type(4){
  width:50px;
}
.el-row{
margin:20px 0;
}
.el-row .el-button{
  margin:0;
  border-radius: 2px;
}
.el-row .showState .el-button:nth-of-type(5){
margin-left:20px;
}
.el-row .changeState{
margin-left:15px;
}
.el-table .el-table_1_column_4>div{
   display:-webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 20px;
}
</style>