<template>
  <h2 style="text-align: left;padding-left: 20px;padding-bottom: 20px">分类列表</h2>

  <el-table :data="categorys" :max-height="600" stripe border style="width: 100%" v-loading="state.loading">
    <el-table-column prop="id" label="ID" width="60"/>
    <el-table-column prop="name" label="分类名称" width="150"/>
    <el-table-column prop="bookCount" label="小说数" width="150">
      <template #default="scope">
        <el-badge v-show="scope.row.bookCount>0" :value="scope.row.bookCount" :max="99999999" type="info"></el-badge>
        <el-badge v-show="scope.row.bookCount<=0" :value="scope.row.bookCount" :max="99999999" type="danger"></el-badge>
      </template>
    </el-table-column>
    <el-table-column prop="urlCount" label="链接数" width="150">
      <template #default="scope">
        <el-badge v-show="scope.row.urlCount>0" :value="scope.row.urlCount" :max="99999999" type="info"></el-badge>
        <el-badge v-show="scope.row.urlCount<=0" :value="scope.row.urlCount" :max="99999999" type="danger"></el-badge>
      </template>
    </el-table-column>
    <el-table-column prop="action" fixed="right">
      <template #default="scope">

        <el-button size="small"
                   type="primary"
                   plain
                   :loading="this.state.item.loading[scope.row['id']]"
                   @click="handleEdit(scope.$index,scope.row)">修改
        </el-button>

      </template>
    </el-table-column>

  </el-table>

  <el-alert
      style="margin-top: 16px"
      type="info"
      :closable="false"
      description="分类操作可能会造成冗余/脏数据, 请确保您有一定的数据库基础, 正常情况下无需 [删除] 操作."
  />

  <el-dialog v-model="state.editDialog.visible" width="22%" title="修改分类" v-on:close="form={}">
    <el-form :model="form" label-width="80px">
      <el-form-item label="分类">
        <el-input v-model="form.id" disabled autocomplete="off" style="width: 35%"/>
      </el-form-item>
      <el-form-item label="分类名称">
        <el-input v-model="form.name" autocomplete="off" style="width: 80%"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.editDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateCategory"
                   :loading="state.editDialog.update.loading">保存</el-button>
      </span>
    </template>

  </el-dialog>


</template>

<script>
import {categorys, updateCategory} from "@/repository"
import {ElMessage, ElMessageBox} from "element-plus"

export default {
  name: "CategoryDataView",
  beforeMount() {
    this.$store.state.nav = "category"
  },
  async mounted() {
    this.categorys = await getCategorys()
    this.state.loading = false
  },
  methods: {
    async handleUpdateCategory() {
      if (this.form === undefined ||
          this.form.name.trim() === '') {
        return
      }
      this.state.editDialog.update.loading = true
      await delay(500)
      let updateResult = await updateCategoryById(this.form.id, this.form.name)
      if (updateResult) {
        ElMessage.success('修改保存成功')
        // 刷新数据
        let category = this.categorys.find((category) => {
          return category.id === this.form.id
        })
        category.name = this.form.name

        this.state.editDialog.visible = false
      } else {
        ElMessage.error('保存操作失败')
      }
      this.state.editDialog.update.loading = false
    },
    handleEdit(index, data) {
      this.state.editDialog.visible = true
      this.form = {
        id: data.id,
        name: data.name
      }
    }
  },
  data() {
    return {
      categorys: [],
      form: {},
      state: {
        loading: true,
        item: {
          loading: {}
        },
        editDialog: {
          visible: false,
          update: {
            loading: false
          }
        }
      }
    }
  }
}

async function updateCategoryById(id, name) {
  try {
    let res = await updateCategory(id, name)
    if (res.code === 200 && res.data) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

async function getCategorys() {
  try {
    let res = await categorys()
    if (res.code === 200) {
      return res.data
    } else {
      ElMessage.error(res.message)
      return null
    }
  } catch (e) {
    ElMessage.error('加载数据失败')
    return null
  }
}

function delay(ms) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, _) => {
    setTimeout(function () {
      resolve(true)
    }, ms)
  })
}
</script>

<style>
.el-badge__content--info {
  background-color: #0b130b !important;
}

.el-badge__content--danger {
  background-color: #b0b0b0!important;
}
.el-alert {
  --el-alert-padding: 8px 8px !important;
}
</style>