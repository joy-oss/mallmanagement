<template>
  <div class="admMgmt">
      <div class="admMgtTitle"><span>管理员列表</span></div>
      <el-row class="newAdd">        
        <el-button  @click="dialogFormVisible = true" type="primary">
       +新增
      </el-button>
      <el-input
    v-model="input2"
    class="w-50 m-2"
    placeholder="请输入用户名姓名"
    :suffix-icon="Search"
  /></el-row>
      <el-dialog v-model="dialogFormVisible" title="新增管理员">
  <el-form :model="form">
    <el-form-item label="管理员姓名" :label-width="formLabelWidth">
      <el-input v-model="form.admin_name" autocomplete="off" />
    </el-form-item>
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input v-model="form.user_name" autocomplete="off" />
    </el-form-item> 
    <el-form-item label="所属角色" :label-width="formLabelWidth">
      <el-select multiple v-model="form.user_role" placeholder="Please select a role">
        <el-option label="运营人员" value=1><input type="checkbox">运营人员</el-option>
        <el-option label="客服人员" value=2><input type="checkbox">客服人员</el-option>
        <el-option label="发货人员" value=3><input type="checkbox">发货人员</el-option>
      </el-select>
  </el-form-item>
    <el-form-item label="用户密码" :label-width="formLabelWidth">
      <el-input v-model="form.user_pws" autocomplete="off" />
    </el-form-item>
    <el-form-item label="确认密码" :label-width="formLabelWidth">
      <el-input v-model="form.user_ensurepws" autocomplete="off" />
    </el-form-item>
    <el-form-item label="排序" :label-width="formLabelWidth">
      <el-input-number v-model="form.name" autocomplete="off" :min="1" :max="1000" controls-position="right" class="mx-4"/>
    </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="addAccount">
        确定
      </el-button>
    </span>
  </template>
</el-dialog>
<div class="admTableCon">
<el-table :data="tableData" style="width: 100%">
  <el-table-column prop="admin_id" label="管理员ID" width="180" />
  <el-table-column prop="admin_name" label="用户名" width="180" />
  <el-table-column prop="pw" label="姓名" width="180" />
  <el-table-column prop="last_login_time" label="排序" width="180" />
  <el-table-column prop="create_time" label="添加时间" width="180" /> 
  <el-table-column prop="" label="操作">
    <!-- /通过row获取点击事件的列表行数据/ -->
<template #default="{row}">
  <el-button  link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
    <el-dialog v-model="dialogFormVisible2" title="编辑管理员">
     <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="管理员姓名：" prop="admin_name">
      <el-input v-model="ruleForm.admin_name" />
    </el-form-item>
    <el-form-item label="用户名：" prop="user_name">
      <el-input v-model="ruleForm.user_name" /> 
    </el-form-item>
    <el-form-item >
      <span>后台登陆用户名</span>
    </el-form-item>
    <el-form-item label="用户密码：" prop="delivery">
      <el-input v-model="ruleForm.pw" />
    </el-form-item>
    <el-form-item >
      <span>后台登陆密码</span>
    </el-form-item>
    <el-form-item label="确认密码：" prop="delivery">
      <el-input v-model="ruleForm.user_pws" />
    </el-form-item>
    <el-form-item label="排序：" prop="count">
      <el-input-number
  v-model="ruleForm.count"
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
      <el-button type="primary" @click="reqEdit(row)">
        确定
      </el-button>
    </span>
  </template>
</el-dialog>
</template>
<!-- // -->
  </el-table-column>
</el-table>
</div>
<div class="pagin">
          <el-pagination background layout="prev, pager, next" :total="jsonPagin.NumRowQuantity" :page-size="jsonPagin.PageSize" @current-change="handPageTurn"/>
      </div>
  </div>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
import { getCurrentInstance,ref } from 'vue';
const {proxy} =getCurrentInstance()
let dialogFormVisible2=ref(false)
const tableData=ref([])
let input2=ref('')
const AccessToken=window.localStorage.getItem('token')
let jsonPagin=ref({
      NumRowQuantity:0,
      PageSize:10,
      PageIndex:1
  })
function accountList(){
// console.log(AccessToken)
proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/accountList',{token:AccessToken,page:jsonPagin.value.PageIndex,size:jsonPagin.value.PageSize})
.then(function(res){
if(res.status===200){
  // console.log(res)
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
  function handleEdit(row){
    // console.log(row)
    dialogFormVisible2.value=true
    ruleForm.value.admin_name=row.pw
    ruleForm.value.user_name=row.admin_name
  }

const formSize = ref('default')
const ruleFormRef = ref()
const ruleForm = ref({
  admin_name: '',
  user_name:'',
  count: 100,
  user_pws:'',
  pw:'',
  //此布尔值用来控制*是否显示
  delivery: false,
})

const rules = ref({
  admin_name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 3, max: 1000, message: '长度最小为3', trigger: 'blur' },
  ],
  count: [
    {
      required: true,
      message: '请输入序号',
      trigger: 'change',
    },
  ],
  user_name: [
    {
      type: 'string',
      required: true,
      message: '请输入商品类型',
      trigger: 'change',
    },
  ],
})
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
function reqEdit(row){
  // console.log(row)
  submitForm()
   proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/register',{AccessToken:'token',name:ruleForm.admin_name,pw:ruleForm.pw,role:row.roles,admin_id:row.admin_id})
   .then(function(res){
    // console.log(res)
    dialogFormVisible2.value=false;
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
.admMgmt .newAdd{
position:relative;
width: 100%;
}
.admMgmt .newAdd .el-input{
position:absolute;
right:10px;
top:0px;
}
.addAdm {
  width: 1000px;
  position: relative;
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