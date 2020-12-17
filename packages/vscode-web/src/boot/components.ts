import { App } from 'vue'
import { Row, Col, Layout, Button, Table, Tabs, Card, Tree, Input } from 'ant-design-vue'

import { SectionCard, SectionTabs } from '@/components/section'

export default function registerComponents(app: App<Element>) {
  app.use(Row)
  app.use(Col)
  app.use(Layout)
  app.use(Button)
  app.use(Table)
  app.use(Tabs)
  app.use(Card)
  app.use(Tree)
  app.use(Input)

  app.component('section-card', SectionCard)
  app.component('section-tabs', SectionTabs)
}
