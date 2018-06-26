export default function ({redirect, route, store}) {
  console.log(route.path)
  if (route.path.startsWith('/customManager/potentialCustom/') && route.path !== '/customManager/potentialCustom/') store.state.currentPathIdx = '1-1'
}