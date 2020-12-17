module.exports = {
  general: {
    links: [
      {
        label: '招投标开发文档',
        url: 'http://wiki.dev.ztosys.com/pages/viewpage.action?pageId=103262785'
      },
      {
        label: '招投标需求文档',
        url:
          'http://lanhu.ztosys.com/web/#/item/project/product?pid=7c523820-32c9-478a-a14d-4456631ba634&docId=30d4202f-7991-413d-974b-8c0605ac0d29&docType=axure&image_id=30d4202f-7991-413d-974b-8c0605ac0d29&pageId=4f742e3faf1049b7847209ec9ec49de4'
      },
      {
        label: '本地环境',
        url: 'http://localhost:8089'
      },
      {
        label: '测试环境',
        url: 'http://asset-test.fsharing.ft.ztosys.com/'
      },
      {
        label: '开发环境',
        url: 'http://asset-dev.fsharing.bd.ztosys.com'
      },
      {
        label: '权限管理',
        url: 'http://meta.test.ztosys.com/apps/ztpQH6ATW5WkqcDTInZSxH9A'
      },
      {
        label: '蓝湖',
        url: 'http://lanhu.ztosys.com/'
      },
      {
        label: 'Wiki',
        url: 'http://wiki.dev.ztosys.com/pages/viewpage.action?pageId=93283032'
      },
      {
        label: 'Git Lab',
        url: 'http://git.ztosys.com/fsharing/asset-web'
      },
      {
        label: 'Stellar',
        url: 'https://stellar.dev.ztosys.com/#/deliver/iteration'
      },
      {
        label: 'ZUI组件文档',
        url: 'http://framework.dev.ztosys.com/zui/#/zh-CN/component/quickstart'
      }
    ]
  },
  apiDoc: {
    codegen: {
      command: 'npm run codegen',
      jsonExport: true,
      jsonExportFolder: './codegen/json'
    },
    projects: [
      {
        name: '采购-招投标',
        token:
          'baf5edca1bb5f8d0b95ea093bf48f1ebe3748a08071b394614a8f4151b2106e9',
        codegen: {
          jsonExportName: 'bidApi.json'
        }
      },
      {
        name: '资产',
        token:
          'f733882d2434de67910a36e457b2ddfdede7f8918d4e1c3185024cee9c50ad16',
        codegen: {
          jsonExportName: 'assestApi.json'
        }
      },
      {
        name: '库存',
        token:
          '2d0dcdab745d022324f19539dcf9d325381e7f4e27c975662cd755e9dcff985d',
        codegen: {
          jsonExportName: 'inventoryApi.json'
        }
      },
      {
        name: '采购',
        token:
          'f36e43c2580087580bc341e107e4bf85b6532735e47e5d1bc8c8adfda79f0d44',
        codegen: {
          jsonExportName: 'purchaseApi.json'
        }
      },
      {
        name: '用户工作台',
        token:
          'e39ebcf5a9cacb7e1e6bffd90044e1e5135b779814af2d0ada89d59c4fc235b3',
        codegen: {
          jsonExportName: 'workbenchApi.json'
        }
      }
    ],
    apiTags: ['清空', '列表查询', '新增', '修改', '删除', '获取详情'],
    quickcode: {
      api: {
        '接口/权限名称': {
          apiDetail: false,
          body: ['{{ api_name api.path}}']
        },
        生成表格表头配置: {
          tag: ['列表查询'],
          body: [
            "{{#each (get (api_list api.resBody) 'items.properties') }}",
            "{{#if (nin @key 'id') }}",
            '{\r',
            "  label: '{{ this.description }}',\r",
            "  prop: '{{ @key }}'\r",
            '},\r',
            '{{/if}}',
            '{{/each}}'
          ]
        },
        表格查询FormData定义: {
          tag: ['列表查询'],
          body: [
            'formData: {{ api_obj_name api.path }}Request = {\r',
            '{{#each api.reqBody.properties}}',
            "{{#if (nin @key 'pageNum' 'pageSize') }}",
            '  {{ @key }}: {{ def_val this.type }},\r',
            '{{/if}}',
            '{{/each}}',
            '{{#if api.reqBody.properties.pageNum}}',
            '  pageNum: 1,\r',
            '  pageSize: this.GLOBAL.pagination.pageSize,',
            '{{/if}}\r',
            '}'
          ]
        }
      }
    }
  }
}
