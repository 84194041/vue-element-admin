<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="temp" :rules="rules" label-width="80px">
      <div class="createPost-main-container">
        <el-form-item label="parentId" prop="parentId" style="width: 300px">
           <el-select
             v-model="temp.parentId"
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
        <el-form-item label="path" prop="path" style="width: 300px">
          <el-input v-model="temp.path" placeholder="Please enter the path"></el-input>
        </el-form-item>
        <el-form-item label="icon" prop="icon" style="width: 300px">
          <el-input v-model="temp.icon" placeholder="Please enter the icon"></el-input>
        </el-form-item>
        <el-form-item label="component" prop="component" style="width: 300px">
          <el-input v-model="temp.component" placeholder="Please enter the component"></el-input>
        </el-form-item>
        <el-form-item label="name" prop="name" style="width: 300px">
          <el-input v-model="temp.name" placeholder="Please enter the name"></el-input>
        </el-form-item>
        <el-form-item label="title" prop="title" style="width: 300px">
          <el-input v-model="temp.title" placeholder="Please enter the title"></el-input>
        </el-form-item>
        <el-form-item label="sortOrder" prop="sortOrder" style="width: 300px">
          <el-input v-model="temp.sortOrder" placeholder="Please enter the sortOrder"></el-input>
        </el-form-item>
        <el-form-item label="enabled" style="width: 300px">
          <el-switch
            v-model="temp.enabled"
            :active-value="0"
            :inactive-value="1"
            active-color="#ff4949"
            inactive-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="temp.id===undefined?createData():updateData()">确定</el-button>
          <el-button @click="closeView()">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getRouterSelectData, createRouter, getRouter, updateRouter } from '@/api/router'

export default {
  name: 'CreateRouter',
  data() {
    return {
      tempRoute: {},
      orgList: [],
      list: [],
      loading: false,
      allOrds: [],
      temp: {
        parentId: undefined,
        icon: '',
        id: undefined,
        path: '',
        component: '',
        name: '',
        title: '',
        controller: '',
        action: '',
        sortOrder: undefined,
        enabled: 1
      },
      rules: {
        parentId: [{ required: true, message: 'parentId不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: 'icon不能为空', trigger: 'blur' }],
        path: [{ required: true, message: 'path不能为空', trigger: 'blur' }],
        component: [{ required: true, message: 'component不能为空', trigger: 'blur' }],
        name: [{ required: true, message: 'name不能为空', trigger: 'blur' }],
        title: [{ required: true, message: 'title不能为空', trigger: 'blur' }],
        sortOrder: [{ required: true, message: 'sortOrder不能为空', trigger: 'blur' }]
      },
      statusOptions: { value1: true, value2: false }
    }
  },
  created() {
    this.initData()
    this.temp.id = this.$route.query.id

    if (this.temp.id !== undefined) {
      this.tempRoute = Object.assign({}, this.$route)
      this.setTagsViewTitle()
      this.handleUpdate()
    }
  },
  methods: {
    setTagsViewTitle() {
      const title = '编辑导航'
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    initData() {
      getRouterSelectData(this.listQuery).then(response => {
        this.allOrds = response.data
        this.list = this.allOrds.map(item => {
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
        this.orgList = this.list
      }
    },
    selectfocus() {
      this.orgList = this.list
    },
    createData() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          if (this.temp.enabled === 1) {
            this.temp.enabled = true
          } else {
            this.temp.enabled = false
          }
          this.temp.sortOrder = parseInt(this.temp.sortOrder)
          createRouter(this.temp).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.closeView()
          })
        }
      })
    },
    handleUpdate() {
      this.listLoading = true
      getRouter(this.temp).then(response => {
        this.temp = response.data
        this.$nextTick(() => {
          this.$refs['postForm'].clearValidate()
        })
        this.orgList = this.list
        this.temp.parentId = this.temp.parentId + ''
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updateData() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          if (this.temp.enabled === 1) {
            this.temp.enabled = true
          } else {
            this.temp.enabled = false
          }
          this.temp.sortOrder = parseInt(this.temp.sortOrder)
          this.temp.parentId = parseInt(this.temp.parentId)
          updateRouter(this.temp).then(() => {
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.closeView()
          })
        }
      })
    },
    closeView() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: 'router'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 10px 45px 20px 20px;
  }
}
</style>
