import core from '@/core'

const _ = core.helpers

const messageMap: any = {
  desc: '备注',
  default: '实例',
  maximum: '最大值',
  minimum: '最小值',
  maxItems: '最大数量',
  minItems: '最小数量',
  maxLength: '最大长度',
  minLength: '最小长度',
  enum: '枚举',
  enumDesc: '枚举备注',
  uniqueItems: '元素是否都不同',
  itemType: 'item 类型',
  format: 'format',
  itemFormat: 'format',
  mock: 'mock'
}

export default {
  messageMap,

  tableHeader: [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      render: (text: unknown, item: any) => {
        return text === 'array'
          ? `<span>${item.sub ? item.sub.itemType || '' : 'array'} []</span>`
          : `<span>{text}</span>`
      }
    },
    {
      title: '是否必须',
      dataIndex: 'requiredName',
      width: 80,
      render: (text: unknown) => {
        return `<div>${text ? '必须' : '非必须'}</div>;`
      }
    },
    {
      title: '默认值',
      dataIndex: 'default',
      width: 80,
      render: (text: unknown) => {
        return `<div>${_.isBoolean(text) ? text + '' : text}</div>`
      }
    },
    {
      title: '备注',
      dataIndex: 'desc',
      render: (text: any, item: any) => {
        return _.isUndefined(item.childrenDesc)
          ? `<span className="column-desc">${text}</span>`
          : `<span className="column-desc">${item.childrenDesc}</span>`
      }
    },
    {
      title: '其他信息',
      dataIndex: 'sub',
      width: 180,
      render: (text: string, record: any) => {
        const result = text || record

        return Object.keys(result).map((item) => {
          const name = messageMap[item]
          const value = result[item]
          const isShow = !_.isUndefined(result[item]) && !_.isUndefined(name)

          return (
            isShow &&
            `<p>
                <span style="font-weight: 700;">${name}: </span>
                <span>${value.toString()}</span>
              </p>`
          )
        })
      }
    }
  ]
}
