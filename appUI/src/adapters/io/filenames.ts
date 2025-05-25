// Note: besides standard filename specifications, hyphen is also restricted, because VLE system dirname is composed with hyphens
export const fileNameRegex = /^[a-zA-Z0-9_,. ]*$/;
export const fileNameMaxLength = 50;

const invalidFileNameMessage = 'Name invalid; may contain only alphanumeric, spaces and characters: _ , .';
const tooLongMessage = 'Name too long (max 50 characters).';

export const getFileNameValidationError = (fileName: string): string | null => {
    const isValidFileName = fileNameRegex.test(fileName);
    const isValidLength = fileName.length <= fileNameMaxLength;

    if (!isValidFileName) return invalidFileNameMessage;
    if (!isValidLength) return tooLongMessage;

    return null;
};
