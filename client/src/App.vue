<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

import data_api from './store/data_api';

export default {
    name: 'App',
    components: {

    },
    mounted() {
        let self = this;
        let state = this.$store.getters.get_state;
        // console.log(state);
        // data_api.get_session().then(resp => {
        //     resp.json().then(data => {
        //         if (data.hasOwnProperty("first_name")) {
        //             self.$store.commit('update_first_name', data.first_name);
        //         }
        //         if (data.hasOwnProperty("last_name")) {
        //             self.$store.commit('update_last_name', data.last_name);
        //         }
        //         if (data.hasOwnProperty("email")) {
        //             self.$store.commit("update_email", data.email);
        //         }
        //     })
        // })
    }
}
</script>

