import { ulid } from 'ulid';
import { ArgumentNotProvidedException } from '../exceptions';
import { Guard } from '../guard';

type DomainEventMetadata = {
    /** Timestamp when this domain event occurred */
    readonly timestamp: number;

    /**
     * Causation id used to reconstruct execution order if needed
     */
    readonly causationId?: string;

    /**
     * User ID for debugging and logging purposes
     */
    readonly userId?: string;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
    aggregateId: string;
    metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
    public readonly id: string;

    /** Aggregate ID where domain event occurred */
    public readonly aggregateId: string;

    public readonly metadata: DomainEventMetadata;

    constructor(props: DomainEventProps<unknown>) {
        if (Guard.isEmpty(props)) {
            throw new ArgumentNotProvidedException(
                'DomainEvent props should not be empty'
            );
        }
        this.id = ulid();
        this.aggregateId = props.aggregateId;
        this.metadata = {
            causationId: props?.metadata?.causationId,
            timestamp: props?.metadata?.timestamp || Date.now(),
            userId: props?.metadata?.userId,
        };
    }
}
