import {Model} from '../../../model';
import {RelationQueryBuilder} from '../builders/relationQueryBuilder';
import {HttpMethod} from '../enums/httpMethod';
import {AttachResult} from '../results/attachResult';
import {ExtractModelAttributesType} from '../../../types/extractModelAttributesType';
import {DetachResult} from '../results/detachResult';
import {SyncResult} from '../results/syncResult';
import {ToggleResult} from '../results/toggleResult';
import {UpdatePivotResult} from '../results/updatePivotResult';
import {
	ExtractModelPersistedAttributesType
} from '../../../types/extractModelPersistedAttributesType';
import {ExtractModelRelationsType} from '../../../types/extractModelRelationsType';

export class BelongsToMany<
	Relation extends Model,
	Pivot = Record<string, unknown>,
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>,
	Relations = ExtractModelRelationsType<Relation>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes, Relations> {
	public async attach(
		keys: Array<number | string>,
		duplicates: boolean = false
	): Promise<AttachResult> {
		const response = await this.httpClient.request<{ attached: Array<number | string> }>(
			`/attach`,
			HttpMethod.POST,
			{duplicates: duplicates ? 1 : 0},
			{
				resources: keys,
			}
		);

		return new AttachResult(response.data.attached);
	}

	public async attachWithFields(
		resources: Record<string, Pivot>,
		duplicates: boolean = false
	): Promise<AttachResult> {
		const response = await this.httpClient.request<{ attached: Array<number | string> }>(
			`/attach`,
			HttpMethod.POST,
			{duplicates: duplicates ? 1 : 0},
			{resources}
		);

		return new AttachResult(response.data.attached);
	}

	public async detach(keys: Array<number | string>): Promise<DetachResult> {
		const response = await this.httpClient.request<{ detached: Array<number | string> }>(`/detach`, HttpMethod.DELETE, null, {
			resources: keys,
		});

		return new DetachResult(response.data.detached);
	}

	public async detachWithFields(resources: Record<string, Pivot>): Promise<DetachResult> {
		const response = await this.httpClient.request<{ detached: Array<number | string> }>(`/detach`, HttpMethod.DELETE, null, {
			resources,
		});

		return new DetachResult(response.data.detached);
	}

	public async sync(keys: Array<number | string>, detaching: boolean = true): Promise<SyncResult> {
		const response = await this.httpClient.request<
			{ attached: Array<number | string>, updated: Array<number | string>, detached: Array<number | string> }
		>(
			`/sync`,
			HttpMethod.PATCH,
			{detaching: detaching ? 1 : 0},
			{
				resources: keys,
			}
		);

		return new SyncResult(response.data.attached, response.data.updated, response.data.detached);
	}

	public async syncWithFields(
		resources: Record<string, Pivot>,
		detaching: boolean = true
	): Promise<SyncResult> {
		const response = await this.httpClient.request<
			{ attached: Array<number | string>, updated: Array<number | string>, detached: Array<number | string> }
		>(
			`/sync`,
			HttpMethod.PATCH,
			{detaching: detaching ? 1 : 0},
			{resources}
		);

		return new SyncResult(response.data.attached, response.data.updated, response.data.detached);
	}

	public async toggle(keys: Array<number | string>): Promise<ToggleResult> {
		const response = await this.httpClient.request<
			{ attached: Array<number | string>, detached: Array<number | string> }
		>(`/toggle`, HttpMethod.PATCH, null, {
			resources: keys,
		});

		return new ToggleResult(response.data.attached, response.data.detached);
	}

	public async toggleWithFields(resources: Record<string, Pivot>): Promise<ToggleResult> {
		const response = await this.httpClient.request<
			{ attached: Array<number | string>, detached: Array<number | string> }
		>(`/toggle`, HttpMethod.PATCH, null, {
			resources,
		});

		return new ToggleResult(response.data.attached, response.data.detached);
	}

	public async updatePivot(key: number | string, pivot: Pivot): Promise<UpdatePivotResult> {
		const response = await this.httpClient.request<{ updated: Array<string | number> }>(`/${key}/pivot`, HttpMethod.PATCH, null, {
			pivot,
		});

		return new UpdatePivotResult(response.data.updated);
	}
}
