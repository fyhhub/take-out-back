
<template>
  <page-view :title="`单号：${order.id}`" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">

    <detail-list slot="headerContent" size="small" :col="2" class="detail-layout">
      <detail-list-item term="创建人">{{ order.name }}</detail-list-item>
      <detail-list-item term="创建时间">{{ order.time | formatDate }}</detail-list-item>
      <detail-list-item term="备注">请于两个工作日内确认</detail-list-item>
    </detail-list>
    <a-row slot="extra" class="status-list">
      <a-col :xs="12" :sm="12">
        <div class="text">状态</div>
        <div class="heading">{{ order.pay_status === 0 ? '未支付': order.pay_status === 1 ? '已支付' : '已退款' }}</div>
      </a-col>
      <a-col :xs="12" :sm="12">
        <div class="text">订单金额</div>
        <div class="heading">¥ {{ order.total }}</div>
      </a-col>
    </a-row>
    <!-- actions -->
    <template slot="action">
      <a-button type="danger" @click="handleDeleteOrder">删除订单</a-button>
    </template>

    <a-card :bordered="false" title="流程进度">
      <a-steps :current="order.pay_status">
        <a-step title="未支付" description="未支付状态" />
        <a-step title="已支付" description="已支付状态" />
      </a-steps>
    </a-card>

    <a-card style="margin-top: 24px" :bordered="false" title="商家信息">
      <detail-list>
        <detail-list-item term="商家头像"><a-avatar size="default" icon="user" :src="processImage(business, 'business_image')"/></detail-list-item>
        <detail-list-item term="商家名称">付晓晓</detail-list-item>
        <detail-list-item term="商家手机号">18112345678</detail-list-item>
        <detail-list-item term="商家地址">浙江省杭州市西湖区黄姑山路工专路交叉路口</detail-list-item>
        <detail-list-item term="商家账号">18112345678</detail-list-item>
      </detail-list>
      <a-card type="inner" title="订单商品信息">
        <a-list itemLayout="horizontal" :dataSource="goodsList">

          <a-list-item slot="renderItem" slot-scope="item">
            <a slot="actions">x{{ idsMap[item.goods_id] }}</a>
            <a-list-item-meta
              :description="item.goods_detail"
            >
              <a slot="title" href="https://www.antdv.com/">{{item.goods_name}}</a>
              <a-avatar
                slot="avatar"
                :src="processImage(item, 'goods_image')"
              />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-card>
    </a-card>
  </page-view>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { PageView } from '@/layouts'
import DetailList from '@/components/tools/DetailList'
import { deleteOrder } from '@/api/order'
import { getOneBusiness } from '@/api/business'
import { getSomeGoods } from '@/api/goods'
const DetailListItem = DetailList.Item

export default {
  name: 'Advanced',
  components: {
    PageView,
    DetailList,
    DetailListItem
  },
  mixins: [mixinDevice],
  data () {
    return {
      business: {},
      order: {},
      goodsList: [],
      idsMap: {},
      tabList: [
        {
          key: '1',
          tab: '操作日志一'
        },
        {
          key: '2',
          tab: '操作日志二'
        },
        {
          key: '3',
          tab: '操作日志三'
        }
      ],
      activeTabKey: '1',

      operationColumns: [
        {
          title: '操作类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '操作人',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '执行结果',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作时间',
          dataIndex: 'updatedAt',
          key: 'updatedAt'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        }
      ],
      operation1: [
        {
          key: 'op1',
          type: '订购关系生效',
          name: '曲丽丽',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        },
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因'
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        },
        {
          key: 'op4',
          type: '提交订单',
          name: '林东东',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '很棒'
        },
        {
          key: 'op5',
          type: '创建订单',
          name: '汗牙牙',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        }
      ],
      operation2: [
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因'
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        },
        {
          key: 'op4',
          type: '提交订单',
          name: '林东东',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '很棒'
        }
      ],
      operation3: [
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因'
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        }
      ]
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'agree': '成功',
        'reject': '驳回'
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        'agree': 'success',
        'reject': 'error'
      }
      return statusTypeMap[type]
    },
    formatDate (now) {
      now = parseInt(now)
      now = new Date(now)
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const date = now.getDate()
      return year + '-' + month + '-' + date
    }
  },
  activated () {
    const id = this.$route.query.id
    if (id) {
      const order = this.$store.state.order_list[id]
      if (!order) {
        this.$router.push('/order/basic')
      } else {
        const idsMap = order.goods_list.split(',').reduce((obj, item) => (obj[item.split('=')[0]] = item.split('=')[1], obj), {})
        this.idsMap = idsMap
        Promise.all(
          [getOneBusiness(order.business_id), getSomeGoods({ ids: Object.keys(idsMap) })]
        ).then(res => {
          if (res.every(e => e.code === 200)) {
            this.business = res[0].result
            this.goodsList = res[1].result
          }
        })
      }
      this.order = order
    }
  },
  methods: {
    handleDeleteOrder () {
      this.$confirm({
        title: '确认删除？',
        onOk: async () => {
          if (this.order) {
            const res = await deleteOrder(this.order.id)
            if (res.code === 200) {
              this.$router.push('/order/basic?key=1')
            }
          }
        }
      })
    },
    processImage (obj, key) {
      return obj && obj[key] && obj[key].slice(0, obj[key].indexOf(','))
    }
  },
}
</script>

<style lang="less" scoped>

  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .text {

    }
    .status-list {
      text-align: left;
    }
  }
</style>
