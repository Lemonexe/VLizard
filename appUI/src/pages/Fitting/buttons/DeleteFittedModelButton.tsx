import { FC, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useDeleteFit } from '../../../adapters/api/useFit.ts';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { DeleteIconButton } from '../../../components/Mui/DeleteIconButton.tsx';
import { DialogTitleWithX } from '../../../components/Mui/DialogTitle.tsx';

type DeleteFittedModelButtonProps = SystemIdentifier & { model_name: string };

export const DeleteFittedModelButton: FC<DeleteFittedModelButtonProps> = ({ compound1, compound2, model_name }) => {
    const { mutate } = useDeleteFit();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleDelete = () => mutate({ compound1, compound2, model_name }, { onSettled: handleClose });
    const system = `${compound1}-${compound2}`;
    return (
        <>
            <DeleteIconButton onClick={() => setOpen(true)} />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitleWithX handleClose={handleClose}>
                    Delete fitted model <q>{model_name}</q>?
                </DialogTitleWithX>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Only fitted parameters will be lost, your data will remain.
                    </Alert>
                    Are you sure you want to delete the {model_name} model
                    <br />
                    for the system <q>{system}</q>?
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
