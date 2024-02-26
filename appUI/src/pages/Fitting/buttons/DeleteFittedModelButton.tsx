import { FC, useState } from 'react';
import { SystemIdentifier } from '../../../adapters/api/types/common.ts';
import { DeleteIconButton } from '../../../components/Mui/DeleteIconButton.tsx';

type DeleteFittedModelButtonProps = SystemIdentifier & { model_name: string };

export const DeleteFittedModelButton: FC<DeleteFittedModelButtonProps> = ({ compound1, compound2, model_name }) => {
    const [open, setOpen] = useState(false);
    console.log(open, compound1, compound2, model_name);
    return (
        <>
            <DeleteIconButton onClick={() => setOpen(true)} />
        </>
    );
};
