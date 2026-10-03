import { Paper, ExperimentConfig, ReportData } from '../types';

export const INITIAL_PAPERS: Paper[] = [
  {
    id: 'resnet-2015',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    year: 2015,
    venue: 'CVPR 2016 (Best Paper)',
    arxivId: '1512.03385',
    dataset: 'CIFAR-10',
    datasetDetails: {
      trainSamples: '50,000',
      testSamples: '10,000',
      inputResolution: '32x32 RGB',
      classes: 10
    },
    model: 'ResNet-50',
    modelDetails: {
      architecture: 'Residual Convolutional Network',
      parameters: '25.6M',
      layers: '50 layers with bottleneck building blocks'
    },
    framework: 'PyTorch 2.2',
    task: 'Image Classification',
    status: 'Partially Reproduced',
    primaryMetric: 'Top-1 Accuracy',
    reportedResult: 94.2,
    reproducedResult: 94.0,
    difference: -0.2,
    unit: '%',
    lastRun: '12 minutes ago',
    abstract:
      'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.',
    methodology:
      'The network is trained on CIFAR-10 with standard data augmentation (4-pixel padding followed by 32x32 random crop and random horizontal flip). Optimization is performed using standard SGD with momentum 0.9, mini-batch size 128, and initial learning rate 0.1, divided by 10 at 32k and 48k iterations (approximated as epoch 80 and 120 over 200 epochs). Weight decay of 1e-4 is applied.',
    hyperparameters: {
      learningRate: 0.1,
      batchSize: 128,
      epochs: 200,
      optimizer: 'SGD',
      momentum: 0.9,
      weightDecay: 0.0001,
      learningRateScheduler: 'MultiStepLR [80, 120]',
      seed: 42
    },
    evidence: [
      {
        claim: 'Learning rate schedule and SGD optimizer',
        quote: 'We use SGD with a weight decay of 0.0001 and momentum of 0.9. The learning rate starts from 0.1 and is divided by 10 when the error plateaus.',
        section: 'Section 4.2: CIFAR-10 and Analysis',
        pageNumber: 5,
        confidence: 0.98
      },
      {
        claim: 'Data Augmentation pipeline',
        quote: 'We follow the simple data augmentation in [24] for training: 4 pixels are padded on each side, and a 32x32 crop is randomly sampled from the padded image or its horizontal flip.',
        section: 'Section 4.2: Implementation Details',
        pageNumber: 5,
        confidence: 0.96
      },
      {
        claim: 'Mini-batch size and weight initialization',
        quote: 'We adopt batch normalization (BN) right after each convolution and before activation, following [16]. We initialize the weights as in [13] and train all plain/residual nets from scratch. We use a mini-batch size of 128.',
        section: 'Section 3.4: Implementation',
        pageNumber: 4,
        confidence: 0.99
      }
    ],
    implementationUrl: 'https://github.com/pytorch/vision/blob/main/torchvision/models/resnet.py',
    reproducibilityNotes: [
      'Original paper used Caffe; reproduced version runs in PyTorch with modern cuDNN benchmarking.',
      'Learning rate warmup of 5 epochs added to stabilize initial BatchNorm stats on multi-GPU setups.',
      'Reported difference (-0.2%) is well within the 95% confidence interval for CIFAR-10 variance across seeds.'
    ]
  },
  {
    id: 'attention-2017',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    year: 2017,
    venue: 'NeurIPS 2017',
    arxivId: '1706.03762',
    dataset: 'WMT 2014 En-De',
    datasetDetails: {
      trainSamples: '4,500,000 sentence pairs',
      testSamples: '3,003 sentence pairs',
      inputResolution: 'Subword tokens (BPE 37k vocabulary)',
      classes: 37000
    },
    model: 'Transformer (Base)',
    modelDetails: {
      architecture: 'Encoder-Decoder Multi-Head Self-Attention',
      parameters: '65.0M',
      layers: '6 encoder & 6 decoder layers, d_model=512, h=8'
    },
    framework: 'PyTorch / Fairseq',
    task: 'Machine Translation',
    status: 'Partially Reproduced',
    primaryMetric: 'BLEU Score',
    reportedResult: 28.4,
    reproducedResult: 27.9,
    difference: -0.5,
    unit: 'BLEU',
    lastRun: '1 day ago',
    abstract:
      'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    methodology:
      'Trained on standard WMT 2014 English-German dataset consisting of 4.5 million sentence pairs. Sentences encoded using Byte-Pair Encoding with 37k shared vocabulary. Adam optimizer with beta1=0.9, beta2=0.98, and custom inverse square root learning rate schedule with 4000 warmup steps.',
    hyperparameters: {
      learningRate: 'Custom (Warmup 4000)',
      batchSize: 4096,
      epochs: 100,
      optimizer: 'Adam (beta1=0.9, beta2=0.98)',
      weightDecay: 0.0,
      seed: 1337
    },
    evidence: [
      {
        claim: 'Optimizer and custom warmup learning rate',
        quote: 'We used the Adam optimizer with β1 = 0.9, β2 = 0.98 and ε = 10^-9. We varied the learning rate over the course of training according to the formula: lrate = d_model^-0.5 * min(step_num^-0.5, step_num * warmup_steps^-1.5)',
        section: 'Section 5.3: Optimizer',
        pageNumber: 7,
        confidence: 0.99
      },
      {
        claim: 'Tokenization and byte-pair encoding',
        quote: 'We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs. Sentences were encoded using byte-pair encoding.',
        section: 'Section 5.1: Training Data and Batching',
        pageNumber: 7,
        confidence: 0.97
      }
    ],
    implementationUrl: 'https://github.com/google-research/tensor2tensor',
    reproducibilityNotes: [
      'Reproduced BLEU difference (-0.5) is attributed to compound splitting differences in sacreBLEU vs tokenized BLEU.',
      'Training executed across 4x NVIDIA A100 GPUs with mixed precision fp16.'
    ]
  },
  {
    id: 'bert-2018',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
    year: 2018,
    venue: 'NAACL 2019',
    arxivId: '1810.04805',
    dataset: 'BookCorpus + Wikipedia',
    datasetDetails: {
      trainSamples: '3,300M words (800M + 2,500M)',
      testSamples: 'GLUE Benchmark',
      inputResolution: 'WordPiece tokens max len 512',
      classes: 30522
    },
    model: 'BERT-Base (Uncased)',
    modelDetails: {
      architecture: 'Bidirectional Transformer Encoder',
      parameters: '110M',
      layers: '12 layers, 768 hidden, 12 heads'
    },
    framework: 'PyTorch / HuggingFace',
    task: 'Masked Language Modeling & NSP',
    status: 'Analysis Complete',
    primaryMetric: 'GLUE Average Score',
    reportedResult: 79.6,
    unit: 'Score',
    abstract:
      'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text.',
    methodology:
      'Pre-trained with two unsupervised tasks: Masked LM (15% tokens masked) and Next Sentence Prediction. Trained with Adam (learning rate 1e-4, beta1=0.9, beta2=0.999), L2 weight decay of 0.01, learning rate warmup over the first 10,000 steps, and linear decay.',
    hyperparameters: {
      learningRate: 0.0001,
      batchSize: 256,
      epochs: 40,
      optimizer: 'AdamW',
      weightDecay: 0.01,
      seed: 42
    },
    evidence: [
      {
        claim: 'Pre-training corpus extraction',
        quote: 'For the pre-training corpus we use the BooksCorpus (800M words) and English Wikipedia (2,500M words). For Wikipedia we extract only the text passages and ignore lists, tables, and headers.',
        section: 'Section 3.1: Pre-training BERT',
        pageNumber: 3,
        confidence: 0.98
      }
    ],
    implementationUrl: 'https://github.com/google-research/bert',
    reproducibilityNotes: [
      'Full pre-training requires substantial compute (estimated 16 Cloud TPUs for 4 days).',
      'Downstream fine-tuning on GLUE benchmark is ready for verification.'
    ]
  },
  {
    id: 'gan-2014',
    title: 'Generative Adversarial Nets',
    authors: ['Ian Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza', 'Bing Xu', 'David Warde-Farley', 'Sherjil Ozair', 'Aaron Courville', 'Yoshua Bengio'],
    year: 2014,
    venue: 'NeurIPS 2014',
    arxivId: '1406.2661',
    dataset: 'MNIST',
    datasetDetails: {
      trainSamples: '60,000 images',
      testSamples: '10,000 images',
      inputResolution: '28x28 Grayscale',
      classes: 10
    },
    model: 'MLP GAN',
    modelDetails: {
      architecture: 'Minimax 2-Player Game Generator & Discriminator',
      parameters: '1.8M',
      layers: 'Multilayer perceptrons with ReLU and Sigmoid activations'
    },
    framework: 'PyTorch 2.1',
    task: 'Generative Modeling',
    status: 'Reproduced',
    primaryMetric: 'Log-Likelihood Estimate',
    reportedResult: 225.0,
    reproducedResult: 226.4,
    difference: 1.4,
    unit: 'nats',
    lastRun: '3 days ago',
    abstract:
      'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.',
    methodology:
      'Trained using stochastic gradient descent. The generator uses a mixture of rectifier linear activations and sigmoid activations, while the discriminator uses maxout activations. Dropout was applied in training the discriminator. Noise was added to the input of generator from uniform distribution.',
    hyperparameters: {
      learningRate: 0.0002,
      batchSize: 100,
      epochs: 100,
      optimizer: 'SGD with Momentum',
      momentum: 0.5,
      seed: 123
    },
    evidence: [
      {
        claim: 'Minimax game optimization',
        quote: 'In practice, equation 1 may not provide sufficient gradient for G to learn well. Early in learning, when G is poor, D can reject samples with high confidence because they are clearly different from the training data.',
        section: 'Section 3: Adversarial nets',
        pageNumber: 3,
        confidence: 0.95
      }
    ],
    implementationUrl: 'https://github.com/goodfeli/adversarial',
    reproducibilityNotes: [
      'Successfully reproduced within Parzen window log-likelihood bounds.',
      'Mode collapse observed if discriminator learning rate exceeds generator by 3x.'
    ]
  }
];

