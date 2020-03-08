<template>
  <a-form :form="form" @submit="handleSubmit" v-if="formData">
    <a-form-item v-bind="formItemLayout" label="商家名称">
      <a-input
        v-decorator="[
          'business_name',
          {
            initialValue: formData.business_name,
            rules: [
              {
                required: true,
                message: '请输入商家名称'
              }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="商家手机号">
      <a-input
        v-decorator="[
          'business_phone',
          {
            initialValue: formData.business_phone,
            rules: [
              {
                required: true,
                message: '请输入商家手机号'
              }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="商家新密码">
      <a-input-password
        placeholder="新密码"
        v-decorator="[
          'business_password',
          {
            initialValue: '',
            rules: [
              {
                min: 5,
                message: '长度必须大于4位'
              }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayout" label="商家图片" :required="true">
      <CUpload ref="upload" :files="formData.business_image" @change="handleFilesChange" :id="formData.business_id"/>
    </a-form-item>
    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="primary" html-type="submit" style="display: none;" @click="handleSaveClick"></a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import CUpload from '@/components/common/CUpload'
import { updateBusiness } from '@/api/business'
import md5 from 'md5'
export default {
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  components: {
    CUpload
  },
  data () {
    return {
      confirmDirty: false,
      autoCompleteResult: [],
      previewImage: '',
      previewVisible: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      },
      formData: null
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'update' })
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll(async (err, values) => {
        if (err == null) {
          try {
            if (values.business_password) {
              values.business_password = md5(values.business_password)
            }
            const res = await updateBusiness(Object.assign(this.formData, values))
            if (res.code === 200) {
              this.formData = Object.assign(this.formData, values)
            }
          } catch (e) {
          }
        }
      })
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    watchRecord (newVal) {
      this.formData = newVal
    },
    handleSaveClick (e) {
      this.handleSubmit(e)
    },
    handleFilesChange ({ file }) {
      if (file.status === 'done') {
        const { code, result } = file.response
        if (code === 200) {
          const url = result.url
          this.formData.business_image = this.formData.business_image + url + ','
        }
      }
      if (file.status === 'removed') {
        this.formData.business_image = this.formData.business_image.replace(file.url + ',', '')
      }
    }
  },
  computed: {
    fileList () {
      return []
    }
  },
  watch: {
    record: {
      immediate: true,
      deep: true,
      handler: 'watchRecord'
    }
  }
}
</script>
