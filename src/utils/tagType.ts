import type {TagProps} from 'element-plus';

const typeGroupMap = {
    primary: ['DRAFT', 'IGNORED'],
    success: ['PUBLISHED', 1, true, 'ENABLE', 'LISTED', 'YES', 'OPEN', 'UNFROZEN','NORMAL'],
    danger: ['OFFLINE', 0, false, 'DISABLE', 'DELISTED', 'NO', 'CLOSE', 'FROZEN'],
    warning: ['DELISTING', 2, 3, 'UNHANDLED'],
};

export const tagType = (type: string|boolean): NonNullable<TagProps['type']> => {
    for (const key in typeGroupMap) {
        if (typeGroupMap[key as NonNullable<TagProps['type']>].includes(type)) {
            return key as NonNullable<TagProps['type']>;
        }
    }
    return 'info';
};