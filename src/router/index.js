import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import IssueView from '../views/IssueView.vue';
import ProjectView from '../views/ProjectView.vue';
import UserView from '../views/UserView.vue';
import ReportView from "@/views/ReportView.vue";
import NotificationView from "@/views/NotificationView.vue";

const routes = [
    {path: '/', component: HomeView},
    {path: '/issue', component: IssueView},
    {path: '/project', component: ProjectView},
    {path: '/user', component: UserView},
    {path: '/report', component: ReportView},
    {path: '/notification', component: NotificationView},
];
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
