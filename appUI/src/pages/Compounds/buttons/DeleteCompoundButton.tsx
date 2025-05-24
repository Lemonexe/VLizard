import { Alert, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { FC, useState } from 'react';

import { DeleteVaporModelRequest } from '../../../adapters/api/types/vaporTypes.ts';
import { useDeleteVaporModel } from '../../../adapters/api/useVapor.ts';
import { DeleteIconButton } from '../../../components/Mui/DeleteIconButton.tsx';
import { DialogTitleWithX } from '../../../components/Mui/DialogTitle.tsx';

type DeleteCompoundButtonProps = DeleteVaporModelRequest;

export const DeleteCompoundButton: FC<DeleteCompoundButtonProps> = ({ compound, model_name }) => {
    const { mutate } = useDeleteVaporModel();
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleDelete = () => mutate({ compound, model_name }, { onSettled: handleClose });

    return (
        <>
            <DeleteIconButton onClick={() => setOpen(true)} />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitleWithX handleClose={handleClose}>
                    Delete compound <q>{compound}</q>?
                </DialogTitleWithX>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone!
                    </Alert>
                    Are you sure you want to delete the compound <q>{compound}</q>
                    <br />
                    and its vapor pressure model <q>{model_name}</q>?
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
