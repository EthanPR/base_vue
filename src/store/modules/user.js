
const user = {
    state: {},
    mutations: {
        logout (state, vm) {
            localStorage.clear();
            // 恢复默认样式
        }
    }
};

export default user;
