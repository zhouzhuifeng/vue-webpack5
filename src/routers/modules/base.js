export default [
    { path: '/', component: () => import('../../views/Home') },
    { path: '/foo', component: () => import('../../views/Foo') },
    { path: '/bar', component: () => import('../../views/Bar') },
    { path: '/car', component: () => import('@/views/Car') }
]
