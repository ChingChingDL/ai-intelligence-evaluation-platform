import { UserRoleEnum } from '@/enums/UserRoleEnum';

/**
 * 检查用户权限
 * @param loginUser 当前登录用户
 * @param roleNeed 访问所需权限
 * @return true: 有权限，false: 无权限
 */
export function checkAuthorization(loginUser: API.LoginUserVO, roleNeed: UserRoleEnum = UserRoleEnum.ANONYMOUS): boolean {
	const loginUserRole = loginUser?.userRole ?? UserRoleEnum.ANONYMOUS;

	switch (roleNeed) {
		case UserRoleEnum.ANONYMOUS:
			return true;
		case UserRoleEnum.USER:
			return loginUserRole !== UserRoleEnum.ANONYMOUS;
		case UserRoleEnum.ADMIN:
			return loginUserRole === UserRoleEnum.ADMIN;
		default:
			return false;
	}
}
