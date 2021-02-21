import QueryBuilder from './builders/queryBuilder';
import * as pluralize from 'pluralize';
import { noCase, snakeCase } from 'change-case';
import UrlBuilder from './builders/urlBuilder';
import ModelConstructor from './contracts/modelConstructor';

export default class Model<Attributes> {
	public attributes!: Attributes;

	constructor(attributes?: Attributes) {
		if (attributes) {
			this.fill(attributes);
		}
	}

	protected keyName: string = 'id';

	public getKeyName(): string {
		return this.keyName;
	}

	public setKeyName(keyName: string): this {
		this.keyName = keyName;

		return this;
	}

	public getKey(): number | string {
		return this.attributes[this.getKeyName()];
	}

	public setKey(key: number | string): this {
		this.attributes[this.getKeyName()] = key;

		return this;
	}

	public fill(attributes: Attributes): this {
		if (!this.attributes) {
			this.attributes = {} as Attributes;
		}

		for (const attribute in attributes) {
			this.attributes[attribute] = attributes[attribute];
		}

		return this;
	}

	public query(): QueryBuilder<this, Attributes> {
		return new QueryBuilder<this, Attributes>(
			UrlBuilder.getResourceBaseUrl(this.constructor as typeof Model),
			this.constructor as ModelConstructor<this, Attributes>
		);
	}

	public getResourceName(): string {
		return snakeCase(pluralize.plural(noCase(this.constructor.name)));
	}
}
