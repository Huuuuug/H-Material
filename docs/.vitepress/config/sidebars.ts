import componentLocale from '../json/page/component.json'

const getSidebars = () => {
  return {
    '/components/': getComponentsSideBar(),
  }
}

function getComponentsSideBar() {
  return Object.values(componentLocale).map((item) =>
    mapPrefix(item, '/components')
  )
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
