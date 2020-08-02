import { NextApiRequest } from "next";

export const getAddress = ({ headers, connection }: NextApiRequest) => {
	if (headers["x-forwarded-for"]) {
		const ips = (headers["x-forwarded-for"] as string).split(", ");
		return ips[ips.length - 1];
	} else return connection.remoteAddress;
};
