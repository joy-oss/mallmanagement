<template>
  <div class="tab_title"><span>编辑商品</span></div>
  <el-tabs v-model="activeName" class="demo-tabs basicInfo" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="first">
      <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="商品名称：" prop="name" class="shopStyle" >
        <el-input v-model="ruleForm.name"  placeholder="请输入商品名称"/>
      </el-form-item>
      <el-form-item label="商品分类：" prop="type" class="shopStyle">
        <el-tree-select placeholder="全部分类" :data="typelist" v-model="value"  :props="{value:'good_type_id',children:'children',label:'type_name'}" node-key='good_type_id'   @check="getCheck" show-checkbox/> 
      </el-form-item>
      <el-form-item>
        <el-button link type="primary" size="small" >去新增</el-button>
        <el-button link type="primary" size="small" >刷新</el-button>
      </el-form-item>
      <el-form-item label="商品图片：">
        <el-upload
    class="avatar-uploader"
    method="post"
    name="img"
    action="http://api_devs.wanxikeji.cn/api/savePic"
    :show-file-list="true"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :multiple="true"
    >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
      </el-form-item>
    <el-form-item>
      <div class="ant-from-extra">建议尺寸：750*750像素,最多上传10张，可拖拽图片调整顺序，第一张将作为商品首图</div>
    </el-form-item>
      <el-form-item label="商品编码：" prop="delivery" class="shopStyle">
        <el-input v-model="ruleForm.coder" />
      </el-form-item>
      <el-form-item label="运费模板：" prop="board">
        <el-select v-model="ruleForm.board">
          <el-option label="全国包邮(除偏远地区外)" value="shanghai" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button link type="primary" size="small" >新增模板</el-button>
        <el-button link type="primary" size="small" >刷新</el-button>
      </el-form-item>
      <el-form-item label="商品状态：" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="上架" />
          <el-radio label="下架" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品排序：" prop="count">
        <el-input-number
    v-model="ruleForm.count"
    class="mx-4"
    :min="1"
    :max="10000"
    controls-position="right"
  />
      </el-form-item>
      <el-form-item>
      <div class="ant-from-extra sortextra">数字越小越靠前</div>
    </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
      <!-- / -->
    </el-tab-pane>
    <el-tab-pane label="规格/库存" name="second">
      <el-form
      ref="ruleFormRef"
      :model="ruleForm2"
      :rules="rules2"
      label-width="120px"
      class="demo-ruleForm standard"
      size="default"
      status-icon
      >
      <el-form-item label="规格类型：" prop="standard_type">
        <el-radio-group v-model="ruleForm2.standard_type">
          <el-radio label="单规格" value="单规格" />
          <el-radio label="多规格" value="多规格" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品规格：" v-show="ruleForm2.standard_type==='多规格'" class="spec">
        <el-row class="specTips">最多添加3个商品规格组，生成的sku数量不能超出50个</el-row>
        <el-row v-for="item,index in multiSpec" :key="index" class="specTips">
      <div class="specGroup"><el-input v-model="item.key" class="specGroupInput"></el-input> <el-button @click="delSpec(index)" link type="primary">删除规格组</el-button></div>
        <div class="specVal">
          <el-input v-for="iitem,iindex in item.value" v-model="item.value[iindex]"></el-input>
          <el-button @click="addSpecValue(index)" link type="primary">新增规格值</el-button>
        </div>
      </el-row>
      <el-button v-show="ruleForm2.standard_type==='多规格'" @click="addSpecGroup()" >+添加规格组</el-button>
      </el-form-item>
      <el-form-item label="SkU列表" v-show="ruleForm2.standard_type==='多规格'">
        {{ skuTablelist }}
     <el-table :data="skuTablelist" width="500px" v-loading="isload" >
    <el-table-column v-for="(item,index) in multiSpec" :key="index" :label="item.key" style="padding:10px" >
      <template #default="scope">
        {{ scope.row.sku[index] }}
      </template>
    </el-table-column>
    <el-table-column label="预览图" prop="pic">
<template #default="scope">
  <el-upload
    class="avatar-uploader skuimg"
    method="post"
    name="img"
    action="http://api_devs.wanxikeji.cn/api/savePic"
    :show-file-list="true"
    :on-success="res=>{skuUpload(res,scope.$index)}"
    :before-upload="beforeAvatarUpload"
    :multiple="true"
    >
    <img v-if="scope.row.pic" :src="editgood===[]?scope.row.img:scope.row.pic" class="avatar" style="width:100px;height:100px">
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>
  </el-table-column>
  <el-table-column label="商品价格">
