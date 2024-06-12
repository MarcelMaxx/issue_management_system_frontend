<template>
  <a-menu mode="horizontal" :selected-keys="[selectedKey]">
    <a-menu-item key="home">
      <router-link to="/">Home</router-link>
    </a-menu-item>
    <a-menu-item key="issue">
      <router-link to="/issue">Issue</router-link>
    </a-menu-item>
    <a-menu-item key="project">
      <router-link to="/project">Project</router-link>
    </a-menu-item>
    <a-menu-item key="user">
      <router-link to="/user">User</router-link>
    </a-menu-item>
    <a-menu-item key="report">
      <router-link to="/report">Report</router-link>
    </a-menu-item>
    <a-menu-item key="notification">
      <router-link to="/notification">Notification</router-link>
    </a-menu-item>
    <a-trigger v-if="is_login" position="top" auto-fit-position :unmount-on-close="false">
      <a-tag color="blue">{{ username }}</a-tag>
      <template #content>
        <div>
          <a-button @click="logout">退出登录</a-button>
        </div>
      </template>
    </a-trigger>
  </a-menu>

</template>

<script>
import {ref} from "vue";

export default {
  data() {
    return {
      selectedKey: 'home'
    };
  },
  watch: {
    $route(to) {
      this.selectedKey = to.path.substring(1) || 'home';
    }
  },
  setup() {
    const is_login = ref(false);
    const username = ref("")
    const role = ref("")
    username.value = localStorage.getItem('user_name')
    role.value = localStorage.getItem('role')
    is_login.value = localStorage.getItem('is_login') === 'true';
    const logout = () => {
      localStorage.clear()
      is_login.value = false
    }
    return {
      is_login,
      role,
      username,
      logout
    }
  },
  mounted() {
    this.selectedKey = this.$route.path.substring(1) || 'home';
  }
};
</script>

<style scoped>
a-menu {
  background: #000;
  color: #fff;
}

a-menu-item {
  color: #fff;
}

a-menu-item a {
  color: inherit;
}
</style>
