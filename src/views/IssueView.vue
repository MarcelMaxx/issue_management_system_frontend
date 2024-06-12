<template>
  <div style="margin: 0 auto; width: 50%;">
    <NavBar/>
    <div class="content">
      <a-card>
        <a-button v-if="role==='Tester'" type="primary" @click="addNewIssue">Report Issue</a-button>
        <a-space>
          <a-form layout="inline">
            <a-form-item label="My Issues">
              <a-switch v-model="filter.isMine"/>
            </a-form-item>
            <a-form-item label="Status">
              <a-select v-model="filter.status" placeholder="Select status">
                <a-option value="all">All</a-option>
                <a-option value="new">New</a-option>
                <a-option value="assigned">Assigned</a-option>
                <a-option value="fixed">Fixed</a-option>
                <a-option value="resolved">Resolved</a-option>
                <a-option value="closed">Closed</a-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Priority">
              <a-select v-model="filter.priority" placeholder="Select priority">
                <a-option value="all">All</a-option>
                <a-option value="blocker">Blocker</a-option>
                <a-option value="critical">Critical</a-option>
                <a-option value="major">Major</a-option>
                <a-option value="minor">Minor</a-option>
                <a-option value="trivial">Trivial</a-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-space>
        <a-table :columns="columns" :data="filteredIssues" row-key="id" style="height: 70vh">
          <template #status="{ record }">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template #priority="{ record }">
            <a-tag :color="getPriorityColor(record.priority)">{{ record.priority }}</a-tag>
          </template>
          <template #new_comment="{ record }">
            <a-tag v-if="record.commentList.length !== 0">
              <a-input v-model="record.commentList[0].content" disabled/>
            </a-tag>
            <a-tag v-else disabled>
              <a-input default-value="No comments" disabled/>
            </a-tag>
          </template>
          <template #actions="{ record }">
            <a-button v-if="role==='PL'&&record.status==='new'" type="primary"
                      @click="openCommentDialog('assigned', record)">Assign
            </a-button>
            <a-button v-if="role==='Dev'&&record.status==='assigned'" type="primary"
                      @click="openCommentDialog('fixed', record)">Fixed
            </a-button>
            <a-button v-if="role==='Tester'&&record.status==='fixed'" type="primary"
                      @click="openCommentDialog('resolved', record)">Resolved
            </a-button>
            <a-button v-if="role==='PL'&&record.status==='resolved'" type="primary"
                      @click="openCommentDialog('closed', record)">Closed
            </a-button>
          </template>
        </a-table>
      </a-card>
      <a-modal
          v-model:visible="addIssueModalVisible"
          :title="modalTitle"
          @ok="submitIssue"
          @cancel="closeAddIssueModal"
          ok-text="Save"
          cancel-text="Cancel"
      >
        <a-form :model="currentIssue" layout="vertical">
          <a-form-item label="Title" required>
            <a-input v-model="currentIssue.title"/>
          </a-form-item>
          <a-form-item label="Description" required>
            <a-textarea v-model="currentIssue.description"/>
          </a-form-item>
          <a-form-item label="Comment" required>
            <a-textarea v-model="currentIssue.comment"/>
          </a-form-item>
          <a-form-item label="Status" required>
            <a-select v-model="currentIssue.status">
              <a-option value="new">New</a-option>
              <a-option value="assigned" disabled>Assigned</a-option>
              <a-option value="fixed" disabled>Fixed</a-option>
              <a-option value="resolved" disabled>Resolved</a-option>
              <a-option value="closed" disabled>Closed</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Priority" required>
            <a-select v-model="currentIssue.priority">
              <a-option value="blocker">Blocker</a-option>
              <a-option value="critical">Critical</a-option>
              <a-option value="major">Major</a-option>
              <a-option value="minor">Minor</a-option>
              <a-option value="trivial">Trivial</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
          v-model:visible="commentModalVisible"
          title="Enter Comment"
          @ok="submitComment"
          @cancel="closeCommentModal"
          ok-text="Submit"
          cancel-text="Cancel"
      >
        <a-form layout="vertical">
          <a-form-item v-if="is_login&&role==='PL'&&currentAction==='assigned'" label="Assigned to" required>
            <a-select v-model="fixer" placeholder="Please select ..." allow-clear>
              <a-option v-for="dev in dev_users" :key="dev.id" :value="dev.id">
                {{ dev.username }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Comment" required>
            <a-textarea v-model="comment"/>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import NavBar from '@/components/NavBar.vue';
import {create_comment, create_issue, get_issue_details, list_issues, update_issue} from '@/api/issueMG';
import {get_user_by_role} from "@/api/userMG";

const is_login = ref(false);
const role = ref("")
role.value = localStorage.getItem('role')
is_login.value = localStorage.getItem('is_login') === 'true';
const issues = ref([]);
const dev_users = ref([])
const currentIssue = ref({
  title: '',
  description: '',
  comment: '',
  status: 'new',
  priority: 'major',
  fixedId: 0,
  reporterId: 0,
  assigneeId: 0,
  projectId: 0,
});
const addIssueModalVisible = ref(false);
const modalTitle = ref('Create Issue');
const filter = ref({
  isMine: false,
  status: 'all',
  priority: 'all',
});

const fetchIssues = async () => {
  issues.value = await list_issues();
  if (is_login.value) {
    const res = await get_user_by_role("Dev")
    dev_users.value = res.data
  }
};

const filteredIssues = computed(() => {
  return issues.value.filter((issue) => {
    const matchesMine = !filter.value.isMine || issue.reporterId === localStorage.getItem('user_id');
    const matchesStatus = filter.value.status === 'all' || issue.status === filter.value.status;
    const matchesPriority = filter.value.priority === 'all' || issue.priority === filter.value.priority;
    return matchesMine && matchesStatus && matchesPriority;
  });
});

const submitIssue = async () => {
  if (is_login.value) {
    currentIssue.value.reporterId = localStorage.getItem('user_id');
    currentIssue.value.projectId = localStorage.getItem('project_id');
  }

  const res = await create_issue(currentIssue.value);
  await create_comment(res.id, {
    "content": currentIssue.value.comment,
    "commenterId": localStorage.getItem('user_id')
  })
  currentIssue.value = {
    title: '',
    description: '',
    comment: '',
    status: 'new',
    priority: 'major',
  };
  addIssueModalVisible.value = false;
  await fetchIssues();
};

const addNewIssue = () => {
  currentIssue.value = {
    title: '',
    description: '',
    comment: '',
    status: 'new',
    priority: 'major',
  };
  addIssueModalVisible.value = true;
  modalTitle.value = 'Add Issue';
};

const closeAddIssueModal = () => {
  addIssueModalVisible.value = false;
};

const commentModalVisible = ref(false);
const comment = ref('');
const fixer = ref('')
const currentAction = ref('');
const currentActionIssue = ref(null);

const openCommentDialog = (action, issue) => {
  currentAction.value = action;
  currentActionIssue.value = issue;
  comment.value = '';
  commentModalVisible.value = true;
};

const closeCommentModal = () => {
  commentModalVisible.value = false;
};

const submitComment = async () => {
  const issue = currentActionIssue.value;
  const userId = localStorage.getItem('user_id');
  if (!userId) return;

  if (currentAction.value === 'assigned') {
    issue.assigneeId = userId;
    const res = await get_issue_details(currentActionIssue.value.id)
    res.fixerId = fixer.value
    await update_issue(currentActionIssue.value.id, res)
  } else if (currentAction.value === 'fixed') {
    issue.fixedId = userId;
    currentAction.value = "resolved"
  }

  issue.status = currentAction.value;
  issue.commentList.push({
    content: comment.value,
    userId,
    issueId: issue.id,
  });

  await update_issue(issue.id, issue);
  await create_comment(issue.id, {
    "content": comment.value,
    "commenterId": localStorage.getItem('user_id')
  })
  commentModalVisible.value = false;
  await fetchIssues();
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

const columns = ref([
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    slotName: 'status',
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    slotName: 'priority',
  },
  {
    title: 'NewComment',
    dataIndex: 'new_comment',
    key: 'new_comment',
    slotName: 'new_comment',
  },
  {
    title: 'Actions',
    key: 'actions',
    slotName: 'actions',
  },
]);

onMounted(() => {
  fetchIssues();
});
</script>

<style scoped>
.content {
  margin-top: 20px;
}
</style>
