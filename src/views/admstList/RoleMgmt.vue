<template>
    <div class="admMgmt">
        <div class="admMgtTitle"><span>角色列表</span></div>
        <el-button  @click="dialogFormVisible1 = true" type="primary">
         +新增
        </el-button>
        <el-dialog v-model="dialogFormVisible1" title="新增角色">
          <el-form
    ref="ruleFormRef"
    :model="ruleForm1"
    :rules="rules1"
    label-width="120px"
    class="demo-ruleForm"
    size="default"
    status-icon
  >
  <el-form-item label="角色名称：" prop="role_name">
      <el-input v-model="ruleForm1.role_name" />
    </el-form-item>
    <el-form-item label="上级角色：" label-width="120px">
        <el-select v-model="ruleForm1.region" placeholder="请选择上级角色">
          <el-option label="顶级角色" value="1" />
          <el-option label="运营人员" value="2" />
          <el-option label="客服人员" value="4" />
          <el-option label="发货人员" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单权限：">
        <!-- 通过node_key获取选中的控件数组 -->
      <el-tree :data="menu_data"  :props="{id:'permission_id',children:'children',label:'permission_name'}" node-key='permission_id'   @check="getCheck" show-checkbox/>
    </el-form-item>
      <el-form-item label="排序：" prop="sort">
      <el-input-number
  v-model="ruleForm1.sort"
  class="mx-4"
  :min="1"
  :max="10000"
  controls-position="right"
/>
    </el-form-item>
    <el-form-item>
    <span>数字越小越靠前</span>
    </el-form-item>
</el-form>
<template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormVisible1=false">取消</el-button>
      <el-button type="primary" @click="addRole">
        确定
      </el-button>
    </span>
  </template>
        </el-dialog>
  <div class="admTableCon">
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="role_id" label="角色ID" width="180" />
    <el-table-column prop="role_name" label="角色名称" width="180" />
    <el-table-column prop="sort" label="排序" width="180" />
    <el-table-column prop="created_at" label="添加时间" width="180" /> 
    <el-table-column label="操作" width="120">
      <template #default="{row}">
        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-dialog v-model="dialogFormVisible2" title="编辑角色">
          <el-form
    ref="ruleFormRef"
    :model="ruleForm2"
    :rules="rules2"
    label-width="120px"
    class="demo-ruleForm"
    size="default"
    status-icon
  >
  <el-form-item label="角色名称：" prop="role_name">
      <el-input v-model="ruleForm2.role_name" />
    </el-form-item>
    <el-form-item label="上级角色：" label-width="120px">
        <el-select v-model="ruleForm2.super_role" placeholder="请选择上级角色">
          <el-option label="顶级角色" value="1" />
          <el-option label="运营人员" value="2" />
          <el-option label="客服人员" value="4" />
          <el-option label="发货人员" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单权限：">
        <!-- 通过绑定变量动态设置默认节点选中default-checked-keys -->
         <el-tree ref="tree" :data="menu_data"  :props="{id:'permission_id',children:'children',label:'permission_name'}" node-key='permission_id' show-checkbox :default-checked-keys="ruleForm2.permissions" @check="getcheck2"/>
    </el-form-item>
      <el-form-item label="排序：" prop="sort">
      <el-input-number
  v-model="ruleForm2.sort"
  class="mx-4"
  :min="1"
  :max="10000"
  controls-position="right"
/>
    </el-form-item>
    <el-form-item>
    <span>数字越小越靠前</span>
    </el-form-item>
</el-form>
<template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormVisible2=false">取消</el-button>
      <el-button type="primary" @click="editRole(row)">
        确定
      </el-button>
    </span>
  </template>
        </el-dialog>
        <el-button link type="primary" size="small">删除</el-button> 
      </template>
    </el-table-column>
  </el-table>
  </div>
  <div class="pagin">
            <el-pagination background layout="prev, pager, next" :total="jsonPagin.NumRowQuantity" :page-size="jsonPagin.PageSize" @current-change="handPageTurn" />
        </div>
    </div>
