export interface AuthScheme {
  name: "sigv4" | "sigv4a" | string;
  signingName: string;
  signingRegion: string;
  signingRegionSet?: string[];
  signingScope?: never;
  properties: Record<string, unknown>;
}
