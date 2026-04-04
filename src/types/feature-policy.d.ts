interface FeaturePolicy {
  allowedFeatures(): string[];
  allowsFeature(feature: string): boolean;
  features(): string[];
  getAllowlistForFeature(feature: string): string;
}

interface Document {
  featurePolicy?: FeaturePolicy;
}
