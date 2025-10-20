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
  session_id?: string;
  user_id?: string;
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
  private listeners = new Set<(data: { message: string; initiative: ChatInitiative | null; session_id?: string; user_id?: string }) => void>();
  private userId: string | null = null;
  private sessionId: string | null = null;

  private getUrl(): string {
    const baseUrl = (import.meta as any).env?.VITE_AGENT_WS_URL || 'ws://localhost:8000/ws/v1/agent';
    const params = new URLSearchParams();
    
    if (this.userId) {
      params.append('user_id', this.userId);
    }
    if (this.sessionId) {
      params.append('session_id', this.sessionId);
    }
    
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  }

  setUser(userId: string, sessionId?: string): void {
    this.userId = userId;
    this.sessionId = sessionId || null;

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isUserSet(): boolean {
    return !!this.userId;
  }

  reconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.userId) {
      this.connect();
    }
  }

  connect(): WebSocket {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return this.ws;
    }

    if (!this.userId) {
      console.log('AgentService: Connecting without user_id (will use anonymous session)');
    }

    this.ws = new WebSocket(this.getUrl());

    this.ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const raw = JSON.parse(event.data) as AgentPayload;
        const initiative = raw.initiative ? mapInitiative(raw.initiative) : null;
        if (raw.session_id) {
          this.sessionId = raw.session_id;
        }
        this.listeners.forEach((cb) => cb({ 
          message: raw.message, 
          initiative,
          session_id: raw.session_id,
          user_id: raw.user_id
        }));
      } catch (e) {
        console.error('Failed to parse agent message', e);
      }
    };

    this.ws.onclose = () => {};
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

  subscribe(handler: (data: { message: string; initiative: ChatInitiative | null; session_id?: string; user_id?: string }) => void): () => void {
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
