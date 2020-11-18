<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.beginDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" class="filter-item" placeholder="开始创建时间" />
      <el-date-picker v-model="listQuery.endDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" class="filter-item" placeholder="结束创建时间" />
      <el-input v-model="listQuery.name" placeholder="租户名称" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.enabled" class="filter-item" placeholder="租户状态">
        <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="warning" icon="el-icon-delete" @click="resetQueryForm">{{ $t('table.reset') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="租户Id" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tenantId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.enabled | statusFilter">{{ row.enabled | statusStrFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" @click="handleUpdate(row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="queryPageList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
        <el-form-item label="租户名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入租户名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="描述" />
        </el-form-item>
        <el-form-item :label="$t('table.status')" prop="enabled">
          <el-select v-model="temp.enabled" class="filter-item" placeholder="请选择">
            <el-option v-for="item in addStatusOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPagedList, createTenant, deleteTenant, updateTenant } from '@/api/tenant'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'

export default {
  name: 'TenantTable',
  components: { Pagination },
  directives: { waves },
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        beginDate: '',
        endDate: '',
        name: '',
        enabled: -1
      },
      statusOptions: [
        { id: -1, name: '全部' },
        { id: 0, name: '禁用' },
        { id: 1, name: '启用' }
      ],
      addStatusOptions: [
        { id: 0, name: '禁用' },
        { id: 1, name: '启用' }
      ],
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: { update: '编辑', create: '创建' },
      temp: {
        id: 0,
        name: '',
        description: '',
        enabled: 1
      },
      rules: {
        name: [{ required: true, message: '租户名称不能为空', trigger: 'blur' }],
        enabled: [{ required: true, message: '请选择状态', trigger: 'change' }]
      }
    }
  },
  created() {
    this.queryPageList()
  },
  methods: {
    queryPageList() {
      this.listLoading = true
      getPagedList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },
    resetQueryForm() {
      this.listQuery = {
        pageIndex: 1,
        pageSize: 20,
        beginDate: '',
        endDate: '',
        name: ''
      }
    },
    resetTemp() {
      this.temp = {
        name: ''
      }
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.queryPageList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createTenant(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.queryPageList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const index = this.list.findIndex(v => v.id === this.temp.id)
          this.list.splice(index, 1, this.temp)

          updateTenant(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTenant(row).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
