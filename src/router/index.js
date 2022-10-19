import {createRouter, createWebHistory} from 'vue-router'
import ProjectPanelView from '@/views/ProjectPanelView'
import BookDataStoreView from '@/views/BookDataStoreView'
import UrlDataStoreView from "@/views/UrlDataStoreView";
import CategoryView from "@/views/CategoryView";

const routes = [
    {
        path: '/',
        component: ProjectPanelView
    }, {
        path: '/project',
        name: 'project',
        component: ProjectPanelView
    }, {
        path: '/bookDataStore',
        name: 'bookDataStore',
        component: BookDataStoreView
    }, {
        path: '/urlDataStore',
        name: 'urlDataStore',
        component: UrlDataStoreView
    }
    , {
        path: '/category',
        name: 'category',
        component: CategoryView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
