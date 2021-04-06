import { Model } from '../../../src/model';

export default class User extends Model<{
	name: string;
}> {
	$resource(): string {
		return 'users';
	}
}
