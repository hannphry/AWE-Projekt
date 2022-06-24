export interface Announcement{
    id: String,
    type: String,
    priority ?: String,
    affectTimetable ?: Boolean,
    from ?: Date,
    to ?: Date,
    infoLinkUrl ?: String,
    infoLinkText ?: String,
    content ?: String,
    subtitle ?: String,
    subject ?: String,
    concernedLines ?: String
}