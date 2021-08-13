<template>
    <FormModel v-bind="getBindValue" v-model="formModel" ref="ruleForm">
        <ARow v-bind="getRow">
            <slot name="formHeader"></slot>
            <template v-for="item in computedItems">
                <ACol v-bind="realColProps(item)" :key="item.field">
                    <FormItem :label="item.label" :prop="item.field">
                        <RenderContent
                            slot="label"
                            v-if="item.labelRender"
                            :render="item.labelRender"
                            :data="item"
                        ></RenderContent>
                        <slot :name="item.slot" v-bind="{ item }">
                            <component
                                v-if="item.component"
                                :is="item.component"
                                :ref="item.ref || item.field"
                                v-model="formModel[item.field]"
                                :formModel="formModel"
                                :param="item"
                                :placeholder="item.props.placeholder || placeholder(item)"
                                v-bind="item.props"
                                v-on="item.listeners"
                            >
                            </component>
                            <span v-else>{{ data[item.field] }}</span>
                        </slot>
                    </FormItem>
                </ACol>
            </template>
            <slot name="formFooter"></slot>
        </ARow>
    </FormModel>
</template>

<script>
import { FormModel, } from "ant-design-vue"
// import FormItem from './components/FormItem.vue';

// 表单字段格式化
const RenderContent = {
    props: {
        render: Function,
        formatter: Function, // 格式化数据
        data: Object,
        prop: String,
    },
    render (h) {
        if (this.render) {
            return this.render(h, this.data);
        }
        let value = this.data[this.prop];
        if (this.formatter) {
            value = this.formatter(value, this.data);
        }
        return <span>{value}</span>;
    },
};

export default {
    name: 'BaseForm',
    props: {
        formModel: Object,
        formItems: Array,
        baseRowStyle: Object,
        rowProps: Object
    },
    components: { FormModel, FormItem: FormModel.Item, RenderContent },
    data () {
        return {
            schemaRef: null,
        }
    },
    computed: {
        getBindValue () {
            let formConfig = {
                labelCol: {  span: 6 },
                wrapperCol: { span: 18 },
            }
            return { ...formConfig, ...this.$attrs, ...this.$props, rules: this.rules }
        },
        computedItems () {
            const itemResult = [];
            for (const item of this.formItems) {
                // 剩余参数语法允许我们将一个不定数量的参数表示为一个数组。theArgs
                let { component, showIf, prop, props = {}, ...theArgs } = item;
                if ((typeof showIf === "function" && !showIf(this.data)) || (typeof showIf === "boolean" && showIf)) {
                    continue;
                }
                if (typeof props === "function") {
                    props = props(this.data);
                }
                if (component === "label") {
                    props = {
                        ...props, //props值
                        data: this.data, //form值
                        prop, //验证值
                    };
                }
                // if (alias[component]) {
                //     //如果存在这个值渲染处理
                //     props = {
                //         ...alias[component].props,
                //         ...props,
                //     };
                //     component = alias[component].component; //得出对应属性
                // }
                itemResult.push({
                    component,
                    prop,
                    props,
                    ...theArgs,
                });
            }
            return itemResult
        },
        rules () {
            let rules = this.computedItems.reduce((total, item) => {
                var type = Object.prototype.toString.call(item.rules).replace(/\[object\s|\]/g, "");
                if (item.rules) {
                    let rules = item.rules;
                    if (typeof rules === "function") {
                        rules = rules(this.data);
                    }
                    total[item.prop] = rules;
                } else if (type != "Boolean") {
                    let rules;
                    switch (item.component) {
                        case "AInput":
                            rules = [{ required: true, trigger: "blur", message: `请输入${item.label}` }];
                            break;
                        default:
                            rules = [{ required: true, trigger: "change", message: `请选择${item.label}` }];
                            break;
                    }
                    total[item.prop] = rules;
                }
                return total;
            }, {});
            return rules;
        },
        getRow () {
            const { baseRowStyle = {}, rowProps } = this.getBindValue;
            return {
                style: baseRowStyle,
                ...rowProps,
            };
        },

    },
    mounted () {
        console.log(this);
    },
    methods: {
        handleSubmit () {
        },
        realColProps ({ colProps = {} }) {
            const { baseColProps = {} } = this.getBindValue;
            const realColProps = { ...baseColProps, ...colProps };
            return realColProps
        },
        placeholder (item) {
            switch (item.component) {
                case "AInput":
                    return `请输入${item.label}`;
                default:
                    return `请选择${item.label}`;
            }
        },

    },

}
</script>

<style>
</style>