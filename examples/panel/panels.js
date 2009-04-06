Ext.onReady(function(){
    var p = new Ext.Panel({
        title: 'My Panel',
        collapsible:true,
        renderTo: 'container',
        width:400,
        html: Ext.example.bogusMarkup
    });

	// normal: true
	new Ext.Panel({
		title: 'A Panel with W3C-standard body-html styling',
		normal: true,
		renderTo: 'container-normal-true',
		width: 400,
		html: html.join('')
	});

	// normal: false
	new Ext.Panel({
		title: 'Same panel as above with normal: false',
		normal: false,
		renderTo: 'container-normal-false',
		width: 400,
		html: html.join('')
	});
});

// Some sample html
var html = [
	'<h1>Heading One</h1>',
	'<h2>Heading Two</h2>',
	'<p>This is a paragraph with <strong>STRONG</strong>, <em>EMPHASIS</em> and a <a href="#">Link</a></p>',
	'<table border="1">',
		'<tr>',
			'<td>Table Column One</td>',
			'<td>Table Column Two</td>',
		'</tr>',
	'</table>',
	'<ul>',
		'<li>Un-ordered List-item One</li>',
		'<li>Un-ordered List-item One</li>',
	'</ul>',
	'<ol>',
		'<li>Ordered List-item One</li>',
		'<li>Ordered List-item Two</li>',
	'</ol>',
	'<blockquote>This is a blockquote</blockquote>'
];