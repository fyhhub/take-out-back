<template>
  <a-modal
    :confirmLoading="confirmLoading"
    :width="640"
    :visible="visible"
    title="商品添加"
    @ok="handleSubmit"
    @cancel="visible = false"
  >
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="商品名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['goods_name', {rules:[{required: true, message: '请输入商品名称'}]}]" placeholder="输入商品名称"/>
      </a-form-item>
      <a-form-item
        label="商品价格"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input-number
          :min="0"
          v-decorator="['goods_price', { rules:[{required: true, message: '请输入商品价格及折扣'}], initialValue: 0 }]"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
        />
        <a-divider type="vertical" />
        <a-input-number
          :min="1"
          :max="10"
          v-decorator="['goods_discount', {rules:[{required: true, message: '请输入商品折扣'}], initialValue: 10}]"
          :formatter="value => `${value}`"
          :parser="value => value.replace('%', '')"
        />
        &nbsp;&nbsp;折
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <span slot="label">
          商品详情&nbsp;
          <a-tooltip title="输入商品详情并回车（例：香辣鸡腿堡*3），可添加多个">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-select
          mode="tags"
          style="width: 100%"
          :tokenSeparators="[',']"
          v-decorator="['goods_detail', {rules:[{required: true, message: '请输入商品详情'}]}]"
          placeholder="输入商品详情"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="商品分类"
        :required="true"
      >
        <a-select
          mode="tags"
          placeholder="输入商品分类"
          style="width: 200px"
          v-decorator="['goods_type', {initialValue: [], rules:[{required: true, message: '请输入商品分类'}]}]"
        >
          <a-select-option v-for="i in typesOptions" :key="i">
            {{ i }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="商品图片"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :required="true"
      >
        <CUpload @change="handleUploadChange"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import CUpload from '@/components/common/CUpload'
import { createGoods } from '@/api/goods'
import { userMixin } from '@/utils/mixin'
export default {
  name: 'TaskForm',
  components: {
    CUpload
  },
  mixins: [ userMixin ],
  props: {
    types: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      form: this.$form.createForm(this),
      fileList: [],
      confirmLoading: false
    }
  },
  methods: {
    add () {
      this.visible = true
    },
    edit (record) {
      const { form: { setFieldsValue } } = this
      this.visible = true
      this.$nextTick(() => {
        setFieldsValue({ taskName: 'test' })
      })
    },
    handleSubmit (e) {
      const { form: { validateFields } } = this
      this.visible = true
      e.preventDefault()
      validateFields(async (errors, values) => {
        if (!errors) {
          const files = this.fileList.join(',') + ','
          Object.assign(values, {
            business_id: this.$store.state.user.info.business_id,
            goods_image: files === ',' ? '' : files,
            goods_detail: values.goods_detail.join('+'),
            goods_type: values.goods_type.join(',')
          })
          try {
            this.confirmLoading = true
            const res = await createGoods(values)
            if (res.code === 200) {
              this.confirmLoading = false
              this.visible = false
              this.$emit('getList')
              this.form.resetFields()
            }
          } catch (e) {
            console.log(e)
            this.confirmLoading = false
          }
        }
      })
    },
    handleUploadChange ({ fileList, file, list }) {
      this.fileList = list
    }
  }
}
</script>
