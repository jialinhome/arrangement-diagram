export interface NodePort {
  defaultValue: string;
  name: string;
  optional: boolean;
  portId: number;
  valueType: { typeName: 'DATAFRAME' };
}

export interface NodeConfig {
  type?: string;
  clientX: number;
  clientY: number;
  id?: number | string;
  color?: string;
  icon?: string;
  name: string;
  status?: number;
  component?: {
    inputs?: NodePort[];
    outputs?: NodePort[];
  };
}

export type NodeData = Omit<NodeConfig, 'clientX' | 'clientY'> & {
  x: NodeConfig['clientX'];
  y: NodeConfig['clientY'];
};
