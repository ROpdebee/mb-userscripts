import USERSCRIPT_ID from 'consts:userscript-id';
import css from './style.scss';

export function setupStyle(): void {
    document.head.append(<style id={'ROpdebee_' + USERSCRIPT_ID}>
        {css}
    </style>);
}
