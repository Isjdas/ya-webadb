import type { Event } from "@yume-chan/event";
import type {
    ScrcpyMediaStreamPacket,
    ScrcpyVideoCodecId,
} from "@yume-chan/scrcpy";
import type { WritableStream } from "@yume-chan/stream-extra";

export interface ScrcpyVideoDecoderCapability {
    maxProfile?: number;
    maxLevel?: number;
}

export interface ScrcpyVideoDecoder extends Disposable {
    readonly renderer: HTMLElement;
    readonly sizeChanged: Event<{ width: number; height: number }>;
    readonly frameRendered: number;
    readonly frameSkipped: number;
    readonly writable: WritableStream<ScrcpyMediaStreamPacket>;
}

export interface ScrcpyVideoDecoderConstructor {
    readonly capabilities: Record<string, ScrcpyVideoDecoderCapability>;

    new (codec: ScrcpyVideoCodecId): ScrcpyVideoDecoder;
}
