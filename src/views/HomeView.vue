<template>
  <div style="margin: 0 auto; width: 50%;">
    <NavBar/>
    <div>
      <a v-if="!is_login" @click="showSignInDialog = true">Sign In</a>
    </div>
    <div class="content">
      <h1>Welcome to the Project Management System</h1>
      <p>Use the navigation above to access different modules.</p>
    </div>
    <a-modal
        v-model:visible="showSignInDialog"
        title="Sign In"
        @ok="handleSignIn"
        @cancel="resetDialog"
    >
      <div>
        <a-input
            v-model="username"
            placeholder="username"
            style="margin-bottom: 10px;"
        />
        <a-input-password
            v-model="password"
            placeholder="password"
            style="margin-bottom: 10px;"
        />
        <a-space>
          <a-button type="primary" @click="handleSignIn">Sign in</a-button>
        </a-space>
        <div v-if="feedback" style="margin-top: 10px;">{{ feedback }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import NavBar from '@/components/NavBar.vue';
import {Modal} from "@arco-design/web-vue";
import {list_user} from "@/api/userMG";

const showSignInDialog = ref(false);
const username = ref('');
const password = ref('');
const feedback = ref('');
const is_login = ref(false)
is_login.value = localStorage.getItem("is_login") === "true"
const handleSignIn = async () => {
  try {
    const response = await list_user();
    const users = response.data;
    console.log(users)
    const user = users.find(user => user.username === username.value);

    if (user) {
      if (user.password === password.value) {
        feedback.value = 'Sign in Success！';
        // 根据用户角色存储相应信息，例如：

        localStorage.setItem('is_login', true);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('user_name', user.username);
        localStorage.setItem('project_id', user.projectId);
        is_login.value = true
        // 跳转到相应的页面
        // router.push('/dashboard');
        showSignInDialog.value = false
        Modal.success({
          content: "Sign in Success!"
        })
      } else {
        feedback.value = 'Wrong username or password!';
      }
    } else {
      feedback.value = 'User not found!';
    }
  } catch (error) {
    feedback.value = 'There was an error during the sign-in process!';
  }
};

const resetDialog = () => {
  username.value = '';
  password.value = '';
  feedback.value = '';
  showSignInDialog.value = false;
};
</script>

<style scoped>
/* 根据需要添加样式 */
</style>
