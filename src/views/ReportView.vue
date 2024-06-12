<template>
  <div style="margin: 0 auto; width: 50%;">
    <NavBar/>
    <a-card>
      <a-page-header title="Reports"/>
      <a-list :data="reports">
        <a-list-item v-for="item in reports" :key="item.time">
          <a-list-item-meta
              :title="item.title"
              :description="item.description"
          />
          <template #description>
            <div>
              <p>{{ item.description }}</p>
              <p style="color: gray; font-size: 12px;">{{ item.time }}</p>
              <p style="color: gray; font-size: 12px;">Author: {{ item.author }}</p>
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

const reports = ref([
  {
    id: 1,
    title: 'Quarterly Financial Report',
    description: 'An overview of the financial performance for the last quarter.',
    time: '2024-06-01 10:00 AM',
    author: 'John Doe',
  },
  {
    id: 2,
    title: 'Market Analysis Report',
    description: 'Detailed analysis of the current market trends and predictions.',
    time: '2024-05-28 02:30 PM',
    author: 'Jane Smith',
  },
  {
    id: 3,
    title: 'Project Status Report',
    description: 'Current status and progress of the ongoing projects.',
    time: '2024-05-25 11:15 AM',
    author: 'Emily Johnson',
  },
  {
    id: 4,
    title: 'Annual Performance Report',
    description: 'A comprehensive report on the performance metrics for the year.',
    time: '2024-05-20 09:45 AM',
    author: 'Michael Brown',
  },
  {
    id: 5,
    title: 'Customer Feedback Report',
    description: 'Compilation and analysis of customer feedback and suggestions.',
    time: '2024-05-15 04:50 PM',
    author: 'Olivia Wilson',
  },
  {
    id: 6,
    title: 'Sales Report',
    description: 'Sales performance and revenue generated for the last quarter.',
    time: '2024-05-10 01:20 PM',
    author: 'David Lee',
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