export const DEFAULT_CONFIG: ExperimentConfig = {
  id: 'exp-cfg-resnet50',
  paperId: 'resnet-2015',
  model: 'ResNet-50',
  dataset: 'CIFAR-10',
  framework: 'PyTorch 2.2',
  pythonVersion: '3.10',
  torchVersion: '2.2.1+cu121',
  batchSize: 128,
  learningRate: 0.1,
  epochs: 200,
  optimizer: 'SGD',
  momentum: 0.9,
  weightDecay: 0.0001,
  seed: 42,
  hardware: 'NVIDIA RTX 4090 (24GB VRAM)',
  usePaperHyperparams: true,
  useFixedSeed: true,
  enableDataAug: true,
  saveCheckpoints: true,
  estimatedRuntime: '~42 minutes',
  estimatedGpuMem: '7.4 GB'
};

export const RESNET_COMPARISON_METRICS = [
  { name: 'Top-1 Accuracy', paper: '94.2%', reproduced: '94.0%', difference: '-0.2%', status: 'close' as const, unit: '%' },
  { name: 'Top-5 Accuracy', paper: '99.1%', reproduced: '99.0%', difference: '-0.1%', status: 'match' as const, unit: '%' },
  { name: 'Validation Loss', paper: '0.208', reproduced: '0.214', difference: '+0.006', status: 'close' as const },
  { name: 'F1 Score (Macro)', paper: '93.7%', reproduced: '93.5%', difference: '-0.2%', status: 'close' as const, unit: '%' },
  { name: 'Model Parameters', paper: '25.6M', reproduced: '25.6M', difference: '0.0M', status: 'match' as const },
  { name: 'Training Time', paper: '4h 12m', reproduced: '4h 28m', difference: '+16m', status: 'close' as const }
];

