const custom = {
  stage: "${opt:stage, self:provider.stage}",
  region: "${opt:region, self:provider.region}",
}

export default custom;
