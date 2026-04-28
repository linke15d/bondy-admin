<template>
    <ElDialog :model-value="dialogVisible" :title="itemData?.id ? '编辑姿势' : '新增姿势'" width="450" center
        @close="onClose()">
        <el-form :model="form" :rules="rules" ref="formRef" size="small" label-width="60">
            <el-form-item label="分类" prop="category">
                <el-select v-model="form.category" placeholder="请选择分类" class="w-full" clearable>
                    <el-option label="经典" value="CLASSIC" />
                </el-select>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <template #default>
                    <div class="w-full flex">
                        <el-upload accept="image/*" :http-request="uploadHttpClose" :auto-upload="true"
                            :show-file-list="false" :before-upload="beforeAvatarUpload">
                            <img v-if="form.icon_base64" :src="form.icon_base64" class="!w-20 !h-20 rounded-lg" />
                            <div v-else
                                class="!w-20 !h-20 flex justify-center items-center border border-solid rounded-lg">
                                <el-icon :size="30">
                                    <Plus />
                                </el-icon>
                            </div>
                        </el-upload>
                    </div>
                </template>
            </el-form-item>
        </el-form>
    </ElDialog>
</template>

<script setup lang="ts">
import { ElMessage, UploadProps } from 'element-plus'
import { reactive } from 'vue'

const props = defineProps({
    dialogVisible: { type: Boolean, default: false },
    itemData: { type: Object, default: {} },
})
const emit = defineEmits(['close'])

const defaultForm = {
    category: '',
    icon_base64: '',
    name: '',
}
const form = reactive({ ...defaultForm })
const rules = reactive({

})

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('图片格式必须得是png/jep/jpg');
        return false;
    }
    // else if (rawFile.size / 1024 / 1024 > 1) {
    //     ElMessage.error('图片大小不能超过1MB!');
    //     return false;
    // }
    return true;
};

const uploadHttpClose = async ({ file }) => {
    // const res: any = await fileUpload(file);
    // if (res.success) {
    //     form.icon = res.data.url
    //     ElMessage({ type: 'success', message: '图片上传成功！' });
    // } else {
    //     ElMessage.error(res.msg)
    // }
};

const onClose = () => {
    emit('close')
}
</script>