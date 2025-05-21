import { UserDTO } from "#users/v1/domain/users.dto";

import type { IAuthBusiness } from "#auth/v1/domain/IAuthBusiness";

const register: IAuthBusiness["register"] = async (p) => {
	const dto = new UserDTO({
		uuid: "",
		id: 1,
		isActive: false,
		password: p.password,
		email: p.email,
		name: p.name,
		roles: [],
		createdAt: new Date(),
	});

	return await Promise.resolve(dto);
};

const login: IAuthBusiness["login"] = async (p) => {
	const dto = new UserDTO({
		uuid: "",
		id: 1,
		isActive: false,
		password: p.password,
		email: p.email,
		name: "",
		roles: [],
		createdAt: new Date(),
	});

	return await Promise.resolve(dto);
};

const changePassword: IAuthBusiness["changePassword"] = async () => {
	return true;
};

const forgotPassword: IAuthBusiness["forgotPassword"] = async () => {
	return true;
};

const activateAccount: IAuthBusiness["activateAccount"] = async () => {
	const dto = new UserDTO({
		uuid: "",
		id: 1,
		isActive: false,
		password: "",
		email: "",
		name: "",
		roles: [],
		createdAt: new Date(),
	});
	return await Promise.resolve(dto);
};

const getUserByUuid: IAuthBusiness["getUserByUuid"] = async () => {
	const dto = new UserDTO({
		uuid: "",
		id: 1,
		isActive: false,
		password: "",
		email: "",
		name: "",
		roles: [],
		createdAt: new Date(),
	});
	return await Promise.resolve(dto);
};

export const mockAuthBusiness: IAuthBusiness = {
	register,
	login,
	getUserByUuid,
	activateAccount,
	changePassword,
	forgotPassword,
};
