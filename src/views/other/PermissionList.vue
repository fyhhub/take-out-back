<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAddClick">新建</a-button>
    </div>
    <s-table :columns="columns" :data="loadData" ref="table">
      <span slot="actions" slot-scope="text, record">
        <a-tag v-for="(action, index) in record.actionList" :key="index">{{ action.describe }}</a-tag>
      </span>
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
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="唯一识别码"
          hasFeedback
        >
          <a-input placeholder="唯一识别码" v-model="mdl.id" id="no"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限名称"
          hasFeedback
        >
          <a-input placeholder="起一个名字" v-model="mdl.name" id="permission_name" />
        </a-form-item>
        <a-divider />
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="赋予权限"
          hasFeedback
        >
          <a-select
            style="width: 100%"
            mode="multiple"
            v-model="mdl.actions"
            @change="handleSelectChange"
            :allowClear="true"
          >
            <a-select-option v-for="(action, index) in permissionList" :key="index" :value="action.action">{{ action.describe }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

      <template slot="footer">
        <a-button key="back" @click="visible = false">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
      </template>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { axios } from '@/utils/request'
import { deletePermission } from '@/api/permissions'
export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      description: '角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      loading: false,
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
          title: '唯一识别码',
          dataIndex: 'id'
        },
        {
          title: '权限名称',
          dataIndex: 'name'
        },
        {
          title: '可操作权限',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 向后端拉取可以用的操作列表
      permissionList: [
        { describe: '新增', action: 'add', defaultChecked: false },
        { describe: '修改', action: 'update', defaultChecked: false },
        { describe: '列表', action: 'query', defaultChecked: false },
        { describe: '删除', action: 'delete', defaultChecked: false },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http.get(`/api/user/permissions?role_id=admin`).then(res => {
          const result = res.result
          result.data.map(permission => {
            permission.actionList = JSON.parse(permission.actionData)
            return permission
          })
          return result
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        1: '正常',
        2: '禁用'
      }
      return statusMap[status]
    }
  },
  methods: {
    handleEdit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    async handleOk () {
      this.loading = true
      try {
        await axios({
          url: '/api/user/permissions/update',
          method: 'put',
          data: this.mdl
        })
        this.loading = false
        this.visible = false
        this.$refs.table.refresh()
      } catch (e) {
        this.loading = false
      }
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleSelectChange (value, option) {
      const map = {
        'add': '新增',
        'import': '导入',
        'get': '详情',
        'update': '修改',
        'delete': '删除',
        'export': '导出',
        'query': '查询'
      }
      this.mdl.actions = value
      this.mdl.actionList = value.map(e => {
        return {
          action: e,
          defaultCheck: false,
          describe: map[e]
        }
      })
      this.mdl.actionEntitySet = this.mdl.actionList
      this.mdl.actionData = JSON.stringify(this.mdl.actionList)
    },
    async handleDelete (record) {
      const res = await deletePermission(record.id)
      if (res.code === 200) {
        this.$refs.table.refresh()
      }
    },
    handleAddClick () {
      this.visible = true
      this.mdl = {}
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
