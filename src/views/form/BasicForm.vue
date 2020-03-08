<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="商家名称"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :required="true"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-model="fields.business_name"
          placeholder="填写商家名称" />
      </a-form-item>
      <a-form-item
        label="商家账号"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :required="true"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-model="fields.business_account"
          placeholder="填写商家账号" />
      </a-form-item>
      <a-form-item
        label="商家密码"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :required="true"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input-password
          v-model="fields.business_password"
          placeholder="填写商家密码" />
      </a-form-item>
      <a-form-item
        label="商家电话"
        :required="true"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          placeholder="填写商家电话"
          v-model="fields.business_phone"
        />
      </a-form-item>
      <a-form-item
        label="商家地址"
        :required="true"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <div id="grid"></div>
        <div id="r-result">
          <input
            type="text"
            id="suggestId"
            size="20"
            style="width: 100%;"
            class="ant-input"
            placeholder="填写商家地址"
            name="business_address"
            ref="address"
          />
        </div>
        <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto;display:none;"></div>
      </a-form-item>
      <a-form-item
        label="详细地址"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-textarea placeholder="填写详细地址" name="detail" :rows="4" ref="textarea"/>
      </a-form-item>
      <a-form-item
        label="商家介绍"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :required="true"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
      >
        <a-textarea v-model="fields.business_introduce" placeholder="填写商家介绍" :rows="4"/>
      </a-form-item>
      <a-form-item
        label="营业时间"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :required="true"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-time-picker
          addon="营业开始时间"
          v-model="startTime"
          @change="handleStartTimeChange"
        />
        <a-divider type="vertical" />
        <a-time-picker
          addon="营业结束时间"
          v-model="endTime"
          @change="handleEndTimeChange"
        />
      </a-form-item>
      <a-form-item
        label="商家分类"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="true"
      >
        <a-select :value="fields.category_id" style="width: 120px" @change="handleSelectChange" placeholder="选择商家分类">
          <a-select-option :value="item.category_id" v-for="item in category" :key="item.category_id">{{ item.category_name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="起送费"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :required="true"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input-number
          :min="0"
          v-model="fields.business_sd"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
        />
        ¥
      </a-form-item>
      <a-form-item
        label="配送费"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :required="true"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input-number
          :min="0"
          v-model="fields.business_df"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
        />
        ¥
      </a-form-item>
      <a-form-item
        label="上传商家图片"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="true"
      >
        <a-upload
          :action="BASE_URL + '/api/upload/business'"
          listType="picture-card"
          :fileList="fileList"
          @preview="handleImagePreview"
          :headers="{ 'Access-Token': token}"
          @change="handleFileListChange"
        >
          <div v-if="fileList.length <= 2">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleImageCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary" :loading="saveLoading">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { getCategory, createBusiness } from '@/api/business'
import { deleteImage } from '@/api/upload'
import md5 from 'md5'
import Vue from 'vue'
export default {
  name: 'BaseForm',
  data () {
    return {
      description: '商家信息收集',
      value: 1,
      // form
      form: this.$form.createForm(this),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      category: [],
      token: Vue.ls.get('Access-Token'),
      saveLoading: false,
      fields: {
        category_id: '',
        business_account: '',
        business_password: ''
      },
      startTime: null,
      endTime: null
    }
  },
  methods: {
    // handler
    handleSubmit (e) {
      e.preventDefault()
      const suggestId = document.querySelector('#suggestId')
      const address = suggestId.value
      const textarea = this.$refs.textarea.$el.value
      this.fields.business_address = address + '/' + textarea
      this.fields.business_servetime = this.fields.startTime + '~' + this.fields.endTime
      this.fields.category_id || (this.fields.category_id = '')
      this.fields.business_image || (this.fields.business_image = '')
      for (const key in this.fields) {
        if (!this.fields[key] || this.fields[key].length === 1) {
          this.$message.warn('请完整填写表单')
          return
        }
      }
      const myGeo = new BMap.Geocoder()
      myGeo.getPoint(this.fields.business_address.replace('/', ' '), async point => {
        if (!point) {
          this.$message.warning('该地址无法正常解析')
          return
        }
        this.fields.business_latitude = point.lat
        this.fields.business_longitude = point.lng
        this.fields.business_password = md5(this.fields.business_password)
        this.saveLoading = true
        delete this.fields.endTime
        delete this.fields.startTime
        try {
          await createBusiness(this.fields)
          this.saveLoading = false
          this.form.resetFields()
          suggestId.value = ''
          this.$refs.textarea.$el.value = ''
          this.fileList = []
          this.fields = {
            category_id: '',
            business_account: '',
            business_password: ''
          }
          this.startTime = null
          this.endTime = null
        } catch (e) {
          this.saveLoading = false
        }
      })
    },
    handleImageCancel () {
      this.previewVisible = false
    },
    handleImagePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    async handleFileListChange ({ fileList, file }) {
      if (file.status === 'removed') {
        try {
          const res = await deleteImage({
            filename: file.name
          })
          if (res.code === 200) {
            this.fileList = this.fileList.filter(e => e.uid !== file.uid)
          }
        } catch (e) {
          console.log(e)
        }
        return
      }
      if (file.status === 'done') {
        const response = file.response
        if (file.response && response.code === 200) {
          this.$message.success(response.message)
          this.fields.business_image = this.fields.business_image || ''
          this.fields.business_image += (response.result.url + ',')
        } else if (file.response && response.code !== 200) {
          this.$message.error(response.message)
        }
      }
      this.fileList = fileList
    },
    initMap () {
      function G (id) {
        return document.getElementById(id)
      }
      const map = new BMap.Map('grid')
      map.centerAndZoom('北京', 12)
      const ac = new BMap.Autocomplete({ 'input': 'suggestId', 'location': map })
      ac.addEventListener('onhighlight', function (e) {
        let str = ''
        let _value = e.fromitem.value
        let value = ''
        if (e.fromitem.index > -1) {
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value
        value = ''
        if (e.toitem.index > -1) {
          _value = e.toitem.value
          value = _value.province + _value.city + _value.district + _value.street + _value.business
        }
        str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
        G('searchResultPanel').innerHTML = str
      })

      let myValue
      ac.addEventListener('onconfirm', function (e) {
        const _value = e.item.value
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business
        G('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue
        setPlace()
      })

      function setPlace () {
        map.clearOverlays()
        function myFun () {
          const pp = local.getResults().getPoi(0).point
          map.centerAndZoom(pp, 18)
          map.addOverlay(new BMap.Marker(pp))
        }
        const local = new BMap.LocalSearch(map, {
          onSearchComplete: myFun
        })
        local.search(myValue)
      }
    },
    async initCategory () {
      try {
        const res = await getCategory()
        this.category = res.result
      } catch (e) {
        this.category = []
      }
    },
    handleSelectChange (value) {
      this.fields.category_id = value
    },
    handleStartTimeChange (time, timeString) {
      this.fields.startTime = timeString
    },
    handleEndTimeChange (time, timeString) {
      this.fields.endTime = timeString
    }
  },
  mounted () {
    this.initMap()
    this.initCategory()
  },
  activated () {
  }
}
</script>
