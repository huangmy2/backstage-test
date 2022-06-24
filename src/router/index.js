import Vue from 'vue'
import Router from 'vue-router'
import addVideo from '@/components/addVideo'
import Layout from '@/layout'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: () => import('@/page/login/index'),
      hidden: true
    },
    {
      path: '/404',
      component: () => import('@/page/notfound/index'),
      hidden: true
    },
    {
      path: '/',
      component: Layout,
      meta: { title: 'STOCK', icon: 'stock' },
      children: [
        {
          path: '/addVideo',
          name: 'addVideo',
          component: addVideo,
          meta: { title: '视频发布', icon: 'upload' }
        },
        {
          path: '/',
          component: () => import('@/page/child'),
          meta: { title: '视频管理', icon: 'tree' },
          children: [
            {
              path: '/videoList',
              name: 'videoList',
              component: () => import('@/page/video/videoBox'),
              meta: { title: '视频列表', icon: 'video' }
            },
            {
              path: '/timeVideoList',
              name: 'timeVideoList',
              component: () => import('@/page/video/timeVideoBox'),
              meta: { title: '定时视频列表', icon: 'video' }
            },
            {
              path: '/videoReportList',
              name: 'videoReportList',
              component: () => import('@/page/video/videoReportList'),
              meta: { title: '视频举报', icon: 'videoReport' }
            },
            {
              path: '/editVideo',
              name: 'editVideo',
              component: () => import('@/page/video/editVideo'),
              meta: { title: '视频编辑', icon: 'editVideo' },
              hidden: true
            },
            {
              path: '/transferVideo',
              name: 'transferVideo',
              component: () => import('@/page/video/components/transfer'),
              meta: { title: '转评赞', icon: 'transferVideo' },
              hidden: true
            }
          ]
        },
        {
          path: '/',
          component: () => import('@/page/child'),
          meta: { title: '话题管理', icon: 'tree' },
          children: [
            {
              path: '/talkList',
              name: 'talkList',
              component: () => import('@/page/talk/talkList'),
              meta: { title: '话题列表', icon: 'talk' }
            },
            {
              path: '/talkHotList',
              name: 'talkHotList',
              component: () => import('@/page/talk/talkHotList'),
              meta: { title: '本周热门话题', icon: 'talk' }
            },
            {
              path: '/topicVideoList/:id',
              name: 'topicVideoList',
              component: () => import('@/page/talk/topicVideoList'),
              meta: { title: '话题详情列表', icon: 'talk' },
              hidden: true
            }
          ]
        },
        {
          path: '/',
          component: () => import('@/page/child'),
          meta: { title: '评论管理', icon: 'tree' },
          children: [
            {
              path: '/comment/commentList',
              name: 'comment',
              component: () => import('@/page/comment/commentList'),
              meta: { title: '评论列表', icon: 'comment' }
            },
            {
              path: '/comment/reportList',
              name: 'reportList',
              component: () => import('@/page/comment/reportList'),
              meta: { title: '举报管理', icon: 'report' }
            }
          ]
        },
        {
          path: '/',
          component: () => import('@/page/child'),
          meta: { title: '用户管理', icon: 'tree' },
          children: [
            {
              path: '/userList',
              name: 'userList',
              component: () => import('@/page/user/userList'),
              meta: { title: '账号信息', icon: 'user' }
            },
            {
              path: '/userCheck',
              name: 'userCheck',
              component: () => import('@/page/user/userCheck'),
              meta: { title: '头像昵称审核', icon: 'userCheck' }
            },
            {
              path: '/userFeedback',
              name: 'userFeedback',
              component: () => import('@/page/user/userFeedback'),
              meta: { title: '用户反馈', icon: 'feedback' }
            },
            {
              path: '/addUser',
              name: 'addUser',
              component: () => import('@/page/user/addUser'),
              meta: { title: '新增账号', icon: 'adduser' }
            }
          ]
        },
        {
          path: '/',
          component: () => import('@/page/child'),
          meta: { title: '推送管理', icon: 'tree' },
          children: [
            {
              path: '/createPush',
              name: 'createPush',
              component: () => import('@/page/push/createPush'),
              meta: { title: '新建推送', icon: 'user' }
            },
            {
              path: '/newsList',
              name: 'newsList',
              component: () => import('@/page/push/newsList'),
              meta: { title: '资讯列表', icon: 'userCheck' }
            },
            {
              path: '/pushHistory',
              name: 'pushHistory',
              component: () => import('@/page/push/pushHistory'),
              meta: { title: '推送历史', icon: 'feedback' }
            }
          ]
        }
      ]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
  ]
})
