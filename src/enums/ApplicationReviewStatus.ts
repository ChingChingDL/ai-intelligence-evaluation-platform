//     reviewStatus    int      default 0
//     not null comment '审核状态：0-待审核, 1-通过, 2-拒绝',
export enum ApplicationReviewStatus {
	PENDING = 0,
	PASSED = 1,
	REJECTED = 2,
}
