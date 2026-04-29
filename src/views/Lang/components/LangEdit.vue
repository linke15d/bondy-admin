<template>
    <ElDialog :model-value="dialogVisible" :title="itemData?.id ? '编辑语言' : '新增语言'" width="450" center
        @close="onClose()">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" size="small" label-width="70">
            <el-form-item label="语言名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入语言名称" clearable />
            </el-form-item>
            <el-form-item label="语言代码" prop="code">
                <el-input v-model="form.code" placeholder="请输入语言代码" clearable />
            </el-form-item>
            <el-form-item label="是否启用" prop="is_active">
                <el-select v-model="form.is_active" class="w-full">
                    <el-option label="启用" :value="true" />
                    <el-option label="禁用" :value="false" />
                </el-select>
            </el-form-item>
            <el-form-item label="是否默认" prop="is_default">
                <el-select v-model="form.is_default" class="w-full">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sort_order">
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
import { reactive, ref, watch } from 'vue'
import { langCreate, langUpdate } from '../service'
import { sanitizePositive } from '@/utils/numbers'

const props = defineProps({
    dialogVisible: { type: Boolean, default: false },
    itemData: { type: Object, default: {} },
})
const emit = defineEmits(['close'])

const defaultForm = {
    code: '',
    is_active: true,
    is_default: false,
    name: '',
    sort_order: '',
}
const form = reactive({ ...defaultForm })
const rules = reactive({
    name: [{ required: true, message: '请输入语言名称', trigger: ['blur', 'change'] }],
    code: [{ required: true, message: '请输入语言代码', trigger: ['blur', 'change'] }],
})
const ruleFormRef = ref()


const onSave = async () => {
    await ruleFormRef.value.validate(async (valid) => {
        if (!valid) return
        const apiUrl = props.itemData.id ? langUpdate : langCreate
        const res = await apiUrl(Object.assign({ ...form }, { sort_order: Number(form.sort_order) }))
        if (res.code === 0) {
            ElMessage.success('操作成功')
            emit('close', true)
            resetForm()
        }
    });
}

const resetForm = () => {
    ruleFormRef.value?.resetFields()
    Object.assign(form, JSON.parse(JSON.stringify(defaultForm)))
}

const onClose = () => {
    emit('close', false)
    resetForm()
}

watch(() => props.itemData, (val) => {
    if (val && val.id) Object.assign(form, val)
    else resetForm()
}, { immediate: true })
</script>