import { FC, useState } from 'react';
import { TestDialogProps } from '../types.ts';
import { Dialog, DialogContent, TextField } from '@mui/material';
import { DialogTitleWithX } from '../../components/Mui/DialogTitle.tsx';

export const FredenslundTestDialog: FC<TestDialogProps> = ({ open, handleClose, compound1, compound2, dataset }) => {
    const [legendreOrder, setLegendreOrder] = useState(4);

    return (
        <Dialog fullScreen open={open} onClose={handleClose}>
            <DialogTitleWithX handleClose={handleClose}>
                Fredenslund test for {compound1}-{compound2} {dataset}
            </DialogTitleWithX>
            <DialogContent>
                <TextField
                    type="number"
                    label="Legendre polynomial order"
                    value={legendreOrder}
                    onChange={(e) => setLegendreOrder(parseInt(e.target.value))}
                    size="small"
                    style={{ width: 100 }}
                    inputProps={{ min: 3, max: 5 }}
                />
            </DialogContent>
        </Dialog>
    );
};
