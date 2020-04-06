<template>
  <div class="clearfix">
    <a-upload
      :action="BASE_URL + '/api/upload/business'"
      listType="picture-card"
      :defaultFileList="fileList"
      :headers="{ 'Access-Token': globalToken}"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 3">
        <a-icon type="plus" />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: [ String, Number ]
    },
    files: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      previewVisible: false,
      previewImage: ''
    }
  },
  computed: {
    fileList: {
      get () {
        const images = this.files.split(',')
        return images.filter(Boolean).map(img => ({
          uid: Math.random().toString(),
          name: img.match(/\/[^\/]+\.\w+$/g) && (img.match(/\/[^\/]+\.\w+$/g)[0].replace('/', '')),
          status: 'done',
          url: img
        }))
      },
      set (val) {
        return val
      }
    }
  },
  methods: {
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    async handleChange ({ fileList, file }) {
      if (file.status === 'done') {
        if (file.response) {
          const response = file.response
          if (response.code === 200) {
            this.fileList.push({
              name: file.name,
              status: 'done',
              uid: file.uid,
              url: file.response.result.url
            })
            this.$message.success(response.message)
          } else {
            this.$message.error(response.message)
          }
        }
        this.$emit('change', {
          fileList: this.fileList,
          file,
          list: this.fileList.map(e => ((e.response && e.response.result.url) || e.url))
        })
      }
      if (file.status === 'removed') {
        const index = this.fileList.findIndex(e => e.url === file.url)
        this.fileList.splice(index, 1)
        this.$emit('change', {
          fileList: this.fileList,
          file,
          list: this.fileList.map(e => e.url)
        })
      }
    },
    getFileList () {
      return this.fileList
    }
  }
}
</script>
<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
