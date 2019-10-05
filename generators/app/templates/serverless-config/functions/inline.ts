import { IServerlessFunction } from "common-types";

const discordDeploymentList: IServerlessFunction = {
  handler: "src/handlers/discord/discordDeploymentList.handler",
  description: "Receives a list of deployments which are then converted to a Discord message and sent",
}

const discordNetlifyKickoff: IServerlessFunction = {
  handler: "src/handlers/discord/discordNetlifyKickoff.handler",
  description: "Takes the netlify message (from the conductor) and sends it to Discord to inform users.",
}

const discordReportBuildError: IServerlessFunction = {
  handler: "src/handlers/discord/discordReportBuildError.handler",
  description: "Accepts webhook messages from Netlify involving build errors and sends them to Discord.",
  events: [{"http":{"method":"post","path":"/notify/build-error","cors":true}}],
}

const netlifyEndState: IServerlessFunction = {
  handler: "src/handlers/discord/netlifyEndState.handler",
  description: "Sends a notification to Discord about having reached a final state (aka, error or success)",
}

const deployList: IServerlessFunction = {
  handler: "src/handlers/netlify/deployList.handler",
  description: "Get's a list of a site's deployments using Netlify's API",
}

const deploymentConductor: IServerlessFunction = {
  handler: "src/handlers/netlify/deploymentConductor.handler",
  description: "Receives Netlify Deploy webhooks and then orchestrates a response to Discord",
  memorySize: 1024,
  events: [{"http":{"method":"post","path":"notify/deploy"}}],
}

const netlifyDeployedBranches: IServerlessFunction = {
  handler: "src/handlers/netlify/netlifyDeployedBranches.handler",
  description: "Get's a list of a site's deployments using Netlify's API",
}

export default {
  discordDeploymentList,
  discordNetlifyKickoff,
  discordReportBuildError,
  netlifyEndState,
  deployList,
  deploymentConductor,
  netlifyDeployedBranches
}