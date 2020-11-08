<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    
    <el-table v-loading="listLoading" :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column width="100px" align="center" label="icon">
        <template slot-scope="{row}">
          <svg-icon :icon-class="row.icon" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="iconstr">
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
      <el-table-column width="150px" align="center" label="name">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
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
      <el-table-column width="100px" align="center" label="sortOrder">
        <template slot-scope="{row}">
          <span>{{ row.sortOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.parentId!='0'" type="success" size="mini" @click="handleAuthorize(row)">权限</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="权限" :visible.sync="dialogAuthorizeFormVisible" width="60%">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-edit" @click="handlePermissionCreate">{{ $t('table.add') }}</el-button>
      </div>

      <el-table :key="tableKey" v-loading="listLoading" :data="permissionlist" border fit highlight-current-row style="width: 100%;">
        <el-table-column width="300px" align="center" label="name">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="320px" align="center" label="description">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="permissionHandleUpdate(row)">{{ $t('table.edit') }}</el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handlePermissionDelete(row,$index)">{{ $t('table.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="权限" :visible.sync="dialogPermissionFormVisible" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="description" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermissionFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createPermission():updatePermission()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getPagedList, deleteRouter, getPermissionList, createPermission, deletePermission, updatePermission } from '@/api/router'

export default {
  name: 'RouterTable',
  filters: {
    statusFilter(status) {
      const statusMap = { true: 'success', false: 'danger' }
      return statusMap[status]
    },
    statusStrFilter(status) {
      return status === true ?  '启用' : '禁用'
    }
  },
  data() {
    return {
      list: null,
      permissionlist: null,
      listLoading: true,
      listQuery: {},
      dialogAuthorizeFormVisible: false,
      dialogPermissionFormVisible: false,
      dialogStatus: '',
      temp: {
        id: undefined,
        name: '',
        description: '',
        routerId: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: 'name不能为空', trigger: 'blur' }],
        description: [{ required: true, message: 'description不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  watch:{
    // $route() {
    //   this.getList()
    // }
  },
  methods: {
    getList() {
      this.listLoading = true
      getPagedList(this.listQuery).then(response => {
        this.list = response.data

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleCreate() {
      this.$router.push({
        path: 'createrouter'
      })
    },
    handleUpdate(row) {
      this.$router.push({
        path: 'createrouter',
        query: { id: row.id }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRouter(row).then(() => {
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
    },
    getPermissionList() {
      getPermissionList(this.listQuery).then(response => {
        this.permissionlist = response.data

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleAuthorize(row) {
      this.dialogAuthorizeFormVisible = true
      this.listLoading = true
      this.listQuery.routerId = row.id
      this.temp.routerId = row.id
      this.getPermissionList()
    },
    handlePermissionCreate() {
      this.dialogPermissionFormVisible = true
      this.dialogStatus = 'create'
    },
    createPermission() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createPermission(this.temp).then(() => {
            this.dialogPermissionFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getPermissionList()
          })
        }
      })
    },
    handlePermissionDelete(row, index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletePermission(row).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getPermissionList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    permissionHandleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogPermissionFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updatePermission() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updatePermission(tempData).then(() => {
            const index = this.permissionlist.findIndex(v => v.id === this.temp.id)
            this.permissionlist.splice(index, 1, this.temp)
            this.dialogPermissionFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
