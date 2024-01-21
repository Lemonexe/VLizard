import { FC, useCallback, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useDeleteVLE } from '../../../adapters/api/useVLE.ts';
import { DatasetIdentifier } from '../../../adapters/api/types/common.ts';
import { DeleteIconButton } from '../../../components/Mui/DeleteIconButton.tsx';
import { DialogTitleWithX } from '../../../components/Mui/DialogTitle.tsx';

export const DeleteDatasetButton: FC<DatasetIdentifier> = ({ compound1, compound2, dataset }) => {
    const { mutate } = useDeleteVLE();
    const [open, setOpen] = useState(false);
    const handleClose = useCallback(() => setOpen(false), []);
    const handleDelete = useCallback(
        () => mutate({ compound1, compound2, dataset }, { onSettled: handleClose }),
        [compound1, compound2, dataset, mutate],
    );
    const system = `${compound1}-${compound2}`;

    return (
        <>
            <DeleteIconButton onClick={() => setOpen(true)} />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitleWithX handleClose={handleClose}>
                    Delete dataset <q>{dataset}</q>?
                </DialogTitleWithX>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone!
                    </Alert>
                    Are you sure you want to delete the dataset <q>{dataset}</q>
                    <br />
                    from the system <q>{system}</q>?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
