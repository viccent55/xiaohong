// 下拉菜单选项

export interface DropdownItem {
  type?: 'link' | 'text'
  divided?: boolean
  label?: string
  href?: string
  loginRequired?: boolean
}

// 底部/侧面导航选项
export interface NavigationItem {
  type: 'router-link' | 'external-link'
  label: string
  icon: string
  href: string
}

//浏览频道选项
export interface ExploreChannelItem {
  label: string
  value: string
}

export interface ExploreFLoatSetItem {
  icon: string
  label: string
  active: boolean
}
