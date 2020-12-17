<template>
  <div class="c-api-list">
    <div class="input-search">
      <a-input-search
        placeholder="查询"
        :auto-expand-parent="autoExpandParent"
        @change="changeEvent"
      />
    </div>
    <div class="api-tree">
      <a-tree :expanded-keys="expandedKeys" :tree-data="treeData" @expand="expandEvent">
        <template v-slot:title="item">
          <div @click="itemClickEvent(item)">
            <div v-if="item.type === 'project'">
              <span>{{ item.title }}</span>
              <span class="q-ml-md"><SyncOutlined @click="fetchData()" /></span>
            </div>
            <span v-else-if="searchValue && compareKeyword(item, searchValue)">
              <span style="color: #f50">{{ item.title }}</span>
            </span>
            <span v-else>{{ item.title }}</span>
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SyncOutlined } from '@ant-design/icons-vue'

import core from '@/core'

import { apiProjectService } from '../utils'

export default defineComponent({
  components: { SyncOutlined },
  data() {
    const treeData: any[] = []
    const expandedKeys: string[] = []

    return {
      autoExpandParent: false,
      treeData,
      expandedKeys,
      searchValue: ''
    }
  },

  watch: {
    searchValue() {
      if (!this.searchValue) this.autoExpandParent = false
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    async itemClickEvent(item: any) {
      if (item.type !== 'api') return

      const data = await apiProjectService.fetchApi(item._id)

      window.postMessage(
        {
          command: 'view',
          viewType: 'workspace.apiDoc.apiView',
          data
        },
        window.location.origin
      )
    },

    changeEvent(e: any) {
      const keyword = e.target.value

      if (!keyword) return

      const expandedKeys: string[] = []

      this.treeData.forEach((prjItem: any) => {
        if (!prjItem.children) return

        expandedKeys.push(prjItem.key)

        prjItem.children.forEach((catItem: any) => {
          if (!catItem.children) return

          if (catItem.children.some((apiItem: any) => this.compareKeyword(apiItem, keyword))) {
            expandedKeys.push(catItem.key)
          }
        })
      })

      Object.assign(this, {
        expandedKeys,
        searchValue: keyword,
        autoExpandParent: true
      })
    },

    expandEvent(expandedKeys: string[]) {
      this.expandedKeys = expandedKeys
    },

    compareKeyword(apiItem: any, keyword: string) {
      if (!apiItem || !keyword) return false

      return (
        (apiItem.title && apiItem.title.indexOf(keyword) >= 0) ||
        (apiItem.path && apiItem.path.indexOf(keyword) >= 0)
      )
    },

    async fetchData() {
      let projectData: any = {}
      let catsData: any = []
      let apisData: any = []

      const itemSlots = { title: 'title' }

      await Promise.all([
        apiProjectService.fetchProject().then((res: any) => (projectData = res)),
        apiProjectService.fetchCateories().then((res: any) => (catsData = res)),
        apiProjectService.fetchApiList().then((res: any) => (apisData = res))
      ])

      projectData.scopedSlots = itemSlots

      this.expandedKeys = [projectData.key]

      catsData.forEach((item: any) => {
        item.scopedSlots = itemSlots
      })

      apisData.forEach((item: any) => {
        item.scopedSlots = itemSlots
      })

      catsData.forEach((item: any) => {
        item.children = apisData.filter((_item: any) => {
          return _item.catId === item._id
        })
      })

      projectData.children = catsData

      this.treeData = [projectData]
    }
  }
})
</script>

<style lang="less" scoped>
.c-api-list {
  height: 100%;
}

.input-search {
  padding: 5px 10px;
  background: white;
}

.api-tree {
  height: calc(100% - 40px);
  overflow: auto;
}
</style>
