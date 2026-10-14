import { hydrate, mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { initRouter } from './lib/router.svelte'

initRouter()

const target = document.getElementById('app')!
// Built pages arrive prerendered, so hydrate them. In `pnpm dev` the container is empty.
const app = target.hasChildNodes() ? hydrate(App, { target }) : mount(App, { target })

export default app
