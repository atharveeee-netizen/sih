export type LanguageCode = 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn' | 'bn' | 'en';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  flagSymbol: string;
  sampleAudioText: string;
}

export interface Farmer {
  farmerId: string;
  phoneNumber: string;
  name: string;
  preferredLanguage: LanguageCode;
  voiceEnabled: boolean;
  clusterId: string;
  fieldOfficerId: string;
  walletAddress: string;
  hiveIds: number[];
}

export interface FieldOfficer {
  fieldOfficerId: string;
  name: string;
  phoneNumber: string;
  clusterId: string;
  avatarUrl?: string;
  roleTitle?: string;
}

export type AcousticLevel = 'low' | 'normal' | 'high';
export type HiveHealthStatus = 'healthy' | 'watch' | 'alert' | 'no_signal';
export type RiskType = 'swarm' | 'pest' | 'disease' | 'temperature' | 'moisture' | 'sensor_fault';
export type RiskSeverity = 'low' | 'medium' | 'high';

export interface RiskFlag {
  id: string;
  hiveId: number;
  type: RiskType;
  severity: RiskSeverity;
  confidence: number; // e.g. 0.96
  recommendedAction: string;
  detectedAt: string;
  resolvedAt?: string | null;
}

export interface HiveStatus {
  hiveId: number;
  farmerId: string;
  hiveName: string;
  xPos: number; // For interactive top-down yard map
  yPos: number;
  lastSeenAt: string | null;
  temperatureC: number;
  humidityPct: number;
  vocIndex: number;
  acousticActivityLevel: AcousticLevel;
  overallStatus: HiveHealthStatus;
  activeRisks: RiskFlag[];
}

export interface CallbackRequest {
  id: string;
  farmerId: string;
  fieldOfficerId: string;
  hiveId?: number | null;
  riskType?: string | null;
  status: 'queued' | 'sent' | 'acknowledged';
  createdAt: string;
}

export interface ActionLog {
  id: string;
  farmerId: string;
  hiveId: number;
  riskType: string;
  action: 'marked_done' | 'requested_help';
  createdAt: string;
}
