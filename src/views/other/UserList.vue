<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-button type="primary" icon="plus" v-action:add>新建</a-button>
    </div>
    <a-divider />
    <s-table
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :lg="4" :md="24">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="role.actionEntitySet.length > 0">
              <a-tag color="cyan" v-for="(action, k) in role.actionEntitySet" :key="k">{{ action.describe }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="你确定删除吗?"
          @confirm="handleDelete"
          okText="确定"
          cancelText="取消"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </s-table>

    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名"
          hasFeedback
        >
          <a-input v-model="mdl.user_name" disabled="disabled"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          hasFeedback
        >
          <a-input-password v-model="mdl.user_password" disabled="disabled"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限"
          hasFeedback
        >
          <a-select
            v-model="mdl.role_id"
            style="width: 120px"
            @change="handleRoleChange"
            :defaultValue="mdl.role_id"
          >
            <a-select-option value="admin">admin</a-select-option>
            <a-select-option value="lucy">Lucy (101)</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="邮箱"
          hasFeedback
        >
          <a-input v-model="mdl.user_email"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号"
          hasFeedback
        >
          <a-input v-model="mdl.user_phone"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="头像"
          hasFeedback
        >
          <div class="clearfix">
            <a-upload
              :action="BASE_URL + '/upload'"
              listType="picture-card"
              :fileList="fileList"
              @preview="handleUploadPreview"
              @change="handleUploadChange"
              :remove="handleUploadRemove"
            >
              <div v-if="fileList.length === 0">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传头像</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleUploadCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-item>
        <a-divider />
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="拥有权限"
          hasFeedback
        >
          <a-row :gutter="16" v-for="(permission, index) in mdl.permissions" :key="index">
            <a-col :span="4" style="white-space: nowrap">
              {{ permission.permissionName }}：
            </a-col>
            <a-col :span="20">
              <a-tag :key="i" v-for="(tag, i) in permission.actionsOptions">{{ tag.label }}</a-tag>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getUserList, getRoleList } from '@/api/manage'

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      previewVisible: false,
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '用户名',
          dataIndex: 'user_name'
        },
        {
          title: '用户权限',
          dataIndex: 'role_id'
        },
        {
          title: '邮箱',
          dataIndex: 'user_email'
        },
        {
          title: '手机号',
          dataIndex: 'user_phone'
        },
        {
          title: '创建时间',
          dataIndex: 'user_createTime',
          sorter: true
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList()
          .then(res => {
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      pMap: {},
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ]
    }
  },
  created () {
  },
  methods: {
    async handleEdit (record) {
      const role_id = record.role_id
      if (this.pMap[role_id]) {
        this.mdl.permissions = this.pMap[role_id]
        this.visible = true
        return
      }
      this.mdl = Object.assign({}, record)
      const res = await getRoleList({ role_id })
      this.mdl.permissions = res.result.data[0].permissions
      this.pMap[role_id] = this.mdl.permissions
      this.mdl.permissions.forEach(permission => {
        permission.actionsOptions = permission.actionEntitySet.map(action => {
          return { label: action.describe, value: action.action, defaultCheck: !action.defaultCheck }
        })
      })
      this.visible = true
    },
    handleOk () {

    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleUploadCancel () {
      this.previewVisible = false
    },
    handleUploadPreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleUploadChange ({ fileList }) {
      this.fileList = fileList
    },
    handleUploadRemove (file) {
      console.log('handleUploadRemove', file)
      return true
    },
    handleRoleChange () {

    },
    handleDelete () {

    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
