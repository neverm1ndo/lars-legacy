export enum ContentTemplate {
  BANNED = 0,
  AUTHENTICATED,
  MUTED,
  DEAD,
  TARGETED,
  PROPS,
  CN
}

export const contentTemplateMap: Map<string, ContentTemplate> = new Map([
  ['disconnectBan', ContentTemplate.BANNED],
  ['disconnectKick', ContentTemplate.BANNED],
  ['authCorrectAdm', ContentTemplate.AUTHENTICATED],
  ['authIncorrect', ContentTemplate.AUTHENTICATED],
  ['authCorrectUsr', ContentTemplate.AUTHENTICATED],
  ['chatHandBlock', ContentTemplate.MUTED],
  ['dthKilled', ContentTemplate.DEAD],
  ['CnResSuccess', ContentTemplate.CN]
]);