export const REPRODUCIBILITY_REPORT_DATA: ReportData = {
  paperId: 'resnet-2015',
  reportId: 'KRT-2026-0892',
  dateGenerated: 'March 2026',
  status: 'Partially Reproduced',
  agreementScore: '99.8%',
  agreementDescription: 'The reproduced result is within 0.2 percentage points (0.21% relative margin) of the reported benchmark, demonstrating high structural reproducibility.',
  metrics: RESNET_COMPARISON_METRICS,
  sourcesOfDifference: [
    {
      title: 'Random Seed & Weight Initialization Stochasticity',
      description: 'The original Caffe implementation utilized standard Gaussian initialization with fixed variance, whereas modern PyTorch ResNet employs He/Kaiming normal initialization. Across 5 distinct seeds, CIFAR-10 ResNet-50 exhibits a standard deviation of ±0.24%.',
      impact: 'Medium'
    },
    {
      title: 'Dataset Preprocessing & Interpolation Kernel',
      description: 'The original implementation performed bilinearly interpolated random cropping and per-pixel channel normalization computed over the CIFAR-10 training set. Subtle precision differences in torchvision transforms account for negligible drift.',
      impact: 'Low'
    },
    {
      title: 'Hardware & CUDA Matrix Multiply Precision',
      description: 'The paper ran on Kepler-era K40 GPUs using FP32, while current reproduction utilized modern Ampere/Ada Lovelace tensor cores with TF32 enabled by default.',
      impact: 'Low'
    },
    {
      title: 'Library Versions & Gradient Accumulation',
      description: 'Difference between legacy Caffe SGD implementation momentum formulation and PyTorch standard damped momentum SGD.',
      impact: 'Medium'
    },
    {
      title: 'Unreported Training Details',
      description: 'Precise batch normalization epsilon and momentum decay settings were omitted in the initial CVPR 2016 draft, requiring default framework assumptions.',
      impact: 'Low'
    }
  ],
  hardwareSpec: {
    gpu: 'NVIDIA GeForce RTX 4090 24GB',
    cudaVersion: 'CUDA 12.2 / cuDNN 8.9',
    os: 'Ubuntu 22.04 LTS x86_64',
    duration: '42m 18s (Simulated Acceleration)'
  }
};
