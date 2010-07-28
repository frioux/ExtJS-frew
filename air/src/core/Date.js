/**
 * @class Date
 *
 * The date parsing and formatting syntax contains a subset of
 * <a href="http://www.php.net/date">PHP's date() function</a>, and the formats that are
 * supported will provide results equivalent to their PHP versions.
 *
 * The following is a list of all currently supported formats:
 * <pre>
Format  Description                                                               Example returned values
------  -----------------------------------------------------------------------   -----------------------
  d     Day of the month, 2 digits with leading zeros                             01 to 31
  D     A short textual representation of the day of the week                     Mon to Sun
  j     Day of the month without leading zeros                                    1 to 31
  l     A full textual representation of the day of the week                      Sunday to Saturday
  N     ISO-8601 numeric representation of the day of the week                    1 (for Monday) through 7 (for Sunday)
  S     English ordinal suffix for the day of the month, 2 characters             st, nd, rd or th. Works well with j
  w     Numeric representation of the day of the week                             0 (for Sunday) to 6 (for Saturday)
  z     The day of the year (starting from 0)                                     0 to 364 (365 in leap years)
  W     ISO-8601 week number of year, weeks starting on Monday                    01 to 53
  F     A full textual representation of a month, such as January or March        January to December
  m     Numeric representation of a month, with leading zeros                     01 to 12
  M     A short textual representation of a month                                 Jan to Dec
  n     Numeric representation of a month, without leading zeros                  1 to 12
  t     Number of days in the given month                                         28 to 31
  L     Whether it's a leap year                                                  1 if it is a leap year, 0 otherwise.
  o     ISO-8601 year number (identical to (Y), but if the ISO week number (W)    Examples: 1998 or 2004
        belongs to the previous or next year, that year is used instead)
  Y     A full numeric representation of a year, 4 digits                         Examples: 1999 or 2003
  y     A two digit representation of a year                                      Examples: 99 or 03
  a     Lowercase Ante meridiem and Post meridiem                                 am or pm
  A     Uppercase Ante meridiem and Post meridiem                                 AM or PM
  g     12-hour format of an hour without leading zeros                           1 to 12
  G     24-hour format of an hour without leading zeros                           0 to 23
  h     12-hour format of an hour with leading zeros                              01 to 12
  H     24-hour format of an hour with leading zeros                              00 to 23
  i     Minutes, with leading zeros                                               00 to 59
  s     Seconds, with leading zeros                                               00 to 59
  u     Decimal fraction of a second                                              Examples:
        (minimum 1 digit, arbitrary number of digits allowed)                     001 (i.e. 0.001s) or
                                                                                  100 (i.e. 0.100s) or
                                                                                  999 (i.e. 0.999s) or
                                                                                  999876543210 (i.e. 0.999876543210s)
  O     Difference to Greenwich time (GMT) in hours and minutes                   Example: +1030
  P     Difference to Greenwich time (GMT) with colon between hours and minutes   Example: -08:00
  T     Timezone abbreviation of the machine running the code                     Examples: EST, MDT, PDT ...
  Z     Timezone offset in seconds (negative if west of UTC, positive if east)    -43200 to 50400
  c     ISO 8601 date
        Notes:                                                                    Examples:
        1) If unspecified, the month / day defaults to the current month / day,   1991 or
           the time defaults to midnight, while the timezone defaults to the      1992-10 or
           browser's timezone. If a time is specified, it must include both hours 1993-09-20 or
           and minutes. The "T" delimiter, seconds, milliseconds and timezone     1994-08-19T16:20+01:00 or
           are optional.                                                          1995-07-18T17:21:28-02:00 or
        2) The decimal fraction of a second, if specified, must contain at        1996-06-17T18:22:29.98765+03:00 or
           least 1 digit (there is no limit to the maximum number                 1997-05-16T19:23:30,12345-0400 or
           of digits allowed), and may be delimited by either a '.' or a ','      1998-04-15T20:24:31.2468Z or
        Refer to the examples on the right for the various levels of              1999-03-14T20:24:32Z or
        date-time granularity which are supported, or see                         2000-02-13T21:25:33
        http://www.w3.org/TR/NOTE-datetime for more info.                         2001-01-12 22:26:34
  U     Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)                1193432466 or -2138434463
  M$    Microsoft AJAX serialized dates                                           \/Date(1238606590509)\/ (i.e. UTC milliseconds since epoch) or
                                                                                  \/Date(1238606590509+0800)\/
</pre>
 *
 * Example usage (note that you must escape format specifiers with '\\' to render them as character literals):
 * <pre><code>
// Sample date:
// 'Wed Jan 10 2007 15:05:01 GMT-0600 (Central Standard Time)'

var dt = new Date('1/10/2007 03:05:01 PM GMT-0600');
document.write(dt.format('Y-m-d'));                           // 2007-01-10
document.write(dt.format('F j, Y, g:i a'));                   // January 10, 2007, 3:05 pm
document.write(dt.format('l, \\t\\he jS \\of F Y h:i:s A'));  // Wednesday, the 10th of January 2007 03:05:01 PM
</code></pre>
 *
 * Here are some standard date/time patterns that you might find helpful.  They
 * are not part of the source of Date.js, but to use them you can simply copy this
 * block of code into any script that is included after Date.js and they will also become
 * globally available on the Date object.  Feel free to add or remove patterns as needed in your code.
 * <pre><code>
Date.patterns = {
    ISO8601Long:"Y-m-d H:i:s",
    ISO8601Short:"Y-m-d",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, F d, Y g:i:s A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y"
};
</code></pre>
 *
 * Example usage:
 * <pre><code>
var dt = new Date();
document.write(dt.format(Date.patterns.ShortDate));
</code></pre>
 * <p>Developer-written, custom formats may be used by supplying both a formatting and a parsing function
 * which perform to specialized requirements. The functions are stored in {@link #parseFunctions} and {@link #formatFunctions}.<br />
 * You have to precompile them using {@link #precompileFormats}.</p>
 */
