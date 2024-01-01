export type AnalysisResult = {
    status: number;
    warnings: string[];
};

export type VLEDatasetIdentifier = {
    compound1: string;
    compound2: string;
    dataset: string;
};

export type VLEDatasetsIdentifier = {
    compound1: string;
    compound2: string;
    datasets: string[];
};

export type NamedParams = Record<string, number>;
