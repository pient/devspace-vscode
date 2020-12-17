<template>
  <a-table
    size="small"
    bordered
    :columns="tableHeader"
    :pagination="false"
    :data-source="tableData"
  ></a-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { _ } from '@/core'

import { transformSchemaToTable } from '../schema'
import Config from './config'

export default defineComponent({
  props: {
    data: {}
  },

  data() {
    return {
      tableHeader: Config.tableHeader
    }
  },

  computed: {
    tableData() {
      let tableData: any = transformSchemaToTable(this.data)
      tableData = _.isArray(tableData) ? tableData : []

      return tableData
    }
  }
})
</script>

<style lang="less" scoped></style>
