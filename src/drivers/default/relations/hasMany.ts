import { Model } from '../../../model';
import { RelationQueryBuilder } from '../builders/relationQueryBuilder';
import { HttpMethod } from '../enums/httpMethod';
import { ExtractModelAttributesType } from '../../../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../../../types/extractModelPersistedAttributesType';
import { ExtractModelRelationsType } from '../../../types/extractModelRelationsType';

export class HasMany<
	Relation extends Model,
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>,
	Relations = ExtractModelRelationsType<Relation>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes, Relations> {
	public async associate(key: string | number): Promise<Relation> {
		const response = await this.httpClient.request<{data: Attributes & PersistedAttributes & Relations}>(
			`/associate`,
			HttpMethod.POST,
			this.prepareQueryParams(),
			{
				related_key: key,
			}
		);

		return this.hydrate(response.data.data, response);
	}

	public async dissociate(key: string | number): Promise<Relation> {
		const response = await this.httpClient.request<{data: Attributes & PersistedAttributes & Relations}>(
			`/${key}/dissociate`,
			HttpMethod.DELETE,
			this.prepareQueryParams()
		);

		return this.hydrate(response.data.data, response);
	}
}
