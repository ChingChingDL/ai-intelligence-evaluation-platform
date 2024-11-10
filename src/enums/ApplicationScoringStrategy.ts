// scoringStrategy tinyint  default 0
// not null comment '评分策略（0-自定义，1-AI）',
export enum ApplicationScoringStrategy {
	CUSTOM = 0,
	AI = 1,
}
