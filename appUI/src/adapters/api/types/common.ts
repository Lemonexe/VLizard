export type AnalysisResult = {
    status: number;
    warnings: string[];
};

export type CompoundIdentifier = {
    compound: string;
};

export type VaporModelIdentifier = CompoundIdentifier & {
    model_name: string;
};

export type SystemIdentifier = {
    compound1: string;
    compound2: string;
};

export type DatasetIdentifier = SystemIdentifier & {
    dataset: string;
};

export type MultipleDatasetsIdentifier = SystemIdentifier & {
    datasets: string[];
};

export type NamedParams = Record<string, number>;
