export type ReproductionStatus = 
  | 'Reproduced' 
  | 'Partially Reproduced' 
  | 'Analysis Complete' 
  | 'Running' 
  | 'Failed';

export interface Hyperparameters {
  learningRate: number | string;
  batchSize: number;
  epochs: number;
  optimizer: string;
  momentum?: number;
  weightDecay?: number;
  learningRateScheduler?: string;
  seed?: number;
  warmupEpochs?: number;
}

export interface PaperEvidence {
  claim: string;
  quote: string;
  section: string;
  pageNumber: number;
  confidence: number;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  arxivId?: string;
  dataset: string;
  datasetDetails: {
    trainSamples: string;
    testSamples: string;
    inputResolution?: string;
    classes?: number;
  };
  model: string;
  modelDetails: {
    architecture: string;
    parameters: string;
    layers?: string;
  };
  framework: string;
  task: string;
  status: ReproductionStatus;
  primaryMetric: string;
  reportedResult: number;
  reproducedResult?: number;
  difference?: number;
  unit: string;
  lastRun?: string;
  abstract: string;
  methodology: string;
  hyperparameters: Hyperparameters;
  evidence: PaperEvidence[];
  implementationUrl?: string;
  reproducibilityNotes?: string[];
}

export interface ExperimentConfig {
  id: string;
  paperId: string;
  model: string;
  dataset: string;
  framework: string;
  pythonVersion: string;
  torchVersion: string;
  batchSize: number;
  learningRate: number;
  epochs: number;
  optimizer: string;
  momentum: number;
  weightDecay: number;
  seed: number;
  hardware: string;
  usePaperHyperparams: boolean;
  useFixedSeed: boolean;
  enableDataAug: boolean;
  saveCheckpoints: boolean;
  estimatedRuntime: string;
  estimatedGpuMem: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'metric' | 'success';
  message: string;
}

export interface TrainingDataPoint {
  epoch: number;
  valAccuracy: number;
  trainLoss: number;
  valLoss: number;
  learningRate: number;
}

export interface ComparisonMetricItem {
  name: string;
  paper: string;
  reproduced: string;
  difference: string;
  status: 'match' | 'close' | 'diverged';
  unit?: string;
}

export interface ReportData {
  paperId: string;
  reportId: string;
  dateGenerated: string;
  status: ReproductionStatus;
  agreementScore: string;
  agreementDescription: string;
  metrics: ComparisonMetricItem[];
  sourcesOfDifference: {
    title: string;
    description: string;
    impact: 'Low' | 'Medium' | 'High';
  }[];
  hardwareSpec: {
    gpu: string;
    cudaVersion: string;
    os: string;
    duration: string;
  };
}