</template>
<script setup>
import { getCurrentInstance,ref } from 'vue';
import {ElMessageBox } from 'element-plus'
const {proxy} =getCurrentInstance()
const tableData=ref([])
let value=ref([])
let tree=ref(null)
const dialogFormVisible1 = ref(false)
const dialogFormVisible2 = ref(false)
const  reqMenu=ref([])
const AccessToken=window.localStorage.getItem('token')
let jsonPagin=ref({
        NumRowQuantity:0,
        PageSize:10,
        PageIndex:1
    })
function accountList(){
proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/roleLise',{token:AccessToken,page:jsonPagin.value.PageIndex,size:jsonPagin.value.PageSize})
.then(function(res){
if(res.status===200){
    // console.log(res)
    tableData.value=res.data.data.data
    jsonPagin.value.NumRowQuantity=res.data.data.count 
}
})
}
accountList()
let ruleForm1 = ref({
  role_name: '',
  super_role:[],
  permissions:[],
  sort:100,
  //此布尔值用来控制*是否显示
  delivery: false,
})
let rules1 = ref({
  role_name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 3, max: 1000, message: '长度最小为3', trigger: 'blur' },
  ],
  sort: [
    {
      required: true,
      message: '请输入序号',
      trigger: 'change',
    },
  ],
})
let ruleForm2 = ref({
  role_name: '',
  super_role:[],
  permissions:[],
  sort:100,
  //此布尔值用来控制*是否显示
  delivery: false,
})
let rules2 = ref({
  role_name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 3, max: 1000, message: '长度最小为3', trigger: 'blur' },
  ],
  sort: [
    {
      required: true,
      message: '请输入序号',
      trigger: 'change',
    },
  ],
})
let menu_data=ref([])
function per_menu(){
    proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/permissionList',{token:AccessToken})
    .then(function(res){
      // console.log(res.data.data)
      //构建el-tree数据结构
      menu_data.value=res.data.data.filter(item=>item.parent_id===1||item.parent_id===8)
      menu_data.value[0].children=res.data.data.filter(item=>item.parent_id===2)
      menu_data.value[1].children=res.data.data.filter(item=>item.parent_id===3)
      menu_data.value[2].children=res.data.data.filter(item=>item.parent_id===9)
      menu_data.value[3].children=res.data.data.filter(item=>item.parent_id===13)
      // console.log(menu_data.value)
    })
  }
  per_menu()
  function getCheck(nodeObj,selectObj){
    //获取树形控件选中的权限列表数组
    ruleForm1.value.permissions=selectObj.checkedKeys 
  }
function addRole(){
    dialogFormVisible1.value = false
    proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/roleAddModify',{token:AccessToken,role_name:ruleForm1.value.role_name,permissions:ruleForm1.value.permissions})
    .then(function(res){
     accountList()
     console.log(res)
    })
}
function handPageTurn(CurrenPage){
        jsonPagin.value.PageIndex=CurrenPage
        accountList()
    }
    function handleEdit(row){
      console.log(row)
      dialogFormVisible2.value=true
      ruleForm2.value.role_name=row.role_name
      ruleForm2.value.sort=row.sort
      //拿取返回数据的权限id号
      for(let i=0;i<row.permission.length;i++){
        ruleForm2.value.permissions.push(row.permission[i].permission_id)
      }
      console.log( ruleForm2.value.permissions)
    }
  //   function handleDel(row){
  //    ElMessageBox.confirm(`你确定要删除该条记录么?</br><span>删除后不可恢复</span>`,
  //   {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     dangerouslyUseHTMLString: true,
  //     type: 'warning',
  //   }
  // ).then(()=>{
    // console.log(row)
    // proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/roleAddModify',{token:AccessToken,role_name:row.role_name,permissions:row.permissions,role_id:row.role_id})
    // .then(function(res){
    //  console.log(res)
    // })
  // })
  //   }
//获取编辑后的控件选中的权限列表
function getcheck2(nodeObj,selectObj){
ruleForm2.value.permissions=selectObj.checkedKeys 
}
function editRole(row){
  dialogFormVisible2.value=false
  console.log(row)
  proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/roleAddModify',{token:AccessToken,role_name:ruleForm2.value.role_name,permissions:ruleForm2.value.permissions,role_id:row.role_id})
  .then(function(res){
    accountList()
    console.log(res)
  })
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
</style>