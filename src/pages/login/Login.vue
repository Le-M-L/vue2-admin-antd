<template>
    <div class="loginBox">
        <div class="container">
            <div>
                <div></div>
                <div>
                    <div class="container-form">
                        <h1 style="font-weight: 700">登录</h1>
                        <a-form-model ref="ruleForm" :rules="rules" v-bind="layout" :model="form">
                            <a-form-model-item ref="loginName" label="用户名" prop="loginName">
                                <a-input size="large" v-model="form.loginName" placeholder="请输入用户名" />
                            </a-form-model-item>

                            <a-form-model-item ref="password" label="密码" prop="password">
                                <a-input
                                    size="large"
                                    type="password"
                                    v-model="form.password"
                                    placeholder="请输入密码"
                                />
                            </a-form-model-item>

                            <a-row>
                                <a-col :span="12">
                                    <a-form-model-item :wrapper-col="{ span: 16, offset: 8 }" prop="type">
                                        <a-checkbox-group v-model="form.type">
                                            <a-checkbox value="1" name="type"> 记住我 </a-checkbox>
                                        </a-checkbox-group>
                                    </a-form-model-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-model-item :wrapper-col="{ span: 20, offset: 4 }" prop="type">
                                        <div style="text-align: right">
                                            <AButton type="link" size="small"> 忘记密码? </AButton>
                                        </div>
                                    </a-form-model-item>
                                </a-col>
                            </a-row>

                            <a-form-model-item :wrapper-col="{ span: 24 }">
                                <div style="display: flex">
                                    <a-button style="flex: 1" type="primary" size="large" @click="onSubmit">
                                        登录
                                    </a-button>
                                </div>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { login, login1, getRoutesConfig, getModule } from '@/services/user';
    import { setAuthorization } from '@/utils/request';
    import { loadRoutes } from '@/utils/routerUtil';
    import { mapMutations } from 'vuex';
    import sha1 from 'sha1';
    export default {
        name: 'Login',
        data() {
            return {
                logging: false,
                error: '',
                form: {
                    loginName: 'admin',
                    password: '888888',
                },
                rules: {
                    loginName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
                layout: {
                    labelCol: { span: 4 },
                    wrapperCol: { span: 20 },
                },
            };
        },
        created() {},
        methods: {
            ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
            onSubmit() {
                this.$refs.ruleForm.validate(async (valid) => {
                    if (valid) {
                        this.logging = true;
                        const name = this.form.loginName;
                        const password = this.form.password;
                        login(name, password).then(this.afterLogin);
                        login1(name, sha1(password)).then(this.afterLogin);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            afterLogin(res) {
                this.logging = false;
                const loginRes = res.data;
                if (loginRes.code >= 0) {
                    const { user, permissions, roles } = loginRes.data;
                    this.setUser(user); //设置登录信息
                    this.setPermissions(permissions); //设置权限
                    this.setRoles(roles);
                    //设置认证信息  设置生效时间  默认设置七天登录时间
                    let days = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
                    setAuthorization({ token: loginRes.data.token, expireAt: new Date(days) });
                    // 获取路由配置
                    getModule();

                    getRoutesConfig().then((result) => {
                        const routesConfig = result.data.data;
                        console.log(routesConfig);
                        loadRoutes(routesConfig);
                        this.$router.push('/dashboard/workplace');
                        this.$message.success(loginRes.message, 3);
                    });
                } else {
                    this.error = loginRes.message;
                }
            },
        },
    };
</script>
<style lang="less" scoped>
    .loginBox {
        position: relative;
        width: 100%;
        height: 100%;
        @media (max-width: '1200px') {
            background-color: #293146;
            .loginBox-form {
                background-color: #fff;
            }
        }
        &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            margin-left: -48%;
            background-image: url('~@/assets/svg/login-bg.svg');
            background-position: 100%;
            background-repeat: no-repeat;
            background-size: auto 100%;
            content: '';
            @media (max-width: '1200px') {
                display: none;
            }
        }
        .container {
            height: 100%;
            padding: 8px 40px;
            margin: 0 auto;
            > div {
                display: flex;
                height: 100%;
                > div:nth-child(1) {
                    overflow: hidden;
                    height: 100%;
                    padding-left: 16px;
                    margin-right: 16px;
                    width: 50%;
                }
                > div:nth-child(2) {
                    width: 50%;
                    height: auto;
                    display: flex;
                    .container-form {
                        position: relative;
                        width: 500px;
                        padding: 32px 20px;
                        border-radius: 6px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        margin: auto 0;
                    }
                }
            }
        }
    }
</style>
