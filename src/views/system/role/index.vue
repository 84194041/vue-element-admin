<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.applicationName" placeholder="应用名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves class="filter-item" type="warning" icon="el-icon-delete" @click="resetQueryForm">重置</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="角色名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.applicationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.enabled | statusFilter">{{ row.enabled | statusStrFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">{{ $t('table.edit') }}</el-button>
          <el-button type="success" size="mini" @click="handleAuthorize(row)">授权</el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">{{ $t('table.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="所属应用" prop="appId">
           <el-select
             v-model="temp.appId"
             clearable="true"
             filterable
             remote
             reserve-keyword
             placeholder="请输入关键词"
             :remote-method="remoteMethod"
             :loading="loading"
             @focus="selectfocus">
             <el-option
                 v-for="item in orgList"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
             </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="描述" />
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.enabled" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色权限设置" :visible.sync="dialogAuthorizeFormVisible">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="equipments"
        border
        style="width: 100%"
      >
        <el-table-column prop="title" label="分类名称" width="100px" />
        <el-table-column label="权限配置">
          <template slot-scope="scope">
            <el-form>
              <el-checkbox-group v-model="checkList" @change="handleCheckChange">
                <el-checkbox v-for="child in scope.row.permissionChildren" :key="child.id" :label="child.id" size="mini" text-color="#FF0000">{{ child.description }}</el-checkbox>
              </el-checkbox-group>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthorizeFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="createAuthorize()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPagedList, createRole, deleteRole, updateRole, getAppSelectData, getAuthorizeData, createAuthorize } from '@/api/role'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'RoleTable',
  components: { Pagination },
  directives: { waves },
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
      tableKey: 0,
      orgList: [],
      allOrds: [],
      applist: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        name: '',
        applicationName: ''
      },
      statusOptions: [
        { id: 0, name: '禁用' },
        { id: 1, name: '启用' }
      ],
      temp: {
        appId: '',
        id: undefined,
        name: '',
        description: '',
        enabled: 1,
        permissionIds: []
      },
      dialogFormVisible: false,
      dialogAuthorizeFormVisible: false,
      loading: false,
      dialogStatus: '',
      textMap: { update: '编辑', create: '创建' },
      rules: {
        appId: [{ required: true, message: '所属应用不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      checkList: [],
      equipments: []
    }
  },
  created() {
    this.initData()
    this.getList()
  },
  methods: {
    initData() {
      getAppSelectData(this.listQuery).then(response => {
        this.allOrds = response.data
        this.applist = this.allOrds.map(item => {
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
    selectfocus() {
      this.orgList = this.applist
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
        applicationName: ''
      }
      this.getList()
    },
    resetTemp() {
      this.temp = {
        appId: '',
        id: undefined,
        name: '',
        description: '',
        enabled: 1
      }
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
          if (this.temp.enabled === 1) {
            this.temp.enabled = true
          } else {
            this.temp.enabled = false
          }
          createRole(this.temp).then(() => {
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
      this.orgList = this.applist
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.enabled === true) {
        this.temp.enabled = 1
      } else {
        this.temp.enabled = 0
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
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
          updateRole(tempData).then(() => {
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
          deleteRole(row).then(() => {
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
    handleAuthorize(row) {
      this.dialogAuthorizeFormVisible = true
      this.checkList = []
      this.temp.id = row.id
      getAuthorizeData(row).then(response => {
        this.equipments = Object.assign([], response.data)
        this.checkList = Object.assign([], response.data2)
      })
    },
    handleCheckChange() {
      console.log(this.checkList)
    },
    createAuthorize() {
      this.temp.permissionIds = this.checkList
      createAuthorize(this.temp).then(() => {
        this.dialogAuthorizeFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
