<template>
  <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <div slot="username" slot-scope="record">
        {{ users[record.openid] }}
      </div>
      <div slot="time" slot-scope="record">
        {{ record.evaluate_time | formatDate }}
      </div>
      <span slot="action" slot-scope="record">
        <a @click="handleReply(record)">回复</a>
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
    <a-modal title="回复" v-model="visible" @ok="handleReplyClick">
      <a-textarea placeholder="请输入回复信息" autoSize v-model="reply"/>
    </a-modal>
  </a-card>
</template>
<script>
import { getAssessList, replyAssess, deleteAssess } from '@/api/assess'
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
      reply: '',
      columns: [
        {
          title: '唯一识别码',
          dataIndex: 'evaluate_id'
        },
        {
          title: '顾客昵称',
          scopedSlots: { customRender: 'username' }
        },
        {
          title: '评论内容',
          dataIndex: 'evaluate_content'
        },
        {
          title: '评论时间',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '评分',
          dataIndex: 'evaluate_score'
        },

        {
          title: '操作',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      users: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const business_id = this.$store.getters.userInfo.business_id
        return getAssessList(business_id).then((res) => {
          if (res.code === 200) {
            // this.$store.commit('SET_ORDER_LIST', res.result.data)
            const data = res.result.list.filter(item => !item.parent_id)
            this.users = res.result.users.reduce((obj, item) => (obj[item.openid] = item.nickName, obj), {})
            return {
              data,
              pageSize: 10,
              pageNo: 0,
              totalPage: Math.ceil(data.length / 10),
              totalCount: data.length
            }
          } else {
            return []
          }
        })
      },
      map: null,
    }
  },
  methods: {
    handleReply (record) {
      this.visible = true
      this.record = record
    },
    async handleDeleteClick (record) {
      const res = await deleteAssess(record.evaluate_id)
      if (res.code === 200) {
        this.$refs.table.refresh()
      }
    },
    async handleReplyClick () {
      const evaluate_id = this.record.evaluate_id
      delete this.record.evaluate_id
      const res = await replyAssess({
        ...this.record,
        evaluate_content: this.reply,
        evaluate_time: Date.now() + '',
        evaluate_score: 5,
        parent_id: evaluate_id
      })
      if (res.code === 200) {
        this.visible = false
      }
    }
  },
  filters: {
    formatDate (now) {
      now = parseInt(now)
      now = new Date(now)
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const date = now.getDate()
      return year + '-' + month + '-' + date
    }
  }
}
</script>
