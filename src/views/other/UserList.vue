<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-button type="primary" icon="plus" v-action:add @click="handleAddClick">新建</a-button>
    </div>
    <a-divider />
    <s-table
      size="default"
      :columns="columns"
      :data="loadData"
      ref="table"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="你确定删除吗?"
          @confirm="handleDelete(record)"
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
          <a-input v-model="mdl.user_name"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          hasFeedback
        >
          <a-input-password v-model="mdl.user_password"/>
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
            <a-select-option value="business">business</a-select-option>
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
          <CUpload :files="mdl.user_avatar" @change="handleUploadChange"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import { STable } from '@/components'
import CUpload from '@/components/common/CUpload'
import { getUserList, getRoleList } from '@/api/manage'
import { deleteUser, update } from '@/api/user'
export default {
  name: 'TableList',
  components: {
    STable,
    CUpload
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      previewVisible: false,
      visible: false,
      defaultOptions: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      mdl: {
        user_avatar: ''
      },

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
            res.result.data = res.result.data.filter(e => e.role_id === 'admin')
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
      ],
      formSatus: false
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
      this.mdl.permissions = res.result.data.find(e => e.id === role_id).permissions
      this.pMap[role_id] = this.mdl.permissions
      this.mdl.permissions.forEach(permission => {
        this.defaultOptions = permission.actionEntitySet.map(action => {
          return { label: action.describe, value: action.action }
        })
        permission.actionsOptions = this.defaultOptions.map(e => e.value)
      })
      this.visible = true
      this.formSatus = false
    },
    async handleOk () {
      if (this.formSatus) {

        return
      }
      const res = await update(this.mdl)
      if (res.code === 200) {
        this.$refs.table.refresh()
        this.visible = false
      }
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
    handleUploadRemove (file) {
      return true
    },
    handleRoleChange () {
    },
    async handleDelete (record) {
      const res = await deleteUser(record.user_id, record.business_id)
      if (res.code === 200) {
        this.$refs.table.refresh()
      }
    },
    handleSelectChange (values) {
      console.log('values: ', values)
    },
    handleUploadChange ({ list }) {
      this.mdl.user_avatar = list.join(',')
    },
    handleAddClick () {
      this.mdl = {}
      this.visible = true
      this.formSatus = true
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
