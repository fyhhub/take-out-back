<template>
  <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <div slot="payStatus" slot-scope="record">
        {{ record.pay_status === 0 ? '未支付' : record.pay_status === 1 ? '已支付': '已退款' }}
      </div>
      <span slot="action" slot-scope="record">
        <a @click="handleShowDetail(record)">查看详情</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="你确定删除吗?"
          okText="确定"
          cancelText="取消"
          @confirm="handleDeleteClick(record)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </s-table>
  </a-card>
</template>
<script>
import { getOrderList, deleteOrder } from '@/api/order'
import { STable } from '@/components'
export default {
  name: 'OrderList',
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      currentComponet: 'List',
      record: '',
      list: [],
      columns: [
        {
          title: '唯一识别码',
          dataIndex: 'id'
        },
        {
          title: '配送地址',
          dataIndex: 'address'
        },
        {
          title: '客户名称',
          dataIndex: 'name'
        },
        {
          title: '客户手机号',
          dataIndex: 'phone'
        },

        {
          title: '金额',
          dataIndex: 'total'
        },
        {
          title: '支付状态',
          scopedSlots: { customRender: 'payStatus' }
        },
        {
          title: '操作',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const business_id = this.$store.getters.userInfo.business_id
        console.log(business_id)
        return getOrderList(business_id).then((res) => {
          if (res.code === 200) {
            this.$store.commit('SET_ORDER_LIST', res.result.data)
          }
          return res.result
        })
      },
      map: null
    }
  },
  methods: {
    handleShowDetail (record) {
      this.$router.push(`/order/advanced?id=${record.id}`)
    },
    async handleDeleteClick (record) {
      const res = await deleteOrder(record.id)
      if (res.code === 200) {
        this.$refs.table.refresh()
      }
    }
  },
}
</script>
