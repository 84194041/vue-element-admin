<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">{{ $t('table.add') }}</el-button>
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
      <el-table-column min-width="200px" align="center" label="iconstr">
        <template slot-scope="{row}">
          <span>{{ row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="path">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="component">
        <template slot-scope="{row}">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="sort">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="title">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" min-width="200px" align="center" label="enabled">
        <template slot-scope="{row}">
          <el-tag :type="row.enabled | statusFilter">{{ row.enabled | statusStrFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" width="200" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px">
        <el-form-item label="父节点" prop="parentId">
          <el-select
            v-model="temp.parentId"
            filterable
            remote
            reserve-keyword
            placeholder="请选择父节点"
            :remote-method="remoteMethod"
            :loading="loading"
            @focus="selectfocus"
          >
            <el-option
              v-for="item in menuComboxList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-input v-model="temp.icon" placeholder="Please enter the icon" />
        </el-form-item>
        <el-form-item label="path" prop="path">
          <el-input v-model="temp.path" placeholder="Please enter the path" />
        </el-form-item>
        <el-form-item label="component" prop="component">
          <el-input v-model="temp.component" placeholder="Please enter the component" />
        </el-form-item>
        <el-form-item label="sort" prop="sort" style="width: 300px">
          <el-input v-model="temp.sort" placeholder="Please enter the sort" />
        </el-form-item>
        <el-form-item label="title" prop="title">
          <el-input v-model="temp.title" placeholder="Please enter the title" />
        </el-form-item>
        <el-form-item label="enabled" style="width: 300px">
          <el-switch
            v-model="temp.enabled"
            :active-value="0"
            :inactive-value="1"
            active-color="#ff4949"
            inactive-color="#13ce66"
          />
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
import { getMenuList, getMenuComboxData, createMenu, deleteMenu, updateMenu } from '@/api/menu'
import waves from '@/directive/waves'

export default {
  name: 'MenuTable',
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
      list: null,
      menuComboxList: null,
      loading: false,
      listLoading: true,
      listQuery: {},
      menuComboxlistQuery: {},
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: { update: '编辑', create: '创建' },
      temp: {
        parentId: -1,
        icon: '',
        path: '',
        component: '',
        sort: 0,
        title: '',
        enabled: 1
      },
      rules: {
        parentId: [{ required: true, message: '请选择父节点', trigger: 'blur' }],
        icon: [{ required: true, message: 'icon不能为空', trigger: 'blur' }],
        path: [{ required: true, message: 'path不能为空', trigger: 'blur' }],
        component: [{ required: true, message: 'component不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: 'sort不能为空', trigger: 'blur' }],
        title: [{ required: true, message: 'title不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getMenuComboxData() {
      getMenuComboxData(this.menuComboxlistQuery).then(response => {
        this.menuComboxList = response.data.map(item => {
          return { value: item.parentId, label: item.title }
        })
      })
    },
    remoteMethod(query) {
    },
    selectfocus() {
    },
    getList() {
      this.listLoading = true
      getMenuList(this.listQuery).then(response => {
        setTimeout(() => {
          this.list = response.data
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleCreate() {
      this.getMenuComboxData()
      // this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createMenu(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.getMenuComboxData()
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

          updateMenu(tempData).then(() => {
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
          deleteMenu(row).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
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
