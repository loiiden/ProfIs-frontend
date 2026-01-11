export const color_mapping = {
        "PLANNED": "#696e7dff",
        "PROPOSAL": "#7D8398",
        "DISCUSSION": "#24B6D8",
        "FINAL_SUBMISSION": "#65A839",
        "REVIEW": "#2e5812",
        "ARCHIVE": "#333C70",
        "ABORT": "#AF4357"
    }

export const status_mapping = {
    "PLANNED": "Vorgeschlagen",
    "PROPOSAL": "In Planung",
    "DISCUSSION": "Besprochen",
    "FINAL_SUBMISSION": "Abgegeben",
    "REVIEW": "Korrektur",
    "ARCHIVE": "Archiviert",
    "ABORT": "Abgebrochen"
}

import chatdot from '$lib/assets/chat-dots.svg';
import archive from '$lib/assets/archive.svg';
import bookmark from '$lib/assets/bookmark.svg';
import checkmark from '$lib/assets/checkmark.svg';
import cross from '$lib/assets/cross.svg';
import hourglasssplit from '$lib/assets/hourglass-split.svg';
import pen from '$lib/assets/pen.svg';

export const img_mapping = {
    "PLANNED": chatdot,
    "PROPOSAL": bookmark,
    "DISCUSSION": pen,
    "FINAL_SUBMISSION": checkmark,
    "REVIEW": hourglasssplit,
    "ARCHIVE": archive,
    "ABORT": cross
}