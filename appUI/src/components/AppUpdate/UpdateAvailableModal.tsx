import { FC } from 'react';
import { Download } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, styled } from '@mui/material';
import { LATEST_RELEASE_URL } from '../../adapters/io/URL.ts';
import { DialogTitleWithX } from '../Mui/DialogTitle.tsx';
import { useAvailableAppUpdate } from '../../adapters/api/useAvailableAppUpdate.ts';
import { spacingN } from '../../contexts/MUITheme.tsx';
import { DialogProps } from '../../adapters/types/DialogProps.ts';
import { trimPatchVersion } from '../../adapters/semver.ts';

const PaddedTd = styled('td')({ paddingRight: spacingN(2) });

type UpdateAvailableModalProps = DialogProps & { isNotification?: boolean };

export const UpdateAvailableModal: FC<UpdateAvailableModalProps> = ({ open, handleClose, isNotification }) => {
    const availableAppUpdate = useAvailableAppUpdate();
    if (availableAppUpdate === null) return null;

    return (
        <Dialog open={open} onClose={!isNotification ? handleClose : undefined} fullWidth maxWidth="sm">
            <DialogTitleWithX handleClose={handleClose}>New VLizard version is available! ✨</DialogTitleWithX>
            <DialogContent>
                <table>
                    <tbody>
                        <tr>
                            <PaddedTd>Current version:</PaddedTd>
                            <PaddedTd>{trimPatchVersion(APP_VERSION)}</PaddedTd>
                        </tr>
                        <tr>
                            <PaddedTd>Update available:</PaddedTd>
                            <PaddedTd>{trimPatchVersion(availableAppUpdate)}</PaddedTd>
                            <td>
                                <a href={LATEST_RELEASE_URL}>what&#39;s new?</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    Click the Download button to get a new installer.
                    <br />
                    Then you may open it and update VLizard to the new version.
                </p>
                {isNotification && <p>Or you may go to Settings and disable these notifications.</p>}
            </DialogContent>
            <DialogActions>
                <Button startIcon={<Download />} href={LATEST_RELEASE_URL} variant="contained">
                    Download
                </Button>
                <Button onClick={handleClose} variant="outlined">
                    Dismiss
                </Button>
            </DialogActions>
        </Dialog>
    );
};
