import type { WebSocket } from 'ws';
export interface UpgradeWebSocketOptions {
    maxPayload?: number;
}
export declare function upgradeWebSocket(handler: (ws: WebSocket) => void | Promise<void>, options?: UpgradeWebSocketOptions): Promise<Response>;
/**
 * @deprecated Use upgradeWebSocket instead.
 */
export declare const experimental_upgradeWebSocket: typeof upgradeWebSocket;
