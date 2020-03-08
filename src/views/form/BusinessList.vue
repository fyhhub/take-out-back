<template>
  <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <div slot="businessLoc" slot-scope="record">
        {{ record.business_address.replace('/', ' ') }}
      </div>
      <span slot="action" slot-scope="record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="你确定删除吗?"
          okText="确定"
          cancelText="取消"
          @confirm="handleRemoveBusiness(record)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </span>
    </s-table>
    <a-drawer
      title="编辑"
      :width="720"
      :maskClosable="true"
      :visible="visible"
      :destroyOnClose="true"
      @close="visible = false"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <BusinessListForm ref="listForm" :record="record"/>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button :style="{marginRight: '8px'}" @click="visible = false">
          取消
        </a-button>
        <a-button @click="handleSaveClick" type="primary">保存</a-button>
      </div>
    </a-drawer>

  </a-card>
</template>
<script>
// 动态切换组件
import { getBusinessList, deleteBusiness } from '@/api/business'
import { STable } from '@/components'
import BusinessListForm from './BusinessListForm'
export default {
  name: 'TableListWrapper',
  components: {
    STable,
    BusinessListForm
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
          dataIndex: 'business_id'
        },
        {
          title: '商家名称',
          dataIndex: 'business_name'
        },
        {
          title: '商家账号',
          dataIndex: 'business_account'
        },
        {
          title: '商家手机号',
          dataIndex: 'business_phone'
        },
        {
          title: '商家地址',
          scopedSlots: { customRender: 'businessLoc' }
        },
        {
          title: '营业时间',
          dataIndex: 'business_servetime'
        },
        {
          title: '操作',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const that = this
        return getBusinessList({ limit: 10, offset: 0 }).then(res => {
          that.list = res.result
          return res.result
        })
      },
      map: null
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.map = new BMap.Map('business_allmap')
    //   this.map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 11)
    //   this.map.enableScrollWheelZoom(true)
    // })
  },
  activated () {
    this.$refs.table.refresh(true)
  },
  methods: {
    handleLocClick (record) {
      // this.map.clearOverlays()
      // const newPoint = new BMap.Point(record.business_longitude, record.business_latitude)
      // const marker = new BMap.Marker(newPoint)
      // this.map.addOverlay(marker)
      // this.map.panTo(newPoint)
    },
    getContainer () {
      return document.getElementById('business_allmap')
    },
    handleEdit (record) {
      this.record = record
      this.visible = true
    },
    handleSaveClick (e) {
      this.$refs.listForm.handleSaveClick(e)
    },
    async handleRemoveBusiness ({ business_id, business_account }) {
      const res = await deleteBusiness({
        business_id,
        business_account
      })
      if (res.code === 200) {
        const index = this.list.data.findIndex(e => e.business_id === business_id)
        this.list.data.splice(index, 1)
      }
    }
  },
  filters: {
    businessKey (val) {
      const map = {
        'business_id': 'id',
        'business_grade': '商家评分',
        'business_name': '商家名称',
        'business_sale': '商家销量',
        'business_address': '商家地址',
        'business_phone': '商家号码',
        'business_servetime': '营业时间',
        'business_longitude': '经度',
        'business_latitude': '纬度',
        'business_image': '商家图片',
        'category_id': '商家分类'
      }
      return map[val]
    }
  }
}
</script>
