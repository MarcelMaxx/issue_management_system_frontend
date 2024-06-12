<template>
  <div style="margin: 0 auto; width: 50%;">
    <NavBar/>
    <a-card>
      <a-page-header title="NotificationView"/>
      <a-list :data="notifications">
        <a-list-item v-for="item in notifications" :key="item.time">
          <a-list-item-meta
              :title="item.title"
              :description="item.description"
          />
          <template #description>
            <div>
              <p>{{ item.description }}</p>
              <p style="color: gray; font-size: 12px;">{{ item.time }}</p>
            </div>
          </template>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import NavBar from '../components/NavBar.vue';

const notifications = ref([
  {
    title: 'New Comment',
    description: 'You have a new comment on your issue.',
    time: '2024-06-12 10:30 AM',
  },
  {
    title: 'Issue Assigned',
    description: 'An issue has been assigned to you.',
    time: '2024-06-11 03:45 PM',
  },
  {
    title: 'Issue Resolved',
    description: 'Your reported issue has been resolved.',
    time: '2024-06-10 09:15 AM',
  },
  {
    title: 'New Issue Created',
    description: 'A new issue has been created in your project.',
    time: '2024-06-09 01:20 PM',
  },
  {
    title: 'System Maintenance',
    description: 'The system will undergo maintenance from 12:00 AM to 2:00 AM.',
    time: '2024-06-08 11:00 AM',
  },
  {
    title: 'Password Change',
    description: 'Your password has been successfully changed.',
    time: '2024-06-07 04:50 PM',
  },
  {
    title: 'Profile Updated',
    description: 'Your profile information has been updated.',
    time: '2024-06-06 08:30 AM',
  },
]);
</script>

<style>
.project-container {
  padding: 20px;
}

.project-card {
  margin-bottom: 20px;
}

a-card {
  margin-top: 20px;
}

a-page-header {
  background-color: #f5f5f5;
  padding: 16px;
}

a-list-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
}

a-list-item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

a-list-item-meta .ant-list-item-meta-description {
  font-size: 14px;
}

a-list-item-meta .ant-list-item-meta-title {
  font-size: 16px;
  font-weight: bold;
}
</style>
