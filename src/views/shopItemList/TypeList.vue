<template>
    <div class="admMgmt">
        <div class="admMgtTitle"><span>商品分类</span></div>
        <el-button  @click="dialogFormVisible = true" type="primary">
         +新增
        </el-button>
        <el-dialog v-model="dialogFormVisible" title="新增商品分类">
          <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="ruleForm.type">
          <el-option label="顶级分类" value="顶级分类" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类图片：">
        <el-upload
    class="avatar-uploader"
    action="http://api_devs.wanxikeji.cn/api/savePic"
    :show-file-list="true"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
      </el-form-item>
      <el-form-item label="状态：" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="显示" />
          <el-radio label="隐藏" />
        </el-radio-group>
      </el-form-item>
      <el-form-item >
        <span>用户端是否显示</span>
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
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addtype">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="admTableCon">
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="good_type_id" label="分类ID" width="180" />
    <el-table-column prop="type_name" label="分类名称" width="180" />
    <el-table-column prop="status" label="状态" width="180" ><el-button type="success" plain size="small" >显示</el-button></el-table-column>
    <el-table-column prop="admin_id" label="排序" width="180" />
    <el-table-column prop="create_time" label="添加时间" width="180" /> 
    <el-table-column label="操作">
      <template #default="{row}">
          <el-button link type="primary" size="small" @click="edtClick(row)">编辑</el-button>
          <!-- / -->
        <el-button link type="primary" size="small" >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 挨着放就会变卡 -->
  <el-dialog v-model="showEdit" title="编辑商品分类">
          <el-form
      ref="ruleFormRef"
      :model="ruleForm1"
      :rules="rules1"
      label-width="120px"
      class="demo-ruleForm"
      size="default"
      status-icon
    >
      <el-form-item label="分类名称：" prop="edit_name">
        <el-input v-model="ruleForm1.edit_name" />
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="ruleForm1.edit_type">
          <el-option label="顶级分类" value="顶级分类" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类图片：">
        <el-upload
    class="avatar-uploader"
    action="http://api_devs.wanxikeji.cn/api/savePic"
    :show-file-list="true"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
      </el-form-item>
      <el-form-item label="状态：" prop="edit_resource">
        <el-radio-group v-model="ruleForm1.edit_resource">
          <el-radio label="显示" vlaue="显示"/>
          <el-radio label="隐藏" value="隐藏"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item >
        <span>用户端是否显示</span>
      </el-form-item>
      <el-form-item label="排序：" prop="edit_count">
        <el-input-number
    v-model="ruleForm1.edit_count"
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
        <el-button @click="showEdit = false">取消</el-button>
        <el-button type="primary" @click="editType(row)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
  </div>
</template>
<script setup>
import { getCurrentInstance,ref } from 'vue';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
const {proxy} =getCurrentInstance()
const tableData=ref([])
let showEdit=ref(false)
const AccessToken=window.localStorage.getItem('token')
//   import { FormInstance, FormRules } from 'element-plus'
//   import { UploadProps } from 'element-plus'
  const formSize = ref('default')
  const ruleFormRef = ref()
  let imageUrl = ref('')
  let imageUrl1 = ref('')
  const ruleForm = ref({
    name: '请输入商品名称',
    type:'请选择上级分类',
    board: '',
    coder:'',
    count: 100,
    resource: '显示',
    //此布尔值用来控制*是否显示
   
  })
  
  const rules = ref({
    name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' },
      { min: 1, max: 1000, message: '长度最小为1', trigger: 'blur' },
    ],
    board: [
      {
        required: true,
        message: '请选择运费模板',
        trigger: 'change',
      },
    ],
    count: [
      {
        required: true,
        message: '请输入序号',
        trigger: 'change',
      },
    ],
    type: [
      {
        type: 'string',
        required: true,
        message: '请输入商品类型',
        trigger: 'change',
      },
    ],
    resource: [
      {
        required: true,
        message: '请选择状态类型',
        trigger: 'change',
      },
    ],
  })
  const ruleForm1 = ref({
    edit_name: '请输入商品名称',
    edit_type:'请选择上级分类',
    edit_board: '',
    edit_coder:'',
    edit_count: 100,
    edit_resource: '显示',
    //此布尔值用来控制*是否显示
   
  })
  
  const rules1 = ref({
    edit_name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' },
      { min: 1, max: 1000, message: '长度最小为1', trigger: 'blur' },
    ],
    edit_board: [
      {
        required: true,
        message: '请选择运费模板',
        trigger: 'change',
      },
    ],
    edit_count: [
      {
        required: true,
        message: '请输入序号',
        trigger: 'change',
      },
    ],
    edit_type: [
      {
        type: 'string',
        required: true,
        message: '请输入商品类型',
        trigger: 'change',
      },
    ],
    edit_resource: [
      {
        required: true,
        message: '请选择状态类型',
        trigger: 'change',
      },
    ],
  })
function handleAvatarSuccess (response,uploadFile)  {
  console.log(response,uploadFile)
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
function accountList(){
// console.log(AccessToken)
proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/goodsTypeList',{token:AccessToken,name:ruleForm.value.name,pw:ruleForm.value.user_pws,roles:ruleForm.value.user_role})
.then(function(res){
if(res.status===200){
    // console.log(res)
    tableData.value=res.data.data
}
})
}
accountList()
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
function addtype(){
    dialogFormVisible.value = false
    console.log(ruleForm.value.name)
    proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/addGoodType',{token:AccessToken,name:ruleForm.value.name})
    .then(function(res){
      accountList()
      console.log(res)
    })
}
let id=ref(0)
function edtClick(row)
{
showEdit.value=true
console.log(row)
id.value=row.good_type_id
// setTimeout(()=>{
ruleForm1.value.edit_name=row.type_name
ruleForm1.value.edit_type=row.admin_id===0?'顶级角色':row.admin_id
ruleForm1.value.edit_resource=row.status===1?'显示':'隐藏'
imageUrl1.value=row.pic
}
function editType(){
showEdit.value=false
proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/addGoodType',{token:AccessToken,name:ruleForm1.value.edit_name,id:id.value})
.then(function(res){
console.log(res)
accountList()
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
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>