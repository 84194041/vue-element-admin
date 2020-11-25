<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }"
    >
      <el-table-column width="100px" align="center" label="icon">
        <template slot-scope="{row}">
          <svg-icon :icon-class="row.icon" class="meta-item__icon" />
          <i :class="row.icon" />
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="iconstr">
        <template slot-scope="{row}">
          <span>{{ row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="path">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="component">
        <template slot-scope="{row}">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="sort">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="title">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" width="100" align="center" label="enabled">
        <template slot-scope="{row}">
          <el-tag :type="row.enabled | statusFilter">{{ row.enabled | statusStrFilter }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMenuList } from '@/api/menu'

export default {
  name: 'MenuTable',
  filters: {
    statusFilter(status) {
      const statusMap = { 1: 'success', 0: 'danger' }
      return statusMap[status]
    },
    statusStrFilter(status) {
      return status === 1 ? '启用' : '禁用'
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {},
      dialogStatus: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getMenuList(this.listQuery).then(response => {
        setTimeout(() => {
          this.list = response.data
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
