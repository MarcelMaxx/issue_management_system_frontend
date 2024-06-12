<template>
  <div style="margin: 0 auto; width: 50%;">
    <NavBar/>
    <div class="project-container">
      <a-button v-if="role==='Admin'" type="primary" @click="showProjectModal = true">Add Project</a-button>
      <a-card v-for="project in projects" :key="project.id" class="project-card" style="margin-top: 5px">
        <template #title>
          {{ project.name }}
        </template>
        <p>{{ project.description }}</p>
        <p>Start Date: {{ project.start_date }}</p>
        <p>End Date: {{ project.end_date }}</p>
        <a-divider>Issues</a-divider>
        <a-list v-if="project.issueList && project.issueList.length" item-layout="horizontal">
          <a-list-item v-for="issue in project.issueList" :key="issue.id">
            <a-list-item-meta :title="issue.title" :description="issue.description"/>
            <template #actions>
              <a-space style="align-items: center">
                <a-tag :color="getPriorityColor(issue.priority)">{{ issue.priority }}</a-tag>
                <a-tag :color="getStatusColor(issue.status)">{{ issue.status }}</a-tag>
                <a-button type="primary" @click="showIssueDetailDrawer(issue.id)">Details</a-button>
              </a-space>
            </template>
          </a-list-item>
        </a-list>
        <a-button v-if="role==='Admin'" type="danger" @click="deleteProject(project.id)">Delete</a-button>
      </a-card>
    </div>
    <a-modal v-model:visible="showProjectModal" title="Add Project" @ok="handleAddProject">
      <a-form :model="newProject" layout="vertical">
        <a-form-item label="Project Name">
          <a-input v-model="newProject.name"/>
        </a-form-item>
        <a-form-item label="Description">
          <a-input v-model="newProject.description"/>
        </a-form-item>
        <a-form-item label="Date Range">
          <a-range-picker v-model="newProject.dateRange" type="date"/>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer v-model:visible="issueDetailDrawerVisible" title="Issue Details" placement="right" width="600px">
      <div v-if="issueInDrawer">
        <p><strong>Title:</strong> {{ issueInDrawer.title }}</p>
        <p><strong>Description:</strong> {{ issueInDrawer.description }}</p>
        <p><strong>Priority:</strong>
          <a-tag :color="getStatusColor(issueInDrawer.priority)">{{ issueInDrawer.priority }}</a-tag>
        </p>
        <p><strong>Status:</strong>
          <a-tag :color="getPriorityColor(issueInDrawer.status)">{{ issueInDrawer.status }}</a-tag>
        </p>
        <p><strong>Reporter:</strong> {{ name_of_user.reporter }}</p>
        <p><strong>Assignee:</strong> {{ name_of_user.assignee }}</p>
        <p><strong>Fixed:</strong> {{ name_of_user.fixed }}</p>
        <p><strong>Project:</strong> {{ name_of_user.project }}</p>
        <a-divider>Comments</a-divider>
        <a-list v-if="issueInDrawer.commentList && issueInDrawer.commentList.length" item-layout="horizontal">
          <a-list-item v-for="comment in issueInDrawer.commentList" :key="comment.id">
            <a-list-item-meta :title="comment.content" :description="comment.createdAt"/>
          </a-list-item>
        </a-list>
        <a-empty v-else description="No comments."/>
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import NavBar from '../components/NavBar.vue';
import {create_project, delete_project, list_projects} from "@/api/projectMG";
import {Modal} from "@arco-design/web-vue";
import {get_issue_details} from "@/api/issueMG";
import {get_user_by_id} from "@/api/userMG";

const is_login = ref(false);
const role = ref("");
role.value = localStorage.getItem('role');
is_login.value = localStorage.getItem('is_login') === 'true';
const showProjectModal = ref(false);

const projects = ref([]);
const newProject = ref({name: '', description: '', dateRange: []});

const fetchProjects = async () => {
  projects.value = await list_projects();
};

const handleAddProject = async () => {
  newProject.value.start_date = newProject.value.dateRange[0];
  newProject.value.end_date = newProject.value.dateRange[1];

  const {start_date, end_date, ...projectData} = newProject.value;
  await create_project({start_date, end_date, ...projectData});

  await fetchProjects();
  showProjectModal.value = false;

};

const deleteProject = async (id) => {
  await delete_project(id);
  await fetchProjects();
  Modal.success({
    content: 'Delete Project Successfully'
  });
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'blocker':
      return 'black';
    case 'critical':
      return 'red';
    case 'major':
      return 'orange';
    case 'minor':
      return 'blue';
    case 'trivial':
      return 'green';
    default:
      return 'gray';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'new':
      return 'blue';
    case 'assigned':
      return 'orange';
    case 'fixed':
      return 'green';
    case 'resolved':
      return 'purple';
    case 'closed':
      return 'red';
    default:
      return 'gray';
  }
};

//
const issueInDrawer = ref({})
const issueDetailDrawerVisible = ref(false)
const name_of_user = ref({
  "reporter": "",
  "assignee": "",
  "fixer": "",
  "fixed": "",
})
const showIssueDetailDrawer = async (issueId) => {
  issueDetailDrawerVisible.value = true
  const res = await get_issue_details(issueId)
  if (res.reporterId !== null) {
    const response = await get_user_by_id(res.reporterId)
    name_of_user.value.reporter = response.data.username
  }
  if (res.assigneeId !== null) {
    const response = await get_user_by_id(res.assigneeId)
    name_of_user.value.assignee = response.data.username
  }
  if (res.fixerId !== null) {
    const response = await get_user_by_id(res.fixerId)
    name_of_user.value.fixer = response.data.username
  }
  if (res.fixedId !== null) {
    const response = await get_user_by_id(res.fixedId)
    name_of_user.value.fixed = response.data.username
  }
  issueInDrawer.value = res
}
onMounted(() => {
  fetchProjects();
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
