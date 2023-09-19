import componentLocale from '../json/page/component.json'
import guideLocal from '../json/page/guide.json'

const getSidebars = () => {
  return {
    '/components/': getComponentsSideBar(),
    '/guide/': getGuideSideBar(),
  }
}
// components侧边栏
function getComponentsSideBar() {
  return Object.values(componentLocale).map((item) =>
    mapPrefix(item, '/components')
  )
}
// guide侧边栏
function getGuideSideBar() {
  return Object.values(guideLocal).map((item) => mapPrefix(item, '/guide'))
}

type Item = {
  text: string
  items?: Item[]
  link?: string
}

function mapPrefix(item: Item, prefix = '') {
  if (item.items && item.items.length > 0) {
    return {
      ...item,
      items: item.items.map((child) => mapPrefix(child, prefix)),
    }
  }
  return {
    ...item,
    link: `${prefix}${item.link}`,
  }
}

export const sidebars = getSidebars()