<template #default="scope">
  <el-input type="text" style="width:88px" :value="scope.row.price" @input="changePrice($event,scope.$index)" id="ipt"/>
</template>
  </el-table-column>
  <el-table-column label="划线价格">
  <input type="text" style="width:88px">
  </el-table-column>
  <el-table-column label="库存数量">
  <input type="text" style="width:88px">
  </el-table-column>
  <el-table-column label="商品重量">
  <input type="text" style="width:88px">
  </el-table-column>
  <el-table-column label="SKU编码">
  <input type="text" style="width:88px">
  </el-table-column>
     </el-table>
      </el-form-item>
      <el-form-item label="商品价格：" prop="shop_price" v-show="ruleForm2.standard_type==='单规格'">
        <el-input-number
    v-model="ruleForm2.shop_price"
    class="mx-4"
    :min="1"
    :max="10000"
    controls-position="right"
  />元
      </el-form-item>
      <el-form-item v-show="ruleForm2.standard_type==='单规格'">
      <div class="ant-from-extra">商品的实际购买金额，最低0.01</div>
    </el-form-item>
    <el-form-item label="划线价：" v-show="ruleForm2.standard_type==='单规格'" >
        <el-input-number
    v-model="ruleForm2.line_price"
    class="mx-4"
    :min="1"
    :max="10000"
    controls-position="right"
  />元
      </el-form-item>
      <el-form-item v-show="ruleForm2.standard_type==='单规格'">
      <div class="ant-from-extra">划线价仅用于商品页展示</div>
    </el-form-item>
    <el-form-item label="当前库存量：" prop="stock" v-show="ruleForm2.standard_type==='单规格'">
        <el-input-number
    v-model="ruleForm2.stock"
    class="mx-4"
    :min="1"
    :max="10000"
    controls-position="right"
  />
      </el-form-item>
      <el-form-item v-show="ruleForm2.standard_type==='单规格'">
      <div class="ant-from-extra">商品的实际库存量，为0时用户无法下单</div>
    </el-form-item>
    <el-form-item label="商品重量：" prop="weight" v-show="ruleForm2.standard_type==='单规格'">
        <el-input-number
    v-model="ruleForm2.weight"
    class="mx-4"
    :min="1"
    :max="10000"
    controls-position="right"
  />千克(kg)
      </el-form-item>
      <el-form-item label="库存计算方式：" prop="count">
        <el-radio-group v-model="ruleForm2.count">
          <el-radio label="下单减库存" />
          <el-radio label="付款减库存" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
      <div class="ant-from-extra">商品的实际重量，用于计算运费</div>
    </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          提交
        </el-button>
      </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="商品详情" name="third">
      <edit @richcons="richcon" :edittext="edittext"/>
    </el-tab-pane>
    <el-tab-pane label="更多设置" name="fourth">
      <el-form 
      ref="ruleFormRef"
      :model="ruleForm3"
      :rules="rules3"
      label-width="120px"
      class="demo-ruleForm more_config"
      size="default"
      status-icon
      >
      <el-form-item label="商品卖点：" class="shopStyle">
        <el-input v-model="ruleForm3.shop_hot" />
      </el-form-item>
      <el-form-item>
      <div class="ant-from-extra">一句话简述，例如：此商品美观大方 性价比高 不容错过</div>
    </el-form-item>
    <el-form-item label="服务与承诺：" >
        <el-select v-model="ruleForm3.server" multiple placeholder="请选择服务与承诺">
          <el-option label="七天无理由退货" value="七天无理由退货" />
          <el-option label="全场包邮" value="全场包邮" />
          <el-option label="48小时发货" value="48小时发货" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button link type="primary" size="small" >去新增</el-button>
        <el-button link type="primary" size="small" >刷新</el-button>
      </el-form-item>
      <el-form-item label="初始销量：" prop="ori_count">
        <el-input-number
    v-model="ruleForm3.ori_count"
    class="mx-4"
    :min="1"
    :max="10000"
    controls-position="right"
  />
      </el-form-item>
      <el-form-item>
      <div class="ant-from-extra">用户展示的销量=初始销量+实际销量</div>
    </el-form-item>
    <el-divider content-position="left"><span>积分设置</span></el-divider>
    <el-form-item label="积分赠送：" prop="given">
        <el-radio-group v-model="ruleForm3.given">
          <el-radio label="开启" />
          <el-radio label="关闭" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
      <div class="ant-from-extra">开启后用户购买此商品将获得积分</div>
    </el-form-item>
      <el-form-item label="积分折扣：" prop="discount">
        <el-radio-group v-model="ruleForm3.discount">
          <el-radio label="开启" />
          <el-radio label="关闭" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
      <div class="ant-from-extra">开启后用户购买此商品将获得积分进行抵扣</div>
    </el-form-item>
    <el-divider content-position="left"><span>会员折扣</span></el-divider>
    <el-form-item label="会员折扣：" prop="vip_discount">
        <el-radio-group v-model="ruleForm3.vip_discount">
          <el-radio label="开启" />
          <el-radio label="关闭" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
      <div class="ant-from-extra">开启会员折扣，会员购买此商品可以享受会员等级折扣</div>
    </el-form-item>
    <el-form-item label="会员折扣设置：" prop="vip_config">
        <el-radio-group v-model="ruleForm3.vip_config">
          <el-radio label="默认等级折扣" />
          <el-radio label="单独设置折扣" />
        </el-radio-group>
      </el-form-item>
      <el-form-item>
      <div class="ant-from-extra">默认折扣：默认为用户所属非会员等级的折扣率</div>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          提交
        </el-button>
      </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script  setup>