Ext.apply(Date, {
	/**
	 * Precompiles {@link Date Date formating strings} for use in the app.
	 * It is necessary to not run in Air Security Violation with the Function constructor.
	 * Use it before any Ext.onReady-call to precompile the formats you want to use.
	 * The following formats are precompiled by default and <b>don't</b> have to be precompiled again in your app:<pre>
Fri Apr 09 2010 20:04:31 GMT+0200
---------------------------------
D n/j/Y        Fri 4/9/2010
n/j/Y          4/9/2010
j/n/Y          9/4/2010
n/j/y          4/9/10
m/j/y          04/9/10
n/d/y          4/09/10
m/j/Y          04/9/2010
n/d/Y          4/09/2010
YmdHis         20100409200431
m/d/Y          04/09/2010
m/d/y          04/09/10
m-d-y          04-09-10
m-d-Y          04-09-2010
m/d            04/09
m-d            04-09
md             0409
mdy            040910
mdY            04092010
d              09
Y-m-d          2010-04-09
Y-m-d H:i:s    2010-04-09 20:04:31
d/m/y          09/04/10
d/m/Y          09/04/2010
d-m-y          09-04-10
d-m-Y          09-04-2010
d/m            09/04
d-m            09-04
dm             0904
dmy            090410
dmY            09042010
l              Friday
D m/d          Fri 04/09
D m/d/Y        Fri 04/09/2010
F d, Y         April 09, 2010
l, F d, Y      Friday, April 09, 2010
H:i:s          20:04:31
g:ia           8:04pm
g:iA           8:04PM
g:i a          8:04 pm
g:i A          8:04 PM
h:i            08:04
g:i            8:04
H:i            20:04
ga             8pm
ha             08pm
gA             8PM
h a            08 pm
g a            8 pm
g A            8 PM
gi             804
hi             0804
gia            804pm
hia            0804pm
g              8
H              20
gi a           804 pm
hi a           0804 pm
giA            804PM
hiA            0804PM
gi A           804 PM
hi A           0804 PM
y              10
Y-m            2010-04
m              04
D              Fri
Y              2010
F              April
M              Apr
F Y            April 2010
M Y            Apr 2010
M y            Apr 10
Y/m/d H:i      2010/04/09 20:04
m/y            04/10
m Y            04 2010
m/d/Y H:i      04/09/2010 20:04
YmdHi          201004092004
c              2010-04-09T20:04:31+02:00
	 * </pre>
	 * There are all default date formats precompiled which are needed for default functionality.
	 * @param {String} formats A list of formats to precompile, separated by a bar <code>|</code>
	 */
	precompileFormats: function(formats) {
		var f = formats.split('|');
		for(var i = 0, len = f.length;i < len;i++){
			Date.createFormat(f[i]);
			Date.createParser(f[i]);
		}
	}
});
Date.precompileFormats("D n/j/Y|n/j/Y|j/n/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|YmdHis|m/d/Y|m/d/y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|Y-m-d H:i:s|d/m/y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|l|D m/d|D m/d/Y|F d, Y|l, F d, Y|H:i:s|g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A|y|Y-m|m|D|Y|F|M|F Y|M Y|M y|Y/m/d H:i|m/y|m Y|m/d/Y H:i|YmdHi|c");
// parse all formats and altFormats of TimeField and DateField
Date.precompileFormats(Ext.form.TimeField.prototype.initDateFormat + " " + (Ext.form.TimeField.prototype.format + "|" + Ext.form.TimeField.prototype.altFormats).split("|").join("|" + Ext.form.TimeField.prototype.initDateFormat + " "));
Date.precompileFormats(Ext.form.TimeField.prototype.format + "|" + Ext.form.TimeField.prototype.altFormats);
Date.precompileFormats((Ext.form.DateField.prototype.format + "|" + Ext.form.DateField.prototype.altFormats).split("|").join(" " + Ext.form.DateField.prototype.initTimeFormat + "|") + " " + Ext.form.DateField.prototype.initTimeFormat);
Date.precompileFormats([
	Ext.form.TimeField.prototype.format,
	Ext.form.TimeField.prototype.altFormats,
	Ext.form.DateField.prototype.format,
	Ext.form.DateField.prototype.altFormats,
	Ext.grid.DateColumn.prototype.format,
	Ext.grid.PropertyColumnModel.prototype.dateFormat,
	Ext.DatePicker.prototype.format
].join("|"));
