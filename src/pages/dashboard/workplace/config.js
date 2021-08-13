// 列表数据
export const columns = [
    {
        title: '部门Id',
        dataIndex: 'pkId',
    },
    {
        title: '部门名称',
        dataIndex: 'name',
    },
    {
        title: '行政编码',
        dataIndex: 'administrativeDivisionCode',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 180,
    },
];
// 操作
export const actionColumn = [];
// 修改密码
export const pswdSchemas = [];
// 搜索
export const searchSchema = [
    {
        field: 'departName',
        label: '部门名称',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'pkId',
        label: '部门id',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'administrationCode',
        label: '行政编码',
        component: 'Input',
        colProps: {
            span: 12,
        },
    },
];

// 新增 修改 表单
export const formSchema = [
    {
        field: 'name',
        label: '部门名称',
        component: 'AInput',
        required: true,
        colProps: {
            span: 12,
        },
    },
    {
        field: 'orgType',
        label: '类型',
        component: 'ASelect',
        defaultValue: 1,
        colProps: {
            span: 12,
        },
        componentProps: {
            options: [
                {
                    value: 1,
                    label: "部门",
                  },
                  {
                    value: 2,
                    label: "区域",
                  },
            ],
        },
    },
    {
        field: 'shortName',
        label: '部门简称',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'fName',
        label: '上级部门',
        component: 'AInput',
        colProps: {
            span: 12,
        },
        componentProps:{
            disabled:true
        }
    },
    {
        field: 'telephone',
        label: '联系方式',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'zipCode',
        label: '邮编',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'address',
        label: '部门地址',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'managerName',
        label: '负责人',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'orgCode',
        label: '机构代码',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'remarks',
        label: '部门备注',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'administrativeDivisionCode',
        label: '行政区划编码',
        component: 'AInput',
        colProps: {
            span: 12,
        },
    },
    {
        field: 'shielding',
        label: '是否屏蔽',
        component: 'ASelect',
        defaultValue: 0,
        colProps: {
            span: 12,
        },
        componentProps: {
            options: [
                {
                    value: 0,
                    label: "是",
                  },
                  {
                    value: 1,
                    label: "否",
                  },
            ],
        },
    },

];

// 详情
export const detailSchema = formSchema.map((item) => ({
    field: item.field,
    label: item.label,
}));
