import { requireUtil } from "../../../core";

let commands = requireUtil.includeAll({
  dirname: __dirname,
  filter: /(.+Command)\.js$/,
});

export default Object.values(commands).map((cmd: any) => {
  return new cmd();
});
