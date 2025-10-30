export interface ApplictionNotes {
    id?: number;
    text?: string;
    createWarningFromNote: boolean;
    visibleToIntroducer: boolean;
    visibleToLender?: boolean;
}