import { faker } from "@faker-js/faker";

export const makeUser = () => ({
	_id: faker.datatype.uuid(),
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	email: faker.internet.email(),
	jobTitle: faker.name.jobTitle(),
	isSuper: faker.datatype.boolean(),
	password: faker.internet.password(),
});

export const makeCourse = () => ({
	title: faker.lorem.text(),
	slug: faker.lorem.slug(),
	overview: faker.lorem.sentences(5),
	module: {
		title: faker.lorem.text(),
		description: faker.lorem.sentences(5),
	},
	subject: {
		title: faker.lorem.text(),
		slug: faker.lorem.slug(),
	},
	lecturer: `${faker.name.prefix()} ${faker.name.fullName()}`,
});

export const makeModule = () => ({
	title: faker.lorem.text(),
	description: faker.lorem.sentence(),
});

export const makeSubject = () => ({
	title: faker.lorem.text(),
	slug: faker.lorem.slug(),
});
