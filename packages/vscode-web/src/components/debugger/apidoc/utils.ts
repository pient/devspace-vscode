import { ApiProjectService } from '@devspace/vscode-apidoc/src'

const _config = {
  url: '/yapi',
  token: 'f733882d2434de67910a36e457b2ddfdede7f8918d4e1c3185024cee9c50ad16'
}

export const apiProjectService = new ApiProjectService(_config)
