/* Simple Agent WebSocket service for the frontend */

export type ChatInitiative = {
  title?: string | null;
  description?: string | null;
  theme?: string | null;
  context?: string | null;
  deliverable?: string | null;
  evaluationCriteria?: string | null;
};

export type AgentPayload = {
  message: string;
  initiative?: any | null;
};

function mapInitiative(src: any): ChatInitiative {
  if (!src) return {};
  return {
    title: src.title ?? null,
    description: src.description ?? null,
    theme: src.theme ?? null,
    context: src.context ?? null,
    deliverable: src.deliverable ?? null,
    evaluationCriteria:
      src.evaluationCriteria ?? src.evaluation_criteria ?? src.avaliation_criteria ?? null,
  } as ChatInitiative;
}

class AgentService {
  private ws: WebSocket | null = null;
  private listeners = new Set<(data: { message: string; initiative: ChatInitiative | null }) => void>();

  private getUrl(): string {
  // Prefer explicit env var if provided (can include ws:// or wss://). Otherwise derive from current page protocol.
  const envUrl = (import.meta as any).env?.VITE_AGENT_WS_URL;
  if (envUrl) return envUrl as string;

  const pageProtocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  const scheme = pageProtocol === 'https:' ? 'wss' : 'ws';
  const host = typeof window !== 'undefined' ? window.location.host : 'inithub.site';
  return `${scheme}://${host}/agent/ws/v1/agent`;
  }

  connect(): WebSocket {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return this.ws;
    }

    this.ws = new WebSocket(this.getUrl());

    this.ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const raw = JSON.parse(event.data) as AgentPayload;
        const initiative = raw.initiative ? mapInitiative(raw.initiative) : null;
        this.listeners.forEach((cb) => cb({ message: raw.message, initiative }));
      } catch (e) {
        console.error('Failed to parse agent message', e);
      }
    };

    this.ws.onclose = () => {
      // Optionally auto-reconnect later if desired
      // For now, leave as manual reconnect via connect()
    };

    return this.ws;
  }

  sendMessage(text: string) {
    const payload = JSON.stringify({ message: text });
    const ws = this.connect();

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    } else if (ws.readyState === WebSocket.CONNECTING) {
      const onOpen = () => {
        ws.removeEventListener('open', onOpen);
        ws.send(payload);
      };
      ws.addEventListener('open', onOpen, { once: true });
    } else {
      console.warn('WebSocket not ready to send');
    }
  }

  subscribe(handler: (data: { message: string; initiative: ChatInitiative | null }) => void): () => void {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const agentService = new AgentService();
