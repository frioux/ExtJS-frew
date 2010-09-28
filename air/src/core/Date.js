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
	 * @member Date
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
