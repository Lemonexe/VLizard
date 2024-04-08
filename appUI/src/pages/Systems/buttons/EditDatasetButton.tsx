import { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { TableView } from '@mui/icons-material';
import { DatasetIdentifier } from '../../../adapters/api/types/common.ts';
import { UpsertDatasetDialog } from '../UpsertDatasetDialog.tsx';

export const EditDatasetButton: FC<DatasetIdentifier> = ({ compound1, compound2, dataset }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Tooltip title="Edit dataset table">
                <IconButton children={<TableView />} onClick={() => setOpen(true)} />
            </Tooltip>
            {open && (
                <UpsertDatasetDialog
                    open={open}
                    handleClose={() => setOpen(false)}
                    origCompound1={compound1}
                    origCompound2={compound2}
                    origDataset={dataset}
                />
            )}
        </>
    );
};
