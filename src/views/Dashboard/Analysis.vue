<template>
  <el-form>
    <ElRow :gutter="24">
      <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="mb-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>今日新增用户数</span>
            </div>
          </template>
          <div> {{ summaryData.today_new_users }} </div>
        </el-card>
      </el-col>
      <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="mb-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>今日新增记录数</span>
            </div>
          </template>
          <div> {{ summaryData.today_new_records }} </div>
        </el-card>
      </el-col>
      <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="mb-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>近7天活跃用户数</span>
            </div>
          </template>
          <div> {{ summaryData.active_users_last_7_days }} </div>
        </el-card>
      </el-col>
      <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="mb-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>总注册用户数</span>
            </div>
          </template>
          <div> {{ summaryData.total_users }} </div>
        </el-card>
      </el-col>
      <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="mb-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>总伴侣对数</span>
            </div>
          </template>
          <div> {{ summaryData.total_couples }} </div>
        </el-card>
      </el-col>
      <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="mb-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>总亲密记录数</span>
            </div>
          </template>
          <div> {{ summaryData.total_records }} </div>
        </el-card>
      </el-col>
      <el-col :xl="6" :lg="6" :md="12" :sm="12" :xs="24" class="mb-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>总付费用户数</span>
            </div>
          </template>
          <div> {{ summaryData.total_premium_users }} </div>
        </el-card>
      </el-col>
    </ElRow>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { statsDashboard } from './service'

const summaryData: any = ref({})

// 获取统计数据
const getCount = async () => {
  const res = await statsDashboard()
  summaryData.value = res.data
}

onMounted(() => {
  getCount()
})
</script>
