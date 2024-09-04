import { Fragment, ReactNode } from 'react';

export const linesFromStrings = (strings: string[]): ReactNode[] => {
    const lines: ReactNode[] = strings.map((line) => <Fragment key={line} children={line} />);
    const lineNodes = lines.reduce<ReactNode[]>((acc, curr, i) => acc.concat(curr, <br key={i} />), []);
    lineNodes.pop();
    return lineNodes;
};
