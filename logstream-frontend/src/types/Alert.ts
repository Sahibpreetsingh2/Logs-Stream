export type NotifyType = 'webhook' | 'email' | 'slack';

export interface AlertRule {
  ruleName: string;
  threshold: number;
  windowSeconds: number;
  serviceName: string;
  level: string;
  notifyType: NotifyType | string;
}

export interface TriggeredAlert {
  ruleName: string;
  serviceName: string;
  level: string;
  matchCount: number;
  threshold: number;
  triggeredAt: string;
  notifyType?: string;
}
