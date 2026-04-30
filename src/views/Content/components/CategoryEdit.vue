<template>
    <ElDialog :model-value="dialogVisible" :title="itemData?.id ? '编辑姿势' : '新增姿势'" width="450" center
        @close="onClose()">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" size="small" label-width="70">
            <div class="mb-2">分类名称</div>
            <el-form-item v-for="(v, i) in langList" :key="v.id" :label="v.name">
                <el-input v-model="form.names[i].name" placeholder="请输入分类名称"
                    :disabled="itemData.id && form.names[i].name" clearable />
            </el-form-item>
            <el-form-item label="是否启用" prop="is_active" v-if="itemData.id">
                <el-select v-model="form.is_active" class="w-full">
                    <el-option label="启用" :value="true" />
                    <el-option label="禁用" :value="false" />
                </el-select>
            </el-form-item>
            <el-form-item label="排序">
                <el-input v-model="form.sort_order" placeholder="请输入排序" clearable
                    @input="v => form.sort_order = sanitizePositive(v, { decimals: 0 })" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="onClose">取消</el-button>
            <el-button type="primary" @click="onSave">保存</el-button>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref, watch, nextTick } from 'vue'
import { categoriesCreate, categoriesUpdate } from '../service'
import { langQuery } from '@/views/Lang/service'
import { sanitizePositive } from '@/utils/numbers'
import { isFieldEmpty } from '@/utils/format'

const props = defineProps({
    dialogVisible: { type: Boolean, default: false },
    itemData: { type: Object, default: {} },
})
const emit = defineEmits(['close'])

const defaultForm = {
    id: '',
    sort_order: '',
    is_active: true,
    names: [] as { language_code: string, name: string }[],
}
const form = reactive({ ...defaultForm })
const rules = reactive({})
const ruleFormRef = ref()
const langList = ref<any>([])


const onSave = async () => {
    await ruleFormRef.value.validate(async (valid) => {
        if (!valid) return
        if (isFieldEmpty(form.names, 'name')) return ElMessage.error('请输入全部名称')
        const apiUrl = props.itemData.id ? categoriesUpdate : categoriesCreate
        const res = await apiUrl(Object.assign({ ...form }, { sort_order: Number(form.sort_order) }))
        if (res.code === 0) {
            ElMessage.success('操作成功')
            emit('close', true)
            resetForm()
        }
    });
}

const getLangs = async () => {
    const res = await langQuery()
    langList.value = res.data

    // 初始化 names，编辑时回显已有数据
    form.names = res.data.map((lang: any) => {
        const existing = props.itemData?.names?.find(
            (n: any) => n.language_code === lang.code
        )
        return {
            language_code: lang.code,
            name: existing?.name || ''
        }
    })

    // 回显其他字段
    if (props.itemData?.id) {
        form.id = props.itemData.id
        form.sort_order = props.itemData.sort_order
        form.is_active = props.itemData.is_active
    }

    await nextTick()
    ruleFormRef.value?.resetFields()
}

const resetForm = () => {
    ruleFormRef.value?.resetFields()
    Object.assign(form, JSON.parse(JSON.stringify(defaultForm)))
    // 重置 names 但保留语言结构
    form.names = langList.value.map((lang: any) => ({
        language_code: lang.code,
        name: ''
    }))
}

const onClose = () => {
    emit('close', false)
    resetForm()
}

watch(() => props.dialogVisible, (val) => {
    if (val) getLangs()
}, { immediate: true })
</script>