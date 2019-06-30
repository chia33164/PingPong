import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import recordForm from '@/components/RecordForm'
import Exam from '@/components/Exam'
import databoard from '@/components/getData'
import animation from '@/components/Animation'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/recordform',
      name: 'recordForm',
      component: recordForm
    },
    {
      path: '/exam',
      name: 'exam',
      component: Exam
    },
    {
      path: '/databoard',
      name: 'databoard',
      component: databoard
    },
    {
      path: '/animation',
      name: 'animation',
      component: animation
    }
  ]
})
