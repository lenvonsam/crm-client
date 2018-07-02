export default function({
  redirect,
  route,
  store
}) {
  let idx = store.state.currentMenus.findIndex(itm => itm.subItems.findIndex(subItem => subItem === route.path))
  if (idx >= 0) {
    store.state.currentMenus.map((itm, idx) => {
      let subIdx = itm.subItems.findIndex(sim => route.path.startsWith(sim.url))
      if (subIdx >= 0) store.state.currentPathIdx = `${idx + 1}-${subIdx + 1}`
    })
  }
}