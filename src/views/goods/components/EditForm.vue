<template>
  <a-form :form="form" v-bind="formItemLayout">
    <a-form-item label="商品名称">
      <a-input v-decorator="['goods_name', {initialValue: initField.goods_name, rules:[{required: true, message: '请输入商品名称'}]}]" placeholder="输入商品名称"/>
    </a-form-item>
    <a-form-item label="商品价格">
      <a-input-number
        :min="0"
        v-decorator="['goods_price', { initialValue: initField.goods_price, rules:[{required: true, message: '请输入商品价格及折扣'}], initialValue: 0 }]"
        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
      />
      <a-divider type="vertical" />
      <a-input-number
        :min="1"
        :max="10"
        v-decorator="['goods_discount', {initialValue: initField.goods_discount, rules:[{required: true, message: '请输入商品折扣'}], initialValue: 10}]"
        :formatter="value => `${value}`"
        :parser="value => value.replace('%', '')"
      />
      &nbsp;&nbsp;折
    </a-form-item>
    <a-form-item>
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
        v-decorator="['goods_detail', {initialValue: initField.goods_detail, rules:[{required: true, message: '请输入商品详情'}]}]"
        placeholder="输入商品详情"
      >
      </a-select>
    </a-form-item>
    <a-form-item label="商品分类" :required="true">
      <a-select
        mode="tags"
        placeholder="输入商品分类"
        style="width: 100%"
        v-decorator="['goods_type', {initialValue: goods_type, rules:[{required: true, message: '请输入商品分类'}]}]"
      >
        <a-select-option v-for="i in typesOptions" :key="i">
          {{ i }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="商品图片" :required="true">
      <CUpload :files="initField.goods_image" @change="handleUploadChange" ref="upload"/>
    </a-form-item>
  </a-form>
</template>
<script>
import CUpload from '@/components/common/CUpload'
import { userMixin } from '@/utils/mixin'
export default {
  components: {
    CUpload
  },
  mixins: [ userMixin ],
  props: {
    types: {
      type: Array,
      default: () => []
    },
    initField: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      form: this.$form.createForm(this),
      fileList: this.initField.goods_image.split(',').filter(Boolean)
    }
  },
  computed: {
    goods_type () {
      return this.initField.goods_type.split(',')
    }
  },
  methods: {
    handleUploadChange ({ fileList, file, list }) {
      this.fileList = list
    }
  }
}
</script>
