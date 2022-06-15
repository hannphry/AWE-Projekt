import * as mongoose from 'mongoose';

/*export interface Bahnhof{
    id: string,
    name: string,
    shortcut: string,
    lon: number,
    lat: number
}*/

/*Priorität, Beeinflusst Fahrplan, welche Meldung (Bauarbeiten, Verspätungen, usw.), Subtitle und Subject ganz interessant, concerned Lines vielleicht */

export const AnnouncementSchema  = new mongoose.Schema({
    id: String,
    type: String,
    priority: String,
    affectTimetable: Boolean,
    from: Date,
    to: Date,
    infoLinkUrl: String,
    infoLinkText: String,
    content: String,
    subtitle: String,
    subject: String,
    concernedLines: String
});

export interface Announcement extends mongoose.Document{
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

export interface AnnouncementModel{
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