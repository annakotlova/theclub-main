import { EventDto } from '@/interfaces/event/event.dto';

class Calendar {
  event: EventDto;
  startedAt: Date;
  endedAt: Date;
  content: string;
  isApple: boolean;
  constructor() {
    this.isApple = this.checkPlatfrom();
  }
  generate(event: EventDto) {
    this.event = event;
    this.startedAt = new Date(event.startedAt);
    this.endedAt = new Date(event.endedAt);
    this.content = this.event.content?.replaceAll(' ', '+')?.substring(0, 120) + '...';

    return {
      id: this.isApple ? 'apple' : 'google',
      link: this.isApple ? this.apple() : this.google(),
    };
  }
  google() {
    const startTime = this.formatTime(this.startedAt);
    const endTime = this.formatTime(this.endedAt);
    return encodeURI(
      [
        'https://www.google.com/calendar/render',
        '?action=TEMPLATE',
        '&text=' + (this.event.name?.replaceAll(' ', '+') || ''),
        '&dates=' + (startTime || ''),
        '/' + (endTime || ''),
        '&details=' + this.content,
        '&location=' + (this.event.place?.replaceAll(' ', '+') || ''),
        '&sprop=&sprop=name:',
      ].join(''),
    );
  }
  apple() {
    const startTime = this.formatTime(this.startedAt);
    const endTime = this.formatTime(this.endedAt);
    return encodeURI(
      'data:text/calendar;charset=utf8,' +
        [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          'URL:' + document.URL,
          'DTSTART:' + (startTime || ''),
          'DTEND:' + (endTime || ''),
          'SUMMARY:' + (this.event.name || ''),
          'DESCRIPTION:' + this.content,
          'LOCATION:' + (this.event.place || ''),
          'END:VEVENT',
          'END:VCALENDAR',
        ].join('\n'),
    );
  }
  formatTime(date: Date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  }
  checkPlatfrom() {
    return /(macintosh|macintel|macppc|mac68k|macos|iphone|ipad|ipod)/i.test(navigator.userAgent);
  }
}

export default new Calendar();
