import { FC, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { TableView } from '@mui/icons-material';
import { UpsertDatasetDialog } from './UpsertDatasetDialog.tsx';

type EditDatasetButtonProps = { compound1: string; compound2: string; dataset: string };

export const EditDatasetButton: FC<EditDatasetButtonProps> = ({ compound1, compound2, dataset }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Tooltip title="Edit dataset table">
                <IconButton children={<TableView />} onClick={() => setOpen(true)} />
            </Tooltip>
            <UpsertDatasetDialog
                open={open}
                handleClose={() => setOpen(false)}
                origCompound1={compound1}
                origCompound2={compound2}
                origDataset={dataset}
            />
        </>
    );
};
