<template>
  <div style="margin: 0 auto; width: 50%;">
    <NavBar/>
    <div>
      <a-card>
        <a-button v-if="role==='Admin'" type="primary" @click="showUserModal = true">Add User</a-button>
      </a-card>
      <a-card>
        <a-table :columns="columns" :data="users" style="height: 70vh">
          <template v-if="role==='Admin'" #project="{record}">
            <a-dropdown @select="(value) => selectProject(value, record)" :popup-max-height="false"
                        v-model="record.projectId">
              <a-button>
                {{ record.project !== null ? record.project.name : "No Project" }}
                <icon-down/>
              </a-button>
              <template #content>
                <a-doption v-for="project in projects" :value="project.id" :key="project.id">
                  {{ project.name }}
                </a-doption>
              </template>
            </a-dropdown>
          </template>
          <template v-else #project="{record}">
            <a-dropdown @select="(value) => selectProject(value, record)" :popup-max-height="false"
                        v-model="record.projectId" disabled>
              <a-button>
                {{ record.project !== null ? record.project.name : "No Project" }}
                <icon-down/>
              </a-button>
              <template #content>
                <a-doption v-for="project in projects" :value="project.id" :key="project.id">
                  {{ project.name }}
                </a-doption>
              </template>
            </a-dropdown>
          </template>
        </a-table>
      </a-card>
      <a-card>
        <div ref="chart" style="height: 400px;"></div>
      </a-card>
    </div>
    <!--   add user modal-->
    <a-modal v-model:visible="showUserModal" title="Add User" @ok="handleAddUser">
      <a-form :model="newUser" layout="vertical">
        <a-form-item label="User Name">
          <a-input v-model="newUser.username"/>
        </a-form-item>
        <a-form-item label="Password">
          <a-input-password v-model="newUser.password"/>
        </a-form-item>
        <a-form-item label="Email">
          <a-input v-model="newUser.email"/>
        </a-form-item>
        <a-form-item label="Role">
          <a-select v-model="newUser.role">
            <a-option value="PL">PL</a-option>
            <a-option value="Dev">Dev</a-option>
            <a-option value="Tester">Tester</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Assign to Project">
          <a-select v-model="newUser.projectId">
            <a-option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import * as echarts from 'echarts';
import NavBar from '../components/NavBar.vue';
import {create_user, list_user, update_user} from "@/api/userMG";
import {list_projects} from "@/api/projectMG";

const showUserModal = ref(false);
const projects = ref([])
const newUser = ref({username: '', password: '', email: '', role: '', projectId: null});
const is_login = ref(false);
const role = ref("")
role.value = localStorage.getItem('role')
is_login.value = localStorage.getItem('is_login') === 'true';
const handleAddUser = async () => {
  await create_user(newUser.value);
  await fetchUsers()
  newUser.value = {}
  showUserModal.value = false;
};

// table
const users = ref([]);
const fetchUsers = async () => {
  const res = await list_user();
  users.value = res.data
}
const columns = ref([
  {title: 'ID', dataIndex: 'id'},
  {title: 'username', dataIndex: 'username'},
  {title: 'email', dataIndex: 'email'},
  {title: 'project', dataIndex: 'projectId', slotName: 'project'},
  {title: 'role', dataIndex: 'role'},
]);
// dropdown in table, update the projectId of selected user
const selectProject = async (id, data) => {
  data.projectId = id
  await update_user(data.id, data)
  await fetchUsers()
};
// chart
const chart = ref(null);

const initChart = () => {
  const myChart = echarts.init(chart.value);
  const options = {
    title: {
      text: 'User Issues Chart'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Number of Issues']
    },
    xAxis: {
      type: 'category',
      data: ['Issue 1', 'Issue 2', 'Issue 3']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Number of Issues',
        type: 'bar',
        data: [12, 19, 3],
        itemStyle: {
          color: function (params) {
            const colors = ['#ff6384', '#36a2eb', '#ffce56'];
            return colors[params.dataIndex % colors.length];
          }
        }
      }
    ]
  };
  myChart.setOption(options);
};

onMounted(async () => {
  initChart();
  await fetchUsers()
  projects.value = await list_projects();
});
</script>

<style>
.project-container {
  padding: 20px;
}

.project-card {
  margin-bottom: 20px;
}
</style>
