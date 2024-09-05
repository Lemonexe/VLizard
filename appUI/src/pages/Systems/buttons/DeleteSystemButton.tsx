import { FC, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useDeleteVLE } from '../../../adapters/api/useVLE.ts';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { DeleteIconButton } from '../../../components/Mui/DeleteIconButton.tsx';
import { DialogTitleWithX } from '../../../components/Mui/DialogTitle.tsx';

type NProps = { n_datasets: number };

const NotEmptyAlert: FC<NProps> = ({ n_datasets }) => (
    <Alert severity="warning" sx={{ mb: 2 }}>
        This will also delete all {n_datasets} datasets! It cannot be undone.
    </Alert>
);

type DeleteSystemButtonProps = SystemIdentifier & NProps;

export const DeleteSystemButton: FC<DeleteSystemButtonProps> = ({ compound1, compound2, n_datasets }) => {
    const { mutate } = useDeleteVLE();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleDelete = () => mutate({ compound1, compound2, dataset: undefined }, { onSettled: handleClose });
    const system = `${compound1}-${compound2}`;

    return (
        <>
            <DeleteIconButton onClick={() => setOpen(true)} />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitleWithX handleClose={handleClose}>
                    Delete system <q>{system}</q>?
                </DialogTitleWithX>
                <DialogContent>
                    {n_datasets > 0 && <NotEmptyAlert n_datasets={n_datasets} />}
                    Are you sure you want to delete the entire system <q>{system}</q>
                    {
                        // prettier-ignore
                        n_datasets > 0 ? <><br />including all its {n_datasets} datasets?</> : '?'
                    }
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
