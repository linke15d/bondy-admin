<template>
  <div class="p-2">
    <ElCard class="mb-4">
      <el-row :gutter="20">
        <el-col :xl="5" :lg="5" :md="12" :sm="12" :xs="24">
          <el-form-item label="时间" size="small">
            <el-date-picker v-model="selectionDate" type="daterange" range-separator="至" start-placeholder="开始时间"
              end-placeholder="结束时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="dateChange"
              :clearable="false" />
          </el-form-item>
        </el-col>

        <el-col :xl="5" :lg="5" :md="12" :sm="12" :xs="24">
          <el-form-item>
            <ElButton type="primary" size="small" @click="onSearch">搜索</ElButton>
            <ElButton size="small" @click="onReset">重置</ElButton>
          </el-form-item>
        </el-col>
      </el-row>
    </ElCard>
    <ElRow :gutter="20" :class="prefixCls">
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    总用户
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ summaryData?.total_users }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    今日新增
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ summaryData?.new_today }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    近7天新增
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ summaryData?.new_7d }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    近30天新增
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ summaryData?.new_30d }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    今日活跃
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ summaryData?.active_today }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    近7天活跃
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ summaryData?.active_7d }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    近30天活跃
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ summaryData?.active_30d }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    至少登录过一次
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ summaryData?.login_user_count }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    安卓下载量
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ androidDownload }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
      <ElCol :xl="4" :lg="4" :md="12" :sm="12" :xs="24">
        <ElCard class="mb-20px">
          <ElSkeleton :loading="loading" animated :rows="2">
            <template #default>
              <div :class="`${prefixCls}__item flex justify-between h-20 items-center`">
                <div :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples inline-block rounded-6px`">
                  <Icon icon="mdi:account-credit-card" :size="50" class="!text-green-500" />
                </div>
                <div class="flex flex-col">
                  <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">
                    IOS下载量
                  </div>
                  <div class="flex items-center justify-end mt-4">
                    <span>{{ iosDownload }}</span>
                  </div>
                </div>
              </div>
            </template>
          </ElSkeleton>
        </ElCard>
      </ElCol>
    </ElRow>

    <ElRow :gutter="20" :class="prefixCls">
      <ElCol :xl="6" :lg="6" :md="24" :sm="24" :xs="24">
        <ElCard class="mb-20px">
          <div id="device" style="height: 400px"></div>
        </ElCard>
      </ElCol>
      <ElCol :xl="18" :lg="18" :md="24" :sm="24" :xs="24">
        <ElCard class="mb-20px">
          <div id="loginip" style="height: 400px"></div>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'
import { dataOverview, downloadCount } from './service'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { ElCard } from 'element-plus'

const today = dayjs().format('YYYY-MM-DD')

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('panel')

const form = reactive({
  from_date: today,
  to_date: today
})

const selectionDate = ref([today, today])
const loading = ref(true)
const summaryData: any = ref({})
const androidDownload = ref(0)
const iosDownload = ref(0)

// 判空：饼图数据 [{name, value}]
const isEmptyPie = (list: any[] = []) =>
  !list.length || list.every((i: any) => !i?.value || Number(i.value) === 0)

// 判空：柱状图数据 [number]
const isEmptyBar = (list: number[] = []) =>
  !list.length || list.every((n) => !Number(n))

// 控制“暂无数据”覆盖层
const setEmptyGraphic = (chart: echarts.ECharts, show: boolean, text = '暂无数据') => {
  chart.setOption({
    graphic: show
      ? [{
        type: 'text',
        left: 'center',
        top: 'middle',
        silent: true,
        style: { text, fontSize: 16, fill: '#9ca3af' } // #9ca3af = Tailwind 的 gray-400
      }]
      : [] // 有数据时清空 graphic
  } as any, { replaceMerge: ['graphic'] })
}


//选择时间
const dateChange = (val) => {
  form.from_date = val ? val[0] : ''
  form.to_date = val ? val[1] : ''
}

const chartPieFn = (type, titleType, data) => {
  const dom = (document as any).getElementById(type)
  if (!dom) return
  const myChart = echarts.getInstanceByDom(dom) || echarts.init(dom)

  const option = {
    title: { text: '登录设备', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      name: titleType,
      type: 'pie',
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'outside',
        formatter: `{b}\n{d}%`
      },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      labelLine: { show: true },
      data
    }]
  }

  myChart.setOption(option)
  setEmptyGraphic(myChart, isEmptyPie(data))
  window.addEventListener('resize', () => myChart.resize())
}

const chartBarFn = (areaName: string[], ipNum: number[]) => {
  const dom = (document as any).getElementById('loginip')
  if (!dom) return
  const myChart = echarts.getInstanceByDom(dom) || echarts.init(dom)

  const option = {
    title: { text: '登录IP TOP10', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {},
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    yAxis: { type: 'value', boundaryGap: [0, 0.01] },
    xAxis: { type: 'category', data: areaName, inverse: true },
    series: [{ type: 'bar', data: ipNum }]
  }

  myChart.setOption(option)
  setEmptyGraphic(myChart, isEmptyBar(ipNum))
  window.addEventListener('resize', () => myChart.resize())
}

// 获取统计数据
const getCount = async () => {
  loading.value = false
  const params = Object.assign({ ...form })
  for (const i in params) {
    if (params[i] === '') {
      delete params[i]
    }
  }
  const res = await dataOverview(params)
  if (res.code === 0) {
    summaryData.value = res.data.summary
    res.data.device_distribution.forEach(item => {
      item.name = item.name === 'Unknown' ? 'Web' : item.name
    });
    chartPieFn(
      'device',
      '安装设备',
      res.data.device_distribution,
    )

    const areaName = res.data.top_login_countries.map((ele) => ele.name)
    const ipNum = res.data.top_login_countries.map((ele) => ele.value)
    chartBarFn(areaName, ipNum)
  }
}
const getDownloadCount = async () => {
  const params = Object.assign({ ...form })
  for (const i in params) {
    if (params[i] === '') {
      delete params[i]
    }
  }
  const res = await downloadCount(params)
  if (res.code === 0) {
    androidDownload.value = res.data.android
    iosDownload.value = res.data.ios
  }
}

const onSearch = () => {
  getDownloadCount()
  getCount()
}

const onReset = () => {
  selectionDate.value = [today, today]
  form.from_date = today
  form.to_date = today
  getCount()
}

onMounted(() => {
  getDownloadCount()
  getCount()
})
</script>
