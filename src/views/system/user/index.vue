<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="管理员名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.applicationName" placeholder="应用名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.beginDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" class="filter-item" placeholder="开始创建时间" />
      <el-date-picker v-model="listQuery.endDate" type="datetime" format="yyyy-MM-dd HH:mm:ss" class="filter-item" placeholder="结束创建时间" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves class="filter-item" type="warning" icon="el-icon-delete" @click="resetQueryForm">重置</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="管理员名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属应用" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.applicationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">{{ $t('table.edit') }}</el-button>
          <el-button type="success" size="mini" @click="handleRole(row)">角色</el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="所属应用" prop="appId">
           <el-select v-model="temp.appId" clearable=true filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading" @focus="selectfocus">
             <el-option v-for="item in orgList" :key="item.value" :label="item.label" :value="item.value">
             </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="管理员" prop="userName">
          <el-input v-model="temp.userName" placeholder="请输入管理员名称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwordHash" style="width: 300px" v-show="dialogPasswordVisible">
          <el-input type="password" v-model="temp.passwordHash" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色设置" :visible.sync="dialogRoleFormVisible">
      <el-form ref="roleDataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="所属角色" prop="roleId">
           <el-select v-model="temp.roleId" clearable=true filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="roleRemoteMethod" :loading="loading" @focus="roleSelectfocus">
             <el-option v-for="item in orgRoleList" :key="item.value" :label="item.label" :value="item.value">
             </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="createRoleData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPagedList, createUser, deleteUser, updateUser, getRoleSelectData, updateUserRole } from '@/api/user'
import { getAppSelectData } from '@/api/role'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      orgList: [],
      applist: [],
      orgRoleList: [],
      rolelist: [],
      list: null,
      total: 0,
      listLoading: true,
      loading: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        name: '',
        applicationName: '',
        beginDate: '',
        endDate: ''
      },
      temp: {
        appId: '',
        id: undefined,
        userName: '',
        passwordHash: '',
        email: '',
        roleId: '',
        userId: undefined
      },
      dialogFormVisible: false,
      dialogPasswordVisible: true,
      dialogRoleFormVisible: false,
      dialogStatus: '',
      textMap: { update: '编辑', create: '创建' },
      rules: {
        appId: [{ required: true, message: '所属应用不能为空', trigger: 'blur' }],
        userName: [{ required: true, message: '管理员名称不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        passwordHash: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        roleId: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initData()
    this.getList()
  },
  methods: {
    initData() {
      getAppSelectData(this.temp).then(response => {
        this.applist = response.data.map(item => {
          return { value: item.id, label: item.text }
        })
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.orgList = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.orgList = this.applist
      }
    },
    roleRemoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.orgRoleList = this.rolelist.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.orgRoleList = this.rolelist
      }
    },
    selectfocus() {
      this.orgList = this.applist
    },
    roleSelectfocus() {
      this.orgRoleList = this.rolelist
    },
    getList() {
      this.listLoading = true
      getPagedList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    resetQueryForm() {
      this.listQuery = {
        pageIndex: 1,
        pageSize: 20,
        name: '',
        applicationName: '',
        beginDate: '',
        endDate: ''
      }
      this.getList()
    },
    resetTemp() {
      this.temp = {
        appId: '',
        id: undefined,
        userName: '',
        passwordHash: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.dialogPasswordVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.enabled === 1) {
            this.temp.enabled = true
          } else {
            this.temp.enabled = false
          }
          createUser(this.temp).then(() => {
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
      if (row.passwordHash === null) {
        row.passwordHash = '1';
      }
      this.orgList = this.applist
      this.temp = Object.assign({}, row)
      if (this.temp.enabled === true) {
        this.temp.enabled = 1
      } else {
        this.temp.enabled = 0
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.dialogPasswordVisible = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.enabled === 1) {
            this.temp.enabled = true
          } else {
            this.temp.enabled = false
          }
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
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
          deleteUser(row).then(() => {
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
    },
    handleRole(row) {
      getRoleSelectData(row).then(response => {
        this.rolelist = response.data.map(item => {
          return { value: item.id, label: item.text }
        })
        this.orgRoleList = this.rolelist
      })
      this.dialogRoleFormVisible = true
      if (row.userRoleList.length > 0) {
         this.temp.roleId = row.userRoleList[0].roleId
      }
      this.temp.userId = row.id
    },
    createRoleData() {
      this.$refs['roleDataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUserRole(tempData).then(() => {
            this.dialogRoleFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    }
  }
}
</script>
