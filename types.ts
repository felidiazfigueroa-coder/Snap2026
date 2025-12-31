export enum AppStep {
  INTAKE = 'INTAKE',
  ROAST = 'ROAST',
  BRIEFING = 'BRIEFING',
  ANALYSIS = 'ANALYSIS',
  PITCH = 'PITCH',
  CLOSER = 'CLOSER',
  HANDOFF = 'HANDOFF'
}

export interface RoastResult {
  score: number;
  errors: string[];
  summary: string;
}

export interface BriefingData {
  goal: string;
  socials: string;
  contact: string;
}

export interface SocialAnalysis {
  estimatedReach: string;
  engagementScore: string;
  recommendedContact: 'WhatsApp' | 'Email';
  reasoning: string;
}

export interface ProductionGuide {
  missingItems: string[];
  refinementPrompts: {
    category: string;
    prompt: string;
  }[];
}

export interface DesignOption {
  name: string;
  structure: string;
  tone: string;
  focus: string;
  feature: string;
}

export interface AutoEngineReport {
  audit: {
    criticalFailures: string[];
    conversionOpportunity: string;
  };
  options: DesignOption[];
}

export interface HandoffPackage {
  url: string;
  roast: RoastResult;
  briefing: BriefingData;
  socialAnalysis?: SocialAnalysis;
  productionGuide?: ProductionGuide;
  autoEngineReport?: AutoEngineReport;
  timestamp: string;
  selectedPath?: 'A' | 'B';
}