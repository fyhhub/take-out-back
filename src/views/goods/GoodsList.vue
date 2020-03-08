<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <head-info title="总销量" content="10" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="周销量" content="32分钟" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="月销量" content="24个"/>
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="商品列表">
      <div slot="extra">
        <a-radio-group v-model="status">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="processing">进行中</a-radio-button>
          <a-radio-button value="waiting">等待中</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>
      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="$refs.taskForm.add()">添加商品</a-button>
      </div>
      <a-list size="large" :dataSource="list" :pagination="pagination">
        <a-list-item slot="renderItem" slot-scope="item, index" key="item.goods_id">
          <a-list-item-meta :description="item.goods_detail">
            <a-avatar slot="avatar" size="large" shape="square" :src="processImage(item.goods_image)"/>
            <a slot="title">{{ item.goods_name }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="handleEditClick(item)">编辑</a>
          </div>
          <div slot="actions">
            <a-popconfirm
              title="确定删除？"
              @confirm="confirmDelete(item, index)"
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </a-popconfirm>
          </div>
          <div class="list-content" style="width: 400px">
            <div class="list-content-item">
              <Statistic title="销量" :value="item.goods_sale" />
            </div>
            <div class="list-content-item">
              <Statistic title="价格" :precision="2" :value="item.goods_price">
                <template v-slot:suffix>
                  <span> / {{ item.goods_discount }}折</span>
                </template>
              </Statistic>
            </div>
            <div class="list-content-item">
            </div>
          </div>
        </a-list-item>
      </a-list>
      <task-form ref="taskForm" @getList="getList" :types="types"/>
      <a-drawer
        title="编辑"
        :width="720"
        :maskClosable="true"
        :visible="visible"
        :destroyOnClose="true"
        @close="visible = false"
        :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
      >
        <EditForm ref="editForm" :types="types" :initField="current"/>
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
          <a-button type="primary" @click="handleSaveClick" :loading="editLoading">保存</a-button>
        </div>
      </a-drawer>
    </a-card>
  </div>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'
import TaskForm from './components/TaskForm'
import { getGoodsList, deleteGoods, updateGoods } from '@/api/goods'
import { Statistic } from 'ant-design-vue'
import { userMixin } from '@/utils/mixin'
import EditForm from './components/EditForm'
export default {
  name: 'GoodsList',
  mixins: [userMixin],
  components: {
    HeadInfo,
    TaskForm,
    Statistic,
    EditForm
  },
  mounted () {
    this.getList()
  },
  data () {
    return {
      list: [],
      status: 'all',
      types: [],
      visible: false,
      current: null,
      editLoading: false
    }
  },
  computed: {
    pagination () {
      return {
        pageSize: 5,
        total: this.list.length
      }
    }
  },
  methods: {
    async getList () {
      try {
        const res = await getGoodsList({
          business_id: this.$store.state.user.info.business_id
        })
        if (res.code === 200) {
          this.list = res.result
          this.types = this.list.map(e => e.goods_type)
        }
      } catch (e) {
      }
    },
    async confirmDelete ({ business_id, goods_id }, index) {
      const res = await deleteGoods({ business_id, goods_id })
      if (res.code === 200) {
        this.list.splice(index, 1)
      }
    },
    handleSaveClick () {
      this.$refs.editForm.form.validateFields(async (err, values) => {
        if (!err) {
          Object.assign(values, {
            goods_image: this.$refs.editForm.fileList.join(',') + ',',
            goods_type: values.goods_type.join('+'),
            goods_id: this.current.goods_id
          })
          this.editLoading = true
          try {
            const res = await updateGoods(values)
            if (res.code === 200) {
              this.editLoading = false
              Object.assign(this.current, values)
              console.log(this.current)
              const index = this.list.findIndex(e => e.goods_id === this.current.goods_id)
              this.list.splice(index, 1, this.current)
            }
          } catch (e) {
            console.log(e)
            this.editLoading = false
          }
        }
      })
    },
    handleEditClick (item) {
      this.current = item
      this.visible = true
    }
  }
}
</script>

<style lang="less" scoped>
    .ant-avatar-lg {
        width: 48px;
        height: 48px;
        line-height: 48px;
    }

    .list-content-item {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        margin-left: 40px;
        span {
            line-height: 20px;
        }
        p {
            margin-top: 4px;
            margin-bottom: 0;
            line-height: 22px;
        }
    }
</style>
