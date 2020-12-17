<template>
  <section-card v-if="viewData" title="接口信息">
    <template #actions>
      <a-button type="text" class="link" size="small" @click="linkEvent">查看页面</a-button>
    </template>
    <div class="section-body-content">
      <div class="subsection basic-section">
        <div class="title">基本信息</div>
        <div class="section-body">
          <a-row class="row">
            <a-col :span="4" class="col-key">接口名称：</a-col>
            <a-col :span="8" class="col-name">{{ viewData.title }}</a-col>
            <a-col :span="4" class="col-key">创&ensp;建&ensp;人：</a-col>
            <a-col :span="8" class="col-kalue">{{ viewData.username }}</a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="4" class="col-key">接口路径：</a-col>
            <a-col :span="8" class="col-name">{{ viewData.path }}</a-col>
          </a-row>
          <a-row class="row">
            <a-col :span="4" class="col-key">创建时间：</a-col>
            <a-col :span="8" class="col-name">
              {{ formatDate(viewData.createdAt, 'yyyy-MM-dd hh:mm:ss') }}
            </a-col>
            <a-col :span="4" class="col-key">修改时间：</a-col>
            <a-col :span="8" class="col-kalue">
              {{ formatDate(viewData.updatedAt, 'yyyy-MM-dd hh:mm:ss') }}
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="subsection">
        <div class="title">请求参数</div>
        <div class="section-body">
          <div class="subtitle">Body:</div>
          <schema-table :data="viewData.reqBody" />
        </div>
      </div>
      <div class="subsection">
        <div class="title">返回数据</div>
        <div class="section-body">
          <schema-table :data="viewData.resBody" />
        </div>
      </div>
    </div>
  </section-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

import core from '@/core'
import { formatDate } from '../common/utils'
import SchemaTable from '../common/schemaTable/index.vue'

export default defineComponent({
  components: {
    SchemaTable
  },

  data() {
    return {
      formatDate
    }
  },

  computed: {
    ...mapGetters(['viewData'])
  },

  methods: {
    linkEvent() {
      core.openLink(this.viewData.link)
    }
  }
})
</script>

<style lang="less" scoped>
.basic-section {
  .row {
    line-height: 30px;
  }
}

.section-body {
  & > .subtitle {
    font-weight: bold;
    line-height: 30px;
  }
}
</style>
