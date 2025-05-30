/*
 * @Description: 新tab页，入口
 * @Author: MADAO
 * @Date: 2025-05-30 10:46:49
 * @LastEditors: MADAO
 * @LastEditTime: 2025-05-30 10:47:23
 */
import { mount } from 'svelte';
import '~/assets/styles/tailwind.css';

import App from './App.svelte';
import './index.css';

const app = mount(App, {
  target: document.getElementById('app') as HTMLDivElement,
});

export default app;