import USERSCRIPT_NAME from 'consts:userscript-name';
import css from './style.scss';

export function setupStyle(): void {
    document.head.append(<style id={'ROpdebee_' + USERSCRIPT_NAME}>
        {css}
    </style>);
}