import {getCurrentInstance, ref,watchEffect} from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import edit  from '../Edit.vue'
const AccessToken=window.localStorage.getItem('token')
const activeName = ref('first')
  const {proxy} =getCurrentInstance()
  const formSize = ref('default')
  const ruleFormRef = ref()
  let imageUrl = ref('')
  let typelist=ref([])
let colour=ref([])
const value = ref()
let imgs=ref([])
let iimg=ref('')
let type_id=ref(0)
let type_parent_id=ref(0)
let info=ref('')
let price2=ref('')
let isload=ref(true)
let newgoodsinfo=ref([])
const newgood_id=proxy.$route.query.good_id
  //基本信息
  const ruleForm = ref({
    name: '',
    type:'',
    board: '请输入运费模板',
    coder:'',
    count: 100,
    resource: '上架',
    //此布尔值用来控制*是否显示
    delivery: false,
  })
  const ruleForm2 = ref({
    standard_type:'单规格',
    shop_price: 1.00,
    line_price:0.00,
    stock: 100,
    weight:0,
    count: '下单减库存',
    //此布尔值用来控制*是否显示
    delivery: false,
  })
  let price=ruleForm2.value.shop_price-0
  const ruleForm3 = ref({
    ori_count:0,
    server:[],
    given:'开启',
    discount:'开启',
    vip_discount:'开启',
    vip_config:'默认等级折扣'
  })
  const rules = ref({
    name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' },
      { min: 3, max: 1000, message: '长度最小为3', trigger: 'blur' },
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
  let rules3=ref({
    ori_count:[{
      required:true,
      trigger: 'change',
    }],
      given:[{
        required: true,
        trigger: 'change',
      }],
      discount:[{
        required: true,
        trigger: 'change',
      }],
      vip_config:[{
        required: true,
        trigger: 'change',
      }],
      vip_discount:[{
        required: true,
        trigger: 'change',
      }],
  })
  let rules2=ref({
      standard_type:[{
        required: true,
        trigger: 'change',
      }],
      shop_price:[{
        required: true,
        trigger: 'change',
      }],
      stock:[{
        required: true,
        trigger: 'change',
      }],
      weight:[{
        required: true,
        trigger: 'change',
      }],
      count:[{
        type:'String',
        required: true,
        trigger: 'change',
      }]
  })
function handleAvatarSuccess (response,uploadFile)  {
  imgs.value.push('http://api_devs.wanxikeji.cn/'+response.data)
  imageUrl.value='http://api_devs.wanxikeji.cn/'+response.data
  console.log(imgs.value)
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
let multiSpec=ref([
  ])
//添加规格值
function addSpecValue(index){
multiSpec.value[index].value.push("")
}
//添加规格组
function addSpecGroup(){
  multiSpec.value.push({
    key:'',
    value:['']
  })
}
//规格
function handleClick(tab, event){
 //console.log(tab, event)
}
function delSpec(index){
  //删除某项
multiSpec.value.splice(index,1)
}
let  skuTablelist=ref([])
//请求商品详情
let edittext=ref('')
let editedition=ref([])
let editgood=ref([])
proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/goodInfo',{token:AccessToken,good_id:newgood_id}).then(res=>{
const editgood=res.data.data
editgood.value=editgood
console.log(editgood.value)
  ruleForm.value.name=editgood.good_name
  ruleForm.value.type=editgood.good_type
  imageUrl.value=editgood.img
  ruleForm.value.coder=editgood.good_id
  ruleForm.value.resource=editgood.status===1?'上架':'下架'
  ruleForm.value.count=editgood.type_id
  ruleForm2.value.shop_price=Number(editgood.price)
  edittext.value=JSON.parse(editgood.info[0].info)
  imgs.value.push(editgood.value.img)
  if(JSON.parse(editgood.info[0].edition).sku_column){
    ruleForm2.value.standard_type='多规格'
    const list=JSON.parse(editgood.info[0].edition).sku_list
    const column=JSON.parse(editgood.info[0].edition).sku_column
   console.log(list)
   console.log(column)
   multiSpec.value=column
   setTimeout(()=>{
       console.log(skuTablelist.value)
       for(let i=0;i<list.length;i++){
    isload.value=false
    skuTablelist.value[i].price=list[i].price
    skuTablelist.value[i].pic=list[i].pic
  }
   },5000)

  }else{

  }
})
function changePrice(e,i){
  console.log(price2.value)
  console.log(e)
  console.log(i)
}
function clickTablist(){
  let skuArr=[]
  multiSpec.value.forEach((items,index)=>{
    if(index===0){
      skuArr=items.value
    }else{
      let arr=[]
      skuArr.forEach(list=>{
        items.value.forEach(obj=>{
          arr.push(list+'+'+obj)
        })
      })
      skuArr=arr
    }
  })
  let list =[]
  skuArr.forEach(child=>list.push({
    sku:child.split("+"),
    pic:'',
    price:''
  }))
  skuTablelist.value=list
}
watchEffect(clickTablist)
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
    function skuUpload(res,index){
    skuTablelist.value[index].pic='http://api_devs.wanxikeji.cn/'+res.data
    }
    function getCheck(obj){
      ruleForm.value.type=obj.good_type_id
      type_id.value=obj.good_type_id
      type_parent_id.value=obj.parent_id
    }
    function richcon(e){
     info.value=String(e)
    }
    function submitForm(){
      console.log(imgs.value)
      
const edition={}
edition.sku_column=multiSpec.value
edition.sku_list=skuTablelist.value
console.log(edition)
console.log(iimg.value.length)
proxy.$HelperAxios.post('http://api_devs.wanxikeji.cn/api/admin/addModifyGood',{
  token:AccessToken,
  good_name:ruleForm.value.name,
  type_id:Number(type_id.value),
  type_parent_id:Number(type_parent_id.value),
  price:Number(price),
  img:imgs.value[imgs.value.length-1],
  imgs:JSON.stringify(imgs.value),
  info:info.value,
  colour:colour.value,
  edition:edition,
  good_id:newgood_id
}).then(res=>{
  console.log(res)
  if(res.data.code===2000){
     proxy.$router.go(-1)
  }else{
    ElMessage({
    message: ''+res.data.msg,
    type: 'warning',
  })
  }
})
}
</script>
<style>
.basicInfo .demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.basicInfo .demo-tabs > .el-tabs__nav-scroll{
  border:solid 5px red;
}
.tab_title{
  margin-bottom:25px;
  font-size:16px;
  color:rgba(0, 0, 0, 0.75);
}
.basicInfo .avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.basicInfo .avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.basicInfo .el-input__inner{
  color:rgba(0, 0, 0, 0.45);
} 
.basicInfo .el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.basicInfo .shopStyle{
  width:513px;
}
.basicInfo .ant-from-extra{
  margin-bottom: 10px;
  margin-top:-30px;

}
.basicInfo .sortextra{
  padding-top:5px;
  font-weight: 500;
}
.basicInfo .avatar{
  width: 200px;
  height: 200px;
}
.basicInfo .el-icon.avatar-uploader-icon {
  width: 50px;
  height: 50px;
}
.standard .el-form-item{
margin-top:20px;
}
.standard .ant-from-extra{
  margin-top:-20px;
}
.standard .el-form-item__label{
  width: 130px;
}
.more_config .ant-from-extra{
  margin-top:-20px;
  margin-bottom: 10px;
}
.basicInfo .ant-from-extra,.more_config .ant-from-extra
.standard .ant-from-extra
{
  font-size:13px;
  color:rgba(0, 0, 0, 0.45);
  font-weight: 500;
}
.standard .el-input-number {
  margin-right:10px;
}
.more_config  .el-divider__text {
    font-size: 13px;
    color:rgba(0, 0, 0, 0.45);
}
.spec .el-input__inner{
    padding: 4px 11px;
    font-size: 13px;
    line-height: 1.5;
}
.specTips,.specGroup{
  width: 100%;
  /* height:30px; */
}
.spec .el-input{
  width:180px;
  height:28px;
}
.specGroupInput{
  background-color:#F4F5F9 ;
}
.specVal{
  background-color:#ffffff ;
}
.specVal .el-input{
  margin-right:10px;
}
</style>