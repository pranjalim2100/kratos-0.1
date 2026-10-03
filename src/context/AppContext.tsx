import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Paper, ExperimentConfig, LogEntry, TrainingDataPoint } from '../types';
import { INITIAL_PAPERS, DEFAULT_CONFIG } from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warn' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  papers: Paper[];
  currentPaper: Paper;
  setCurrentPaper: (paper: Paper) => void;
  config: ExperimentConfig;
  updateConfig: (updates: Partial<ExperimentConfig>) => void;
  uploadedFile: { name: string; size: string; ready: boolean } | null;
  setUploadedFile: (file: { name: string; size: string; ready: boolean } | null) => void;
  
  // Experiment Execution
  isRunning: boolean;
  progress: number;
  currentEpoch: number;
  totalEpochs: number;
  currentAccuracy: number;
  bestAccuracy: number;
  trainLoss: number;
  valLoss: number;
  gpuUtil: number;
  timeRemaining: string;
  trainingHistory: TrainingDataPoint[];
  logs: LogEntry[];
  
  startExperiment: () => void;
  stopExperiment: () => void;
  resetExperiment: () => void;
  
  // UI & Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [papers, setPapers] = useState<Paper[]>(INITIAL_PAPERS);
  const [currentPaper, setCurrentPaper] = useState<Paper>(INITIAL_PAPERS[0]);
  const [config, setConfig] = useState<ExperimentConfig>(DEFAULT_CONFIG);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; ready: boolean } | null>(null);

  // Experiment State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(67);
  const [currentEpoch, setCurrentEpoch] = useState<number>(134);
  const totalEpochs = 200;
  const [currentAccuracy, setCurrentAccuracy] = useState<number>(93.7);
  const [bestAccuracy, setBestAccuracy] = useState<number>(94.0);
  const [trainLoss, setTrainLoss] = useState<number>(0.182);
  const [valLoss, setValLoss] = useState<number>(0.214);
  const [gpuUtil, setGpuUtil] = useState<number>(87);
  const [timeRemaining, setTimeRemaining] = useState<string>('14 minutes');
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Pre-populated initial chart data up to epoch 134
  const [trainingHistory, setTrainingHistory] = useState<TrainingDataPoint[]>(() => {
    const data: TrainingDataPoint[] = [];
    for (let e = 1; e <= 134; e += 4) {
      const p = e / 200;
      // Realistic ResNet CIFAR-10 curve: rapid climb to 85% then step drops at 80, 120
      let acc = 25 + 60 * Math.pow(p, 0.4);
      if (e >= 80) acc += 5;
      if (e >= 120) acc += 3.5;
      acc = Math.min(93.8, acc + (Math.random() * 0.4 - 0.2));

      let tLoss = 2.1 * Math.exp(-3 * p) + 0.12 + (Math.random() * 0.03 - 0.015);
      let vLoss = 2.2 * Math.exp(-2.8 * p) + 0.19 + (Math.random() * 0.04 - 0.02);

      data.push({
        epoch: e,
        valAccuracy: Number(acc.toFixed(2)),
        trainLoss: Number(tLoss.toFixed(3)),
        valLoss: Number(vLoss.toFixed(3)),
        learningRate: e < 80 ? 0.1 : e < 120 ? 0.01 : 0.001
      });
    }
    return data;
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '14:32:04', level: 'info', message: 'Starting reproduction run: ResNet-50 on CIFAR-10...' },
    { timestamp: '14:32:05', level: 'info', message: 'Allocating CUDA device: NVIDIA RTX 4090 (24GB VRAM)' },
    { timestamp: '14:32:08', level: 'info', message: 'Downloading & caching CIFAR-10 dataset (50,000 train / 10,000 test)' },
    { timestamp: '14:32:12', level: 'success', message: 'Dataset checksum verified: SHA256 0e4b8347... [OK]' },
    { timestamp: '14:32:15', level: 'info', message: 'Instantiating model ResNet-50. Total params: 25,557,032 (Float32)' },
    { timestamp: '14:32:16', level: 'info', message: 'Optimizer initialized: SGD (lr=0.1, momentum=0.9, weight_decay=1e-4)' },
    { timestamp: '14:32:17', level: 'info', message: 'Setting up LR scheduler: MultiStepLR at milestones [80, 120] gamma=0.1' },
    { timestamp: '14:33:02', level: 'metric', message: 'Epoch 1/200 — Train Loss: 1.842 | Val Acc: 32.4% | Time: 12.4s' },
    { timestamp: '14:36:40', level: 'metric', message: 'Epoch 25/200 — Train Loss: 0.812 | Val Acc: 74.8% | Time: 12.2s' },
    { timestamp: '14:41:15', level: 'metric', message: 'Epoch 80/200 — Learning rate decayed: 0.1 -> 0.01' },
    { timestamp: '14:41:28', level: 'metric', message: 'Epoch 81/200 — Train Loss: 0.384 | Val Acc: 89.2% | Time: 12.3s' },
    { timestamp: '14:45:50', level: 'metric', message: 'Epoch 120/200 — Learning rate decayed: 0.01 -> 0.001' },
    { timestamp: '14:47:31', level: 'metric', message: 'Epoch 134/200 — Train Loss: 0.182 | Val Loss: 0.214 | Val Acc: 93.7%' }
  ]);

  const intervalRef = useRef<any>(null);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateConfig = (updates: Partial<ExperimentConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const startExperiment = () => {
    setIsRunning(true);
    addToast({
      type: 'info',
      title: 'Reproduction Pipeline Started',
      message: 'Allocated GPU container and launched training daemon.'
    });

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentEpoch(prev => {
        if (prev >= 200) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setCurrentAccuracy(94.0);
          setBestAccuracy(94.0);
          setProgress(100);
          setTimeRemaining('0 minutes (Complete)');
          addToast({
            type: 'success',
            title: 'Experiment Completed',
            message: 'Target 200 epochs reached. Final Top-1 Accuracy: 94.0%'
          });
          return 200;
        }

        const nextEpoch = prev + 1;
        const nextProgress = Math.round((nextEpoch / 200) * 100);
        setProgress(nextProgress);

        const mins = Math.max(1, Math.round(((200 - nextEpoch) * 12.5) / 60));
        setTimeRemaining(`~${mins} minutes`);

        const p = nextEpoch / 200;
        let acc = 93.7 + (nextEpoch - 134) * (0.3 / 66) + (Math.random() * 0.1 - 0.05);
        if (acc > 94.05) acc = 94.0;
        const roundedAcc = Number(acc.toFixed(2));
        setCurrentAccuracy(roundedAcc);
        setBestAccuracy(prevBest => Math.max(prevBest, roundedAcc));

        const nextTrainLoss = Number((0.182 - (nextEpoch - 134) * 0.001 + (Math.random() * 0.01 - 0.005)).toFixed(3));
        const nextValLoss = Number((0.214 - (nextEpoch - 134) * 0.0008 + (Math.random() * 0.01 - 0.005)).toFixed(3));
        setTrainLoss(nextTrainLoss);
        setValLoss(nextValLoss);

        setGpuUtil(Math.floor(84 + Math.random() * 9));

        // Add chart point every 2 epochs
        if (nextEpoch % 2 === 0) {
          setTrainingHistory(h => [
            ...h,
            {
              epoch: nextEpoch,
              valAccuracy: roundedAcc,
              trainLoss: nextTrainLoss,
              valLoss: nextValLoss,
              learningRate: 0.001
            }
          ]);
        }

        // Add log entry every few epochs
        if (nextEpoch % 5 === 0 || nextEpoch === 200) {
          const now = new Date();
          const timeStr = now.toTimeString().split(' ')[0];
          setLogs(l => [
            ...l,
            {
              timestamp: timeStr,
              level: 'metric',
              message: `Epoch ${nextEpoch}/200 — Train Loss: ${nextTrainLoss} | Val Loss: ${nextValLoss} | Val Acc: ${roundedAcc}%`
            }
          ]);
        }

        return nextEpoch;
      });
    }, 450);
  };

  const stopExperiment = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    addToast({
      type: 'warn',
      title: 'Experiment Suspended',
      message: `Execution paused at Epoch ${currentEpoch}/200. Checkpoint saved.`
    });
  };

  const resetExperiment = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    setProgress(0);
    setCurrentEpoch(0);
    setCurrentAccuracy(0);
    setBestAccuracy(0);
    setTrainLoss(2.45);
    setValLoss(2.51);
    setTrainingHistory([]);
    setLogs([
      { timestamp: new Date().toTimeString().split(' ')[0], level: 'info', message: 'Environment reset. Ready to initialize.' }
    ]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        papers,
        currentPaper,
        setCurrentPaper,
        config,
        updateConfig,
        uploadedFile,
        setUploadedFile,
        isRunning,
        progress,
        currentEpoch,
        totalEpochs,
        currentAccuracy,
        bestAccuracy,
        trainLoss,
        valLoss,
        gpuUtil,
        timeRemaining,
        trainingHistory,
        logs,
        startExperiment,
        stopExperiment,
        resetExperiment,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
