window.addEventListener( 'load', () => {
	var html_change = document.createEvent( 'HTMLEvents' );
	html_change.initEvent( 'change', true, false );

	var html_input = document.createEvent( 'HTMLEvents' );
	html_input.initEvent( 'input', true, false );

	var mouse_click = document.createEvent( 'MouseEvents' );
	mouse_click.initEvent( 'click', true, false );

	var	msg			= null,
		url			= '',
		line		= [],
		logos		= {},
		token		= '',
		voice		= [ -1, null ],
		audios		= null,
		colors		= {},
		inchat		= false,
		infos		= null,
		users		= {};
		words		= {},
		repeat		= [ 0, '' ],
		stream		= null,
		voices		= [],
		channel		= [ '', '' ],
		nosleep		= null,
		viewers		= [ null, null ],
		channels	= [],
		language	= null,
		onscroll	= [ false, true ],
		followers	= [ 0, null ],
		ksettings	= [ 'voice', 'rate', 'pitch', 'volume', 'sentences', 'words', 'links', 'emotes', 'ascii', 'lusername', 'lmessage', 'repeat', 'flooding' ],
		sentences	= {},
		templates	= {},
		originals	= {
			chat:		[ '',	'$username$, $message$',					'',	true, true ],
			reward:		[ '',	'$username$, $reward$, $cost$',				'',	true, true ],
			follow:		[ '',	'$usernames$',								'',	true, true ],
			cheer:		[ '',	'$username$, $bits$',						'',	true, true ],
			cheer_msg:	[ '',	'$username$, $message$, $bits$',			'',	true, true ],
			sub:		[ '',	'$username$',								'',	true, true ],
			sub_msg:	[ '',	'$username$, $message$',					'',	true, true ],
			resub:		[ '',	'$username$',								'',	true, true ],
			resub_msg:	[ '',	'$username$, $message$',					'',	true, true ],
			gift:		[ '',	'$gifter$, $recipient$, $cumul$, $count$',	'',	true, true ],
			gift_myst:	[ '',	'$gifter$, $subs$, $count$',				'',	true, true ],
			gift_renew:	[ '',	'$gifter$, $recipient$',					'',	true, true ],
			hosted:		[ '',	'$username$, $viewers$',					'',	true, true ],
			raid:		[ '',	'$username$, $viewers$',					'',	true, true ],
		},
		rcallbacks	= {};

	var	dbase = document.body,
		dchat = null,
		dsettings = null,
		btest = null,
		bexport = null,
		bimport = null,
		bconnect = null,
		bexcluded = null,
		bsentences = null,
		bdisconnect = null,
		tviewers = null,
		tfollowers = null,
		dtoast = null,
		zbase = null,
		zlogo = null,
		zname = null,
		zstatus = null,
		zgame = null,
		svoice = null,
		irate = null,
		iascii = null,
		iaudio = null,
		ilinks = null,
		ilogos = null,
		iontop = null,
		ipitch = null,
		iemotes = null,
		irepeat = null,
		ivolume = null,
		ichannel = null,
		iflooding = null,
		ilmessages = null,
		itimestamp = null,
		ilusernames = null,
		iautoscroll = null,
		umod = null,
		unormal = null,
		usubscriber = null,
		ubroadcaster = null;

	/**
	 * @desc Loads saved data into the browser's internal storage
	 */
	function load()
	{
		ichannel.value = ( localStorage.getItem( 'channel' ) || '' );
		token = ( localStorage.getItem( 'token' ) || '' );
		iaudio.checked = ( ( localStorage.getItem( 'audio' ) || 'true' ) == 'true' );
		iontop.checked = ( ( localStorage.getItem( 'ontop' ) || 'false' ) == 'true' );

		irate.value = parseFloat( localStorage.getItem( 'rate' ) || 1 );
		ipitch.value = parseFloat( localStorage.getItem( 'pitch' ) || .8 );
		ivolume.value = parseFloat( localStorage.getItem( 'volume' ) || .5 );

		iascii.checked = ( ( localStorage.getItem( 'ascii' ) || 'true' ) == 'true' );
		ilinks.checked = ( ( localStorage.getItem( 'links' ) || 'true' ) == 'true' );
		iemotes.checked = ( ( localStorage.getItem( 'emotes' ) || 'true' ) == 'true' );
		irepeat.value = parseFloat( localStorage.getItem( 'repeat' ) || 1000 );
		ilusernames.value = parseFloat( localStorage.getItem( 'lusernames' ) || 0 );
		ilmessages.value = parseFloat( localStorage.getItem( 'lmessages' ) || 0 );
		iflooding.value = parseInt( localStorage.getItem( 'flooding' ) || 0 );

		itimestamp.checked = ( ( localStorage.getItem( 'timestamp' ) || 'true' ) == 'true' );
		ilogos.checked = ( ( localStorage.getItem( 'logos' ) || 'false' ) == 'true' );
		iautoscroll.checked = ( ( localStorage.getItem( 'autoscroll' ) || 'true' ) == 'true' );

		umod.checked = ( ( localStorage.getItem( 'mod' ) || 'true' ) == 'true' );
		unormal.checked = ( ( localStorage.getItem( 'normal' ) || 'true' ) == 'true' );
		usubscriber.checked = ( ( localStorage.getItem( 'subscriber' ) || 'true' ) == 'true' );
		ubroadcaster.checked = ( ( localStorage.getItem( 'broadcaster' ) || 'true' ) == 'true' );

		ivolume.dispatchEvent( html_change );
		irepeat.dispatchEvent( html_change );
		ilusernames.dispatchEvent( html_change );
		ilmessages.dispatchEvent( html_change );
		iflooding.dispatchEvent( html_change );

		try
		{
			var tmp = JSON.parse( localStorage.getItem( 'channels' ) );
			if ( Array.isArray( tmp ) )
				channels = tmp;
		} catch ( e ) {}

		try
		{
			var tmp = JSON.parse( localStorage.getItem( 'users' ) );
			if ( typeof( tmp ) === 'object' )
			{
				Object.keys( tmp ).forEach( ( user_name ) => {
					var tuser = tmp[ user_name ];
					users[ user_name ] = { name: ( ( typeof( tuser.name ) !== 'undefined' ) ? tuser.name : user_name ) };
					ksettings.forEach( ( key ) => {
						users[ user_name ][ key ] = ( ( typeof( tuser[ key ] ) !== 'undefined' ) ? tuser[ key ] : undefined );
					} );
				} );
			}
		} catch ( e ) {}

		// obsolete
		try
		{
			Object.keys( users ).forEach( ( key ) => {
				Object.keys( users[ key ].words ).forEach( ( skey ) => {
					if ( users[ key ].words[ skey ].length == 2 )
						users[ key ].words[ skey ].push( false );
				} );
			} );
		} catch ( e ) {}

		try
		{
			var keys = Object.keys( originals );
			var tmp = JSON.parse( localStorage.getItem( 'sentences' ) );
			if ( typeof( tmp ) === 'object' )
			{
				Object.keys( tmp ).forEach( ( key ) => {
					var values = tmp[ key ];
					if ( keys.indexOf( key ) >= 0 && Array.isArray( values ) && values.length == 3 && typeof( values[ 0 ] ) === 'string' )
						sentences[ key ] = values;
				} );
			}
		} catch ( e ) {}

		try
		{
			var tmp = JSON.parse( localStorage.getItem( 'words' ) );
			if ( tmp === null )
				tmp = { 'Arubinu42': [ 3, 'Arubinu' ] };
			if ( typeof( tmp ) === 'object' )
				words = tmp;
		} catch ( e ) {}

		// obsolete
		try
		{
			Object.keys( words ).forEach( ( key ) => {
				if ( words[ key ].length == 2 )
					words[ key ].push( false );
			} );
		} catch ( e ) {}

		channels.forEach( ( channel_name ) => { channel_add( channel_name ); } );
		Object.keys( users ).sort().forEach( ( user_name ) => { user_add( user_name, true ); } );
		bwords.innerText = language[ 2 ].manage.variable.replace( '%s', Object.keys( words ).length );

		toggle( 'timestamp' );
		toggle( 'logos' );
		toggle( 'ontop' );
	}

	/**
	 * @desc Backs up data to the browser's internal storage
	 * @param	{Object}			[data]				Specify the data to back up
	 */
	function save( data )
	{
		try
		{
			localStorage.setItem( 'channel', ( data ? data.channel : channel[ 0 ] ) );
			localStorage.setItem( 'token', ( data ? data.token : token ) );
			localStorage.setItem( 'audio', ( data ? data.audio : iaudio.checked.toString() ) );
			localStorage.setItem( 'ontop', ( data ? data.ontop : iontop.checked.toString() ) );

			localStorage.setItem( 'voice', ( data ? data.voice : ( voice[ 1 ] ? ( voice[ 1 ].lang + '|' + voice[ 1 ].name ) : '' ) ) );
			localStorage.setItem( 'rate', ( data ? data.rate : irate.value ) );
			localStorage.setItem( 'pitch', ( data ? data.pitch : ipitch.value ) );
			localStorage.setItem( 'volume', ( data ? data.volume : ivolume.value ) );

			localStorage.setItem( 'ascii', ( data ? data.ascii : iascii.checked.toString() ) );
			localStorage.setItem( 'links', ( data ? data.links : ilinks.checked.toString() ) );
			localStorage.setItem( 'emotes', ( data ? data.emotes : iemotes.checked.toString() ) );
			localStorage.setItem( 'repeat', ( data ? data.repeat : irepeat.value ) );
			localStorage.setItem( 'lusernames', ( data ? data.lusernames : ilusernames.value ) );
			localStorage.setItem( 'lmessages', ( data ? data.lmessages : ilmessages.value ) );
			localStorage.setItem( 'flooding', ( data ? data.flooding : iflooding.value ) );

			localStorage.setItem( 'timestamp', ( data ? data.timestamp : itimestamp.checked.toString() ) );
			localStorage.setItem( 'logos', ( data ? data.logos : ilogos.checked.toString() ) );
			localStorage.setItem( 'autoscroll', ( data ? data.autoscroll : iautoscroll.checked.toString() ) );

			localStorage.setItem( 'mod', ( data ? data.mod : umod.checked ) );
			localStorage.setItem( 'normal', ( data ? data.normal : unormal.checked ) );
			localStorage.setItem( 'subscriber', ( data ? data.subscriber : usubscriber.checked ) );
			localStorage.setItem( 'broadcaster', ( data ? data.broadcaster : ubroadcaster.checked ) );

			localStorage.setItem( 'channels', ( data ? data.channels : JSON.stringify( channels ) ) );
			localStorage.setItem( 'users', ( data ? data.users : JSON.stringify( users ) ) );
			localStorage.setItem( 'sentences', ( data ? data.sentences : JSON.stringify( sentences ) ) );
			localStorage.setItem( 'words', ( data ? data.words : JSON.stringify( words ) ) );
		} catch ( e ) {}
	}

	/**
	 * @desc Import settings from a file
	 * @return	{promise}								resolve or reject
	 */
	function import_config()
	{
		return new Promise( ( resolve, reject ) => {
			var input = document.createElement( 'input' );
			input.type = 'file';
			input.accept = '.config';
			input.onchange = () => {
				if ( !input.files.length )
					return ( reject() );

				const reader = new FileReader();
				reader.onloadend = ( event ) => {
					try
					{
						resolve( JSON.parse( atob( event.target.result ) ) );
					} catch ( e ) {
						reject( language[ 2 ].errors.importer );
					}
				};
				reader.onerror = ( error ) => { reject( error ); };
				reader.readAsText( input.files[ 0 ] );
			};
			input.onerror = ( error ) => { reject( error ); };

			input.dispatchEvent( mouse_click );
		} );
	}

	/**
	 * @desc Exports settings as a file
	 * @param	{Object}			data				The message to be displayed
	 */
	function export_config( data )
	{
		data = btoa( JSON.stringify( data ) );
		var blob = new Blob( [ data ], { type: 'octet/stream' } );
		var url = window.URL.createObjectURL( blob );

		var a = document.createElement( 'a' );
		a.href = url;
		a.download = 'AruChat.config';
		a.style.display = 'none';
		document.body.appendChild( a );

		a.dispatchEvent( mouse_click );

		window.URL.revokeObjectURL( url );
	}

	/**
	 * @desc Send HTTP requests easily
	 * @param	{string}			url					Targeted address
	 * @param	{Object}			[options]			Options to add to the XMLHttpRequest instance
	 * @param	{bool}				[force_url]			Do not add queries intended for the Twitch API
	 * @param	{bool}				[force_return]		Return the XMLHttpRequest instance directly
	 * @return	{promise}								resolve or reject
	 */
	function request( url, options, force_url, force_return )
	{
		return new Promise( ( resolve, reject ) => {
			if ( !force_url )
				url += ( ( url.indexOf( '?' ) > 0 ) ? '&' : '?' );

			var xhr = new XMLHttpRequest();
			xhr.open( 'GET', ( force_url ? url : `${url}client_id=j60clpc1aum0pvvg5xv5bydph7ems7&api_version=5` ) );

			if ( options )
				Object.keys( options ).forEach( ( key ) => { xhr[ key ] = options[ key ]; } );

			xhr.onreadystatechange = () => {
				if ( xhr.readyState == xhr.DONE )
				{
					if ( xhr.status != 200 )
						return ( reject( xhr ) );
					else if ( force_return )
						return ( resolve( xhr ) );

					try
					{
						var data = JSON.parse( xhr.responseText );
						resolve( data );
					} catch ( e ) {
						reject( e );
					}
				}
			};
			xhr.onerror = ( error ) => {
				reject( error );
			};

			xhr.send();
		} );
	}

	function jrequest( url, force_return )
	{
		return new Promise( function( resolve, reject ) {
			var script = document.createElement( 'script' );

			const name = ( '_jsonp_' + Math.round( 100000 * Math.random() ) );
			window[ name ] = function( data ) {
				resolve( data );
				document.body.removeChild( script );
				delete window[ name ];
			};

			script.src = url + ( ( url.indexOf( '?' ) >= 0 ) ? '&' : '?' ) + 'callback=' + name;
			document.body.appendChild( script );
		} );
	}

	/**
	 * @desc Returns the title of the element
	 * @param	{HTMLElement}		elem				Target element
	 * @return	{string}								Title of the element
	 */
	function title_get( elem )
	{
		return ( elem.getAttribute( 'data-original-title' ) || elem.getAttribute( 'title' ) );
	}

	var title_count = 0;
	/**
	 * @desc Initializes the tooltips as well as their refresh
	 * @param	{HTMLElement}		parent				Parent element grouping together all title attributes
	 * @param	{string}			[placement]			Tooltip display direction
	 * @param	{bool|string}		[preserve]			Guard displayed when mouse hovers over it (disabled by default)
	 */
	function title_set( parent, placement, preserve )
	{
		parent = ( parent || document.body );
		Array.from( parent.querySelectorAll( '[title]' ) ).map( ( elem ) => {
			var id = ++title_count;
			var tplacement = placement;
			if ( !tplacement )
			{
				tplacement = 'top';
				tplacement = ( elem.classList.contains( 'tip-left' ) ? 'left' : tplacement );
				tplacement = ( elem.classList.contains( 'tip-right' ) ? 'right' : tplacement );
				tplacement = ( elem.classList.contains( 'tip-bottom' ) ? 'bottom' : tplacement );
			}

			elem.setAttribute( 'data-original-id', id );
			new BSN.Tooltip( elem, { placement: tplacement, delay: 250 } );

			observer.observe( elem, {
				attributes: true,
				attributeFilter: [ 'data-original-title', ]
			} );
			elem.addEventListener( 'show.bs.tooltip', ( event ) => {
				elem.setAttribute( 'data-original-show', '1' );
			} );
			elem.addEventListener( 'shown.bs.tooltip', ( event ) => {
				var tips = [ ...document.querySelectorAll( '.tooltip' ) ];
				tips.forEach( ( tip, index ) => {
					if ( index == ( tips.length - 1 ) )
					{
						tip.setAttribute( 'data-original-id', id );
						if ( !preserve && !tip.getAttribute( 'data-original-action' ) )
						{
							tip.addEventListener( 'click', () => {
								tip.classList.remove( 'show' );
								setTimeout( () => { tip.remove(); }, 1000 );
							} );
						}
					}
					tip.setAttribute( 'data-original-action', 1 );
				} );
			} );
			elem.addEventListener( 'hide.bs.tooltip', ( event ) => {
				elem.setAttribute( 'data-original-show', '0' );
				var tip = document.querySelector( `.tooltip[data-original-id="${id}"]` );
				if ( !preserve || !tip || ( typeof( preserve ) === 'string' && !elem.matches( preserve ) ) )
					return ;

				var clone = tip.cloneNode( true );
				clone.classList.add( 'show', 'clone' );
				tip.parentNode.insertBefore( clone, tip.nextSibling );

				var div = clone.querySelector( '.tooltip-inner div' );
				if ( div )
				{
					var odiv = tip.querySelector( '.tooltip-inner div' );
					div.replaceWith( odiv );
				}

				var hide = () => {
					clone.classList.remove( 'show' );
					setTimeout( () => { clone.remove(); }, 1000 );
				};
				var timeout = setTimeout( hide, 200 );

				[ clone, ...clone.querySelectorAll( '*' ) ].forEach( ( elem ) => {
					elem.addEventListener( 'mousemove', () => {
						if ( timeout )
						{
							clearTimeout( timeout );
							timeout = 0;
						}
					}, true );
				} );
				clone.addEventListener( 'mouseout', ( event ) => {
					var e = ( event.toElement || event.relatedTarget );
					while ( e && e.parentNode && e.parentNode != window )
					{
						if ( e.parentNode == clone || e == clone )
						{
							if ( e.preventDefault )
								e.preventDefault();

							return ( false );
						}

						e = e.parentNode;
					}

					hide();
				}, true );
			} );
		} );
	}

	/**
	 * @desc Returns the name of the current title attribute
	 * @param	{HTMLElement}		elem				Target element
	 * @return	{string}								Current title attribute
	 */
	function title_attr( elem )
	{
		return ( elem.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' );
	}

	/**
	 * @desc Updates the current title attribute
	 * @param	{HTMLElement}		elem				Target element
	 * @param	{string}			title				Replacement title
	 */
	function title_update( elem, title )
	{
		elem.setAttribute( title_attr( elem ), title );
	}

	/**
	 * @desc Convert HTML code to elements
	 * @param	{string}			template			Code HTML
	 * @param	{bool}				first				Return only the first element
	 * @return	{(Array|HTMLElement)}					Element or list of elements
	 */
	function html( template, first )
	{
		var div = document.createElement( 'div' );
		div.innerHTML = template;
		return ( first ? div.children[ 0 ] : div.children );
	}

	/**
	 * @desc Open a toast
	 * @param	{Object}			obj					Data to send to the template
	 * @param	{bool}				autohide			Close the toast when a click is detected (enabled by default)
	 * @return	{HTMLElement}							Toast element
	 */
	function toast( obj, autohide )
	{
		autohide = ( typeof( autohide ) === 'undefined' || autohide );
		obj.autohide = autohide.toString();
		var elem = html( templates.toast( Object.assign( {}, obj, language[ 2 ] ) ), true );
		( dchat ? dchat.parentNode : document.body ).appendChild( elem );

		var instance = new BSN.Toast( elem, { autohide: autohide } );
		if ( typeof( obj.show ) === 'undefined' || obj.show )
			instance.show();

		elem.addEventListener( 'hidden.bs.modal', () => {
			elem.Toast.dispose();
			elem.remove();
		}, false );

		return ( elem );
	}

	/**
	 * @desc Open a modal
	 * @param	{Object}			obj					Data to send to the template
	 * @param	{bool}				[large]				Enlarges the width of the modal
	 * @return	{HTMLElement}							Modal element
	 */
	function modal( obj, large )
	{
		obj.large = !!large;
		var elem = html( templates.modal( Object.assign( {}, obj, language[ 2 ] ) ), true );
		document.body.appendChild( elem );
		title_set( elem );

		if ( obj.footer.input )
		{
			var input = elem.querySelector( '.modal-add-data > input' );
			elem.querySelector( '.modal-add-data > i' ).addEventListener( 'click', () => {
				obj.footer.input.click( input, obj );
			}, false );
			setTimeout( () => { input.focus(); }, 250 );
		}

		if ( obj.footer.confirm )
		{
			elem.querySelector( '.confirm' ).addEventListener( 'click', () => {
				if ( !obj.footer.confirm( elem, obj ) )
					elem.Modal.hide();
			}, false );
		}

		var instance = new BSN.Modal( elem, { backdrop: 'static' } );
		if ( typeof( obj.show ) === 'undefined' || obj.show )
			instance.show();

		elem.addEventListener( 'hidden.bs.modal', () => {
			elem.Modal.dispose();
			elem.remove();
		}, false );

		return ( elem );
	}

	/**
	 * @desc Create a floating drop-down list
	 * @param	{HTMLElement}		elem				HTML element of the list
	 * @return	{Object}								Drop-down list instance
	 */
	function fixed_dropdown( elem )
	{
		var dropdown = new BSN.Dropdown( elem );
		elem.addEventListener( 'click', () => {
			if ( elem.Tooltip )
				elem.Tooltip.hide();
		} );
		elem.parentNode.addEventListener( 'show.bs.dropdown', function( event ) {
			var navbar = elem.matches( '.navbar :scope' );
			var next = elem.querySelector( ':scope.dropdown-toggle, .dropdown-toggle' );
			var menu = ( elem.querySelector( '.dropdown-menu' ) || document.querySelector( `[aria-labelledby=${elem.id}].dropdown-menu` ) );

			var pos = { x: 0, y: 0 };
			while ( next && next.offsetParent )
			{
				next = next.offsetParent;
				pos.x += next.offsetLeft;
				pos.y += next.offsetTop;
			}

			var top = ( navbar ? 40 : pos.y );
			var right = ( navbar ? 5 : ( document.body.offsetWidth - pos.x ) );

			menu.style.position = 'fixed';
			menu.style.top = `${top}px`;
			menu.style.right = `${right}px`;
		}, false );

		return ( dropdown );
	}

	var load_progress = false;
	/**
	 * @desc Refreshed the list of followers
	 */
	function load_followers( force )
	{
		var tchannel = [ channel[ 0 ], channel[ 1 ] ];
		var list = dfollowers.querySelector( '.followers-list' );
		if ( !tchannel[ 0 ] || !tchannel[ 1 ] )
		{
			list.setAttribute( 'data-channel', '' );
			list.innerText = language[ 2 ][ tchannel[ 0 ] ? 'wait' : 'login' ];

			if ( tchannel[ 0 ] )
				setTimeout( load_followers, 500 );

			return ;
		}

		if ( load_progress || ( !force && list.getAttribute( 'data-channel' ) == tchannel[ 0 ] ) )
			return ;

		load_progress = true;
		list.setAttribute( 'data-channel', tchannel[ 0 ] );
		list.innerHTML = `${language[ 2 ].wait}<br />0 / ${tfollowers.innerText}`;
		channel_all_followers( tchannel[ 1 ], ( data, end ) => {
			list.innerHTML = `${language[ 2 ].wait}<br />${data.follows.length} / ${data._total}`;
			if ( !end )
				return ;

			setTimeout( () => {
				data.filter = dfollowers.querySelector( 'input[name=filter]' ).value.trim().toLowerCase();
				data.date_in = dfollowers.querySelector( 'input[name=date-out]' ).getAttribute( 'min' );
				data.date_out = dfollowers.querySelector( 'input[name=date-in]' ).getAttribute( 'max' );
				list.innerHTML = templates.followers( Object.assign( { data: data }, language[ 2 ] ) );

				title_set( list );
				dfollowers.querySelector( 'input[name=filter]' ).dispatchEvent( html_input );
				load_progress = false;
			}, 500 );
		} );
	}

	/**
	 * @desc Initializes the voice and the entire interface
	 * @param	{number}			[passe]				Step of the initialization process
	 */
	function init( passe )
	{
		if ( !passe )
		{
			if ( localStorage.getItem( 'reset' ) === '1' )
				localStorage.clear();

			var loading = document.querySelector( '#loading' );
			request( './languages.json', null, true )
				.then( ( data ) => {
					var list = [];
					Object.keys( data ).forEach( ( item, index ) => {
						list[ data[ item ][ 0 ] ] = item;
					} );

					var lang = localStorage.getItem( 'language' );
					lang = ( ( !lang || lang == 'null' ) ? 'en-US' : lang );
					language = [ lang, list, data[ lang ][ 1 ] ];
					language[ 2 ].site = {
						name: 'AruChat',
						version: document.querySelector( 'script:last-child' ).src.split( '?' ).slice( -1 )[ 0 ]
					};
					Object.keys( language[ 1 ] ).forEach( ( value ) => {
						language[ 2 ].languages.list.push( {
							key: language[ 1 ][ value ],
							value: value
						} );
					} );
					Object.keys( originals ).forEach( ( item ) => {
						originals[ item ][ 0 ] = language[ 2 ].sentences[ item ][ 0 ];
						originals[ item ][ 2 ] = language[ 2 ].sentences[ item ][ 1 ];
					} );

					request( './templates.handlebars', { responseType: 'text' }, true, true )
						.then( ( data ) => {
							var tmp = [ ...data.response.matchAll( /<template id="([A-Za-z-_]*?[^"]*)">((.|\s)*?)<\/template>/g ) ];
							tmp.forEach( ( item ) => {
								templates[ item[ 1 ] ] = Handlebars.compile( item[ 2 ] );
							} );

							document.body.appendChild( html( templates.navbar( language[ 2 ] ), true ) );
							document.body.appendChild( html( templates.chat( language[ 2 ] ), true ) );
							document.body.appendChild( html( templates.panel( language[ 2 ] ), true ) );

							dchat = dbase.querySelector( '#chat > ul' );
							dviewers = dbase.querySelector( '#viewers' );
							dsettings = dbase.querySelector( '#settings' );
							dfollowers = dbase.querySelector( '#followers' );
							badd = dsettings.querySelector( 'button[name=add]' );
							btest = dsettings.querySelector( 'button[name=test]' );
							breset = dsettings.querySelector( 'button[name=reset]' );
							bwords = dsettings.querySelector( 'button[name=words]' );
							bexport = dsettings.querySelector( 'button[name=export]' );
							bimport = dsettings.querySelector( 'button[name=import]' );
							bconnect = dsettings.querySelector( 'button[name=connect]' );
							bsentences = dsettings.querySelector( 'button[name=sentences]' );
							bdisconnect = dsettings.querySelector( 'button[name=disconnect]' );
							tviewers = dbase.querySelector( '.viewers' );
							tfollowers = dbase.querySelector( '.followers' );
							tchangelog = dbase.querySelector( '.changelog' );
							tlanguages = dbase.querySelector( '.languages' );
							svoice = dsettings.querySelector( 'div[name=voice]' );
							irate = dsettings.querySelector( 'input[name=rate]' );
							iuser = dsettings.querySelector( 'input[name=user]' );
							iuseradd = iuser.parentNode.parentNode.querySelector( '.fa-user-plus' );
							iascii = dsettings.querySelector( 'input[name=ascii]' );
							iaudio = dsettings.querySelector( 'input[name=audio]' );
							ilinks = dsettings.querySelector( 'input[name=links]' );
							ilogos = dsettings.querySelector( 'input[name=logos]' );
							iontop = dsettings.querySelector( 'input[name=ontop]' );
							ipitch = dsettings.querySelector( 'input[name=pitch]' );
							iemotes = dsettings.querySelector( 'input[name=emotes]' );
							irepeat = dsettings.querySelector( 'input[name=repeat]' );
							ivolume = dsettings.querySelector( 'input[name=volume]' );
							ichannel = dsettings.querySelector( 'input[name=channel]' );
							iflooding = dsettings.querySelector( 'input[name=flooding]' );
							ilmessages = dsettings.querySelector( 'input[name=lmessages]' );
							itimestamp = dsettings.querySelector( 'input[name=timestamp]' );
							ilusernames = dsettings.querySelector( 'input[name=lusernames]' );
							iautoscroll = dsettings.querySelector( 'input[name=autoscroll]' );
							umod = dsettings.querySelector( 'input[name=users_mod]' );
							unormal = dsettings.querySelector( 'input[name=users_normal]' );
							usubscriber = dsettings.querySelector( 'input[name=users_subscriber]' );
							ubroadcaster = dsettings.querySelector( 'input[name=users_broadcaster]' );

							var menu = dsettings.querySelectorAll( '[data-menu]' );
							menu.forEach( ( elem, index ) => {
								var click = () => {
									menu.forEach( ( selem ) => {
										selem.classList.toggle( 'active', false );
										dsettings.querySelector( selem.getAttribute( 'data-menu' ) ).style.display = 'none';
									} );

									elem.classList.toggle( 'active', true );
									dsettings.querySelector( elem.getAttribute( 'data-menu' ) ).style.display = 'initial';
								};

								elem.addEventListener( 'click', click );
								if ( !index )
									click();
							} );

							dchat.parentNode.addEventListener( 'scroll', ( event ) => {
								if ( onscroll[ 0 ] )
									return ;

								var dchat_parent = dchat.parentNode;
								onscroll[ 1 ] = ( ( dchat_parent.scrollTop + dchat_parent.offsetHeight ) >= ( dchat_parent.scrollHeight - 35 ) );
							} );

							var dlanguages = fixed_dropdown( tlanguages );
							document.querySelectorAll( '[data-lang]' ).forEach( ( elem ) => {
								elem.addEventListener( 'click', () => {
									localStorage.setItem( 'language', elem.getAttribute( 'data-lang' ) );
									window.location.reload( true );
								} ) ;
							} );
							tchangelog.addEventListener( 'click', () => {
								request( './changelog.md', { responseType: 'text' }, true, true )
									.then( ( data ) => {
										var changelog = data.response.replace( /^(v[0-9]+:)$/gm, '<u>\$1</u>' ).replace( /\'(.*)\'/gm, '\'<i>\$1</i>\'' );
										modal( {
											title:			title_get( tchangelog ),
											html:			'<span style="white-space: pre-wrap;">%s</span>'.replace( '%s', changelog ),
											footer: {
												input:		false,
												close:		false,
												confirm:	false
											}
										}, true );
									} )
									.catch( ( error ) => {
										console.error( 'changelog:', error );
									} );
							} );

							/* autohide not work (to deactivate it)
							zbase = toast( {
								show:			false,
								close:			false,
								html:			templates.infos()
							}, false );
							*/
							zbase = html( templates.toast( {
								show:			false,
								close:			false,
								html:			templates.infos()
							} ), true );
							dchat.appendChild( zbase );

							zbase.classList.add( 'infos' );
							zlogo = zbase.querySelector( '.infos-icon > img' );
							zname = zbase.querySelector( '.infos-name' );
							zstatus = zbase.querySelector( '.infos-status' );
							zgame = zbase.querySelector( '.infos-game' );

							dviewers.querySelector( 'input[name=filter]' ).addEventListener( 'input', function() {
								var categories = {};
								var filter = this.value.trim().toLowerCase();

								dviewers.querySelectorAll( '[data-username]' ).forEach( ( elem ) => {
									var show = ( !filter || elem.getAttribute( 'data-username' ).indexOf( filter ) >= 0 );
									elem.parentNode.style.display = ( show ? 'inline-block' : 'none' );

									var category = elem.parentNode.parentNode.getAttribute( 'data-viewers' );
									if ( typeof( categories[ category ] ) === 'undefined' )
										categories[ category ] = 0;
									categories[ category ] += ( show ? 1 : 0 );
								} );

								Object.keys( categories ).forEach( ( category ) => {
									var elem = dviewers.querySelector( `span[data-viewers=${category}]` );
									if ( elem )
										elem.innerText = categories[ category ].toString();
								} );
							} );

							dfollowers.querySelector( '.fa-sync-alt' ).addEventListener( 'click', load_followers );
							dfollowers.querySelector( 'input[name=filter]' ).addEventListener( 'input', function() {
								var filter = this.value.trim().toLowerCase();
								var date_in = dfollowers.querySelector( 'input[name=date-out]' ).getAttribute( 'min' );
								var date_out = dfollowers.querySelector( 'input[name=date-in]' ).getAttribute( 'max' );

								dfollowers.querySelectorAll( '[data-username]' ).forEach( ( elem ) => {
									var date = elem.getAttribute( 'data-date' );
									var show = ( !filter || elem.getAttribute( 'data-username' ).indexOf( filter ) >= 0 );
									show = ( show && ( date >= date_in && date <= date_out ) );
									elem.style.display = ( show ? 'inline-block' : 'none' );
								} );
							} );

							var date_in = dfollowers.querySelector( 'input[name=date-in]' );
							var date_out = dfollowers.querySelector( 'input[name=date-out]' );
							date_in.addEventListener( 'change', () => {
								var date = date_in.value;
								date_out.setAttribute( 'min', ( date.match( /^\d{4}-\d{2}-\d{2}$/ ) ? date : '2011-01-01' ) );
								dfollowers.querySelector( 'input[name=filter]' ).dispatchEvent( html_input );
							} );
							date_out.addEventListener( 'change', () => {
								var date = date_out.value;
								date_in.setAttribute( 'max', ( date.match( /^\d{4}-\d{2}-\d{2}$/ ) ? date : ( new Date() ).toISOString().substr( 0, 10 ) ) );
								dfollowers.querySelector( 'input[name=filter]' ).dispatchEvent( html_input );
							} );

							date_in.setAttribute( 'min', '2011-01-01' );
							date_out.setAttribute( 'max', ( new Date() ).toISOString().substr( 0, 10 ) );
							date_in.dispatchEvent( html_change );
							date_out.dispatchEvent( html_change );

							loading.querySelector( '.fas' ).className = 'fas fa-mouse';
							loading.querySelector( 'span' ).innerText = language[ 2 ].loading;
							loading.addEventListener( 'click', () => {
								init( 1 );

								if ( !ichannel.value )
								{
									dtoast = toast( {
										show:			true,
										close:			true,
										title:			language[ 2 ].toasts.connection.title,
										body:			language[ 2 ].toasts.connection.body
									}, true );
									dbase.classList.toggle( 'show-settings', true );
								}
								else
									connect();

								loading.remove();
							} );

							var users = '<u>' + [ 'Furiiouzz60', 'Loppeur', 'ToxicRebirth' ].join( '</u>, <u>' ) + '</u>';
							loading.querySelector( '.thanks' ).innerHTML = language[ 2 ].thanks.replace( '%s', users );
						} )
						.catch( ( error ) => {
							console.error( 'templates:', error );
							if ( error instanceof XMLHttpRequest )
								error = `${error.status}: ${error.statusText}`;
							else if ( typeof( error ) !== 'string' )
								error = '';

							loading.style.cursor = 'default';
							loading.querySelector( '.fas' ).className = 'fas fa-exclamation-triangle';
							loading.querySelector( 'span' ).innerText = `${language[ 2 ].errors.templates}\n${error}`;
						} );
				} )
				.catch( ( error ) => {
					console.error( 'languages:', error );
					if ( error instanceof XMLHttpRequest )
						error = `${error.status}: ${error.statusText}`;
					else if ( typeof( error ) !== 'string' )
						error = '';

					loading.style.cursor = 'default';
					loading.querySelector( '.fas' ).className = 'fas fa-exclamation-triangle';
					loading.querySelector( 'span' ).innerText = `Error occurred while loading languages !\n${error}`;
				} );
			return ;
		}

		if ( passe == 1 )
		{
			var lateral = document.querySelectorAll( '.lateral > div' );
			lateral[ 0 ].addEventListener( 'click', () => {
				dchat.parentNode.scrollTo( { top: 0, behavior: 'smooth' } );
			} );
			lateral[ 1 ].addEventListener( 'click', () => {
				dchat.parentNode.scrollTo( { top: ( dchat.parentNode.scrollTop - dchat.parentNode.offsetHeight ), behavior: 'smooth' } );
			} );
			lateral[ 2 ].addEventListener( 'click', () => {
				dchat.parentNode.scrollTo( { top: ( dchat.parentNode.scrollTop + dchat.parentNode.offsetHeight ), behavior: 'smooth' } );
			} );
			lateral[ 3 ].addEventListener( 'click', () => {
				dchat.parentNode.scrollTo( { top: ( dchat.parentNode.scrollHeight + 100 ), behavior: 'smooth' } );
			} );
			lateral[ 4 ].addEventListener( 'click', () => {
				dbase.classList.toggle( 'show-followers', false );
				dbase.classList.toggle( 'show-settings', false );
				dbase.classList.toggle( 'show-viewers' );

				if ( !channel[ 0 ] )
					return ( dviewers.querySelector( '.viewers-list' ).innerText = language[ 2 ].login );
			} );
			lateral[ 5 ].addEventListener( 'click', () => {
				dbase.classList.toggle( 'show-viewers', false );
				dbase.classList.toggle( 'show-settings', false );
				dbase.classList.toggle( 'show-followers' );
				load_followers();
			} );
			lateral[ 6 ].addEventListener( 'click', () => {
				dbase.classList.toggle( 'show-viewers', false );
				dbase.classList.toggle( 'show-followers', false );
				dbase.classList.toggle( 'show-settings' );
			} );
			lateral[ 7 ].addEventListener( 'click', () => {
				dchat.innerText = '';
				onscroll[ 1 ] = true;
			} );

			var delay = 0;
			var timeout = 0;
			var zclick = () => {
				if ( timeout )
					clearTimeout( timeout );

				if ( !delay )
				{
					delay = Date.now();
					timeout = setTimeout( zclick, ( 200 + 10 ) );
					return ;
				}

				if ( ( Date.now() - delay ) < 200 )
					window.open( url || 'https://twitch.tv/' );
				else
					zbase.classList.toggle( 'mini' );

				delay = 0;
			};
			zbase.addEventListener( 'click', zclick );

			badd.addEventListener( 'click', channel_add );
			btest.addEventListener( 'click', () => { speech( language[ 2 ].test.speech, undefined, undefined, undefined, true ); } );
			breset.addEventListener( 'click', () => {
				localStorage.setItem( 'reset', '1' );
				window.location.reload( true );
			} );
			bimport.addEventListener( 'click', () => {
				import_config().then( ( data ) => {

					var change = false;
					Object.keys( data ).forEach( ( key ) => {
						localStorage.setItem( key, data[ key ] );
						if ( key == 'channel' && data[ key ] != channel[ 0 ] )
							change = true;
					} );

					load();
					if ( change )
					{
						disconnect();
						connect();
					}
				} );
			} );
			bexport.addEventListener( 'click', () => {
				var data = {};
				Object.keys( localStorage ).forEach( ( key ) => {
					data[ key ] = localStorage.getItem( key );
				} );

				export_config( data );
			} );
			bconnect.addEventListener( 'click', () => {
				disconnect();
				connect();
			} );
			bsentences.addEventListener( 'click', function() {
				sentences_button( this, null, ( imodal, obj, confirm ) => {
					if ( confirm )
					{
						Object.keys( obj ).forEach( ( key ) => {
							var original = sentence( 0b000, key );
							var value = obj[ key ][ 2 ].value.trim();
							var text = ( ( !value || value == original[ 2 ] ) ? '' : value );
							var chat_enabled = ( obj[ key ][ 0 ].getAttribute( 'data-enabled' ) == 'true' );
							var speech_enabled = ( obj[ key ][ 1 ].getAttribute( 'data-enabled' ) == 'true' );

							var sentences_enabled = ( text || chat_enabled != original[ 0 ] || speech_enabled != original[ 1 ] );
							sentences[ key ] = ( sentences_enabled ? [ text, chat_enabled, speech_enabled ] : undefined );
						} );
					}
				}, ( imodal ) => {
					imodal.Modal.hide();

					sentences = {};
					this.dispatchEvent( mouse_click );
				} );
			} );
			bwords.addEventListener( 'click', function() {
				words_button( this, words, ( imodal, obj, confirm ) => {
					words = obj;
				}, ( imodal, obj, value ) => {
					words = obj;
				} );
			} );
			bdisconnect.addEventListener( 'click', disconnect );

			ichannel.addEventListener( 'keyup', ( event ) => {
				if ( typeof( event.code ) !== 'undefined' && event.code.toLowerCase() === 'enter' )
					connect();
			} );

			iuser.addEventListener( 'input', user_search );
			iuser.addEventListener( 'change', user_search );
			iuseradd.addEventListener( 'click', user_add );

			ivolume.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.volume.change.replace( '%d', parseInt( parseFloat( this.value ) * 100 ) ) ); } );
			ilusernames.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.limit.usernames.change.replace( '%d', parseInt( this.value ) ) ); } );
			ilmessages.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.limit.messages.change.replace( '%d', parseInt( this.value ) ) ); } );
			irepeat.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.repeat.change.replace( '%d', parseInt( this.value ) ) ); } );
			iflooding.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.flooding.change.replace( '%d', parseInt( this.value ) ) ); } );
			itimestamp.addEventListener( 'click', function() { toggle( 'timestamp' ); } );
			ilogos.addEventListener( 'click', function() { toggle( 'logos' ); } );
			iontop.addEventListener( 'click', function() { toggle( 'ontop' ); } );

			var more = ichannel.parentNode.querySelector( ':scope > .fas' );
			more.addEventListener( 'click', function() {
				var imodal = modal( {
					title:			title_get( this ),
					html:			templates.channels( {
						token: {
							title:			language[ 2 ].modals.token.title,
							value:			token,
							placeholder:	language[ 2 ].modals.token.placeholder,
						},
						tuto: {
							title:			language[ 2 ].modals.token.tuto,
							step1: {
								button:		language[ 2 ].modals.token.step1.title,
								values: {
									1:		language[ 2 ].modals.token.step1[ '1' ],
									2:		language[ 2 ].modals.token.step1[ '2' ],
									22:		language[ 2 ].modals.token.step1[ '2-2' ],
									23:		language[ 2 ].modals.token.step1[ '2-3' ],
									3:		language[ 2 ].modals.token.step1[ '3' ],
									4:		language[ 2 ].modals.token.step1[ '4' ]
								}
							},
							step2: {
								button:		language[ 2 ].modals.token.step2.title,
								values: {
									1:		language[ 2 ].modals.token.step2[ '1' ],
									2:		language[ 2 ].modals.token.step2[ '2' ],
									3:		language[ 2 ].modals.token.step2[ '3' ],
									4:		language[ 2 ].modals.token.step2[ '4' ],
									5:		language[ 2 ].modals.token.step2[ '5' ]
								}
							}
						}
					} ),
					footer: {
						input:		false,
						close:		true,
						confirm:	( elem, cobj ) => {
							var value = elem.querySelector( 'input' ).value.trim();
							if ( value != token )
							{
								token = value;
								if ( channel[ 0 ] )
								{
									disconnect();
									connect();
								}
							}
						}
					}
				} );

				var body = imodal.querySelector( '.modal-body' );
				body.querySelectorAll( 'button' ).forEach( ( btn ) => { btn.addEventListener( 'click', function() {
					this.parentNode.parentNode.querySelectorAll( '.page-item' ).forEach( ( elem ) => { elem.classList.toggle( 'active', false ); } );
					this.parentNode.classList.toggle( 'active', true );
					this.blur();

					var containers = this.parentNode.parentNode.parentNode.querySelectorAll( '.page-container' );
					containers.forEach( ( elem ) => { elem.style.display = 'none'; } );
					containers[ parseInt( this.getAttribute( 'data-tuto' ) ) - 1 ].style.display = 'initial';
				} ) } );
				body.querySelector( '.token-image' ).addEventListener( 'click', function() {
					request( './images/client_id.png', { responseType: 'arraybuffer' }, true, true )
						.then( ( data ) => {
							var blob = new Blob( [ new Uint8Array( data.response ) ], { type: 'image/png' } );
							var image = ( window.URL || window.webkitURL ).createObjectURL( blob );
							var imodal = modal( {
								title:			title_get( this ),
								html:			'<img src="%s" style="max-width: 100%;" />'.replace( '%s', image ),
								footer: {
									input:		false,
									close:		false,
									confirm:	false
								}
							}, true );

							imodal.addEventListener( 'hidden.bs.modal', ( event ) => {
								more.dispatchEvent( mouse_click );
							}, false );
						} )
						.catch( ( error ) => {
							console.error( 'token-image:', error );
						} );
				} );
			} );
			ivolume.parentNode.querySelector( ':scope > .fas' ).addEventListener( 'click', () => {
				if ( window.speechSynthesis.speaking )
					window.speechSynthesis.cancel();

				ivolume.value = 0;
				ivolume.dispatchEvent( html_change );
			} );
			iflooding.parentNode.querySelector( ':scope > .fas' ).addEventListener( 'click', () => { iflooding.value = 0; iflooding.dispatchEvent( html_change ); } );

			title_set();
			Array.from( document.querySelectorAll( '.custom-toggle' ) ).map( elem => new BSN.Collapse( elem ) );
			Array.from( document.querySelectorAll( 'input[type=checkbox], button' ) ).map( elem => document.addEventListener( 'click', () => { elem.blur(); } ) );

			load();
			setInterval( save, 1000 );
			setInterval( () => {
				if ( inchat || window.speechSynthesis.speaking || !line.length )
					return ;

				var [ text, user, flags, extra, message ] = line.shift();
				if ( user && !user_get( user ) && flags )
				{
					var mod = ( flags.mod && !umod.checked );
					var subscriber = ( flags.subscriber && !usubscriber.checked );
					var broadcaster = ( flags.broadcaster && !ubroadcaster.checked );
					var normal = ( !flags.mod && !flags.subscriber && !flags.broadcaster && !unormal.checked );

					if ( mod || subscriber || broadcaster || normal )
						return ;
				}

				speech( text, true, user, flags, extra, message );
			}, 50 );

			channel_next();
		}

		if ( 'speechSynthesis' in window )
		{
			if ( !passe )
				enable_speech.remove();

			voices = window.speechSynthesis.getVoices();
			if ( voices.length == 0 )
				return ( window.speechSynthesis.addEventListener( 'voiceschanged', () => { init( 2 ); } ) );

			var smenu = svoice.querySelector( '.dropdown-menu' );
			smenu.querySelectorAll( ':scope > a' ).forEach( ( item ) => { item.remove(); } );

			var check_voice = false;
			voices.forEach( ( item, index ) => { check_voice = ( check_voice || ( `${item.lang}|${item.name}` == localStorage.getItem( 'voice' ) ) ); } );

			voices.sort( ( a, b ) => { return ( ( a.lang < b.lang ) ? -1 : ( a.lang > b.lang ) ); } );
			voices.forEach( ( item, index ) => {
				var text = `[${item.lang}] ${item.name}`;
				if ( ( check_voice && `${item.lang}|${item.name}` == localStorage.getItem( 'voice' ) ) || ( !check_voice && item.default ) )
				{
					voice = [ index, item ];
					svoice.querySelector( ':scope > button' ).innerText = text;

					var span = document.createElement( 'span' );
					span.textContent = text;
					svoice.setAttribute( title_attr( svoice ), span.innerHTML );
				}

				var option = document.createElement( 'a' );
				option.href = '#';
				option.className = 'dropdown-item';
				option.innerText = text;

				smenu.appendChild( option );
			} );

			var dvoice = fixed_dropdown( svoice );
			svoice.parentNode.addEventListener( 'click', ( event ) => {
				if ( !event.target.classList.contains( 'dropdown-item' ) )
					return ;

				var index = Array.prototype.indexOf.call( event.target.parentNode.children, event.target );
				var tvoice = voices[ index ];
				var text = `[${tvoice.lang}] ${tvoice.name}`;

				voice = [ index, tvoice ];
				svoice.querySelector( ':scope > button' ).innerText = text;

				var span = document.createElement( 'span' );
				span.textContent = text;
				svoice.setAttribute( title_attr( svoice ), span.innerHTML );
			} );

			msg = new SpeechSynthesisUtterance();
			msg.onend = () => { inchat = false; };

			speech( ' ' );
		}
		else
			alert( language[ 2 ].unsupported );
	}

	/**
	 * @desc Connect to the Twitch channel
	 */
	function connect()
	{
		bconnect.blur();
		ichannel.value = ichannel.value.trim();

		line = [];
		channel = [ ichannel.value, '' ];
		channels = [];
		followers = [ 0, null ];

		document.querySelectorAll( '.channel input' ).forEach( ( elem ) => {
			var value = elem.value;
			if ( value )
				channels.push( value );
		} );

		if ( channel[ 0 ] )
			ComfyJS.Init( channel[ 0 ], ( token || null ), [ channel[ 0 ] ].concat( channels ) );

		if ( dtoast )
		{
			if ( dtoast.Toast )
				dtoast.Toast.hide();

			setTimeout( () => { dtoast.remove(); dtoast = null; }, 1000 );
		}
	}

	/**
	 * @desc Disconnecting from the Twitch channel
	 */
	function disconnect( text )
	{
		bdisconnect.blur();
		bdisconnect.disabled = true;

		try
		{
			ComfyJS.Disconnect();
			if ( channel[ 0 ] )
			{
				var channel_all = [ channel[ 0 ] ].concat( channels ).join( ', ' );
				chat( ( ( typeof( text ) === 'string' ) ? text : language[ 2 ].chat.disconnected ).replace( /\$channel_name\$/g, channel_all ), undefined, { disconnected: true } );
			}
		} catch ( e ) {}

		url = '';
		line = [];
		infos = null;
		stream = null;
		channel = [ '', '' ];
		viewers = [ null, null ];
		followers = [ 0, null ];

		update();
	}

	/**
	 * @desc Updates the channel information that is displayed
	 */
	function update()
	{
		var cinfos = ( typeof( infos ) === 'object' && infos !== null );
		var cstream = ( typeof( stream ) === 'object' && stream !== null );
		var data = ( cstream ? stream : infos );
		var subdata = ( cstream ? stream.channel : infos );

		if ( cstream != zbase.classList.contains( 'online' ) )
		{
			try
			{
				nosleep[ cstream ? 'enable' : 'disable' ]();
			} catch ( e ) {}

			try
			{
				if ( audios && iaudio && iaudio.checked )
					audios[ cstream ? 0 : 1 ].play();
			} catch ( e ) {}
		}

		zbase.classList.toggle( 'online', !!cstream );
		zbase.classList.toggle( 'show', ( cinfos || cstream ) );
		if ( cinfos || cstream )
		{
			// subdata.mature: +18
			url = ( subdata ? subdata.url : '' );
			zname.innerText = ( subdata ? subdata.display_name : '...' );
			zstatus.innerText = ( subdata ? subdata.status : '...' );
			zgame.innerText = ( data ? data.game : '...' );

			channel_logo( subdata._id, subdata, ( channel_id, data, logo ) => {
				if ( channel[ 1 ] == channel_id )
					zlogo.src = logo;
			} );
		}

		tviewers.innerText = ( cstream ? stream.viewers.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ' ' ) : ( ( viewers[ 0 ] && typeof( viewers[ 0 ].chatter_count ) === 'number' ) ? viewers[ 0 ].chatter_count.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ' ' ) : '-' ) );
		tfollowers.innerText = ( ( typeof( followers[ 1 ] ) === 'object' && followers[ 1 ] !== null ) ? followers[ 0 ].toString().replace( /\B(?=(\d{3})+(?!\d))/g, ' ' ) : '-' );
	}

	/**
	 * @desc Add an extra channel to watch
	 * @param	{string}			channel_name		Twitch Channel name
	 */
	function channel_add( channel_name )
	{
		channel_name = ( ( typeof( channel_name ) === 'string' ) ? channel_name : '' );

		var elem = html( templates.channel( { value: channel_name } ), true );
		elem.querySelector( '.fas' ).addEventListener( 'click', () => {
			elem.remove();
		} );

		var audio = document.querySelector( '.connection [name=audio]' ).closest( 'li' );
		audio.parentNode.insertBefore( elem, audio );
	}

	/**
	 * @desc Generates a logo blob of the requested channel
	 * @param	{string}			channel_id			Twitch Channel ID
	 * @param	{Object}			data				Twitch Channel infos
	 * @param	{function}			[callback]			Call this function when logo retrieval is complete
	 */
	function channel_logo( channel_id, data, callback )
	{
		var exist = false;
		if ( !channel_id )
			return ;

		var dlogo = 'images/default.png';
		var tlogo = ( data && data.logo );
		var exist = ( typeof( logos[ channel_id ] ) !== 'undefined' );
		if ( tlogo )
		{
			if ( !exist || tlogo != logos[ channel_id ][ 0 ] || !logos[ channel_id ][ 1 ] )
			{
				logos[ channel_id ] = [ tlogo, null ];
				request( tlogo, { responseType: 'arraybuffer' }, true, true )
					.then( ( data ) => {
						var blob = new Blob( [ new Uint8Array( data.response ) ], { type: 'image/png' } );
						logos[ channel_id ][ 1 ] = ( window.URL || window.webkitURL ).createObjectURL( blob );
						callback( channel_id, data, logos[ channel_id ][ 1 ] );
					} )
					.catch( ( error ) => {
						console.error( 'logo:', error );
						callback( channel_id, data, dlogo );
					} );
			}
			else if ( exist )
				callback( channel_id, data, ( logos[ channel_id ][ 1 ] ? logos[ channel_id ][ 1 ] : dlogo ) );
		}
		else
		{
			logos[ channel_id ] = [ dlogo, null ];
			callback( channel_id, data, dlogo );
		}
	}

	var channel_count = 0;
	/**
	 * @desc Manage the up-to-date stream information
	 */
	function channel_next()
	{
		--channel_count;
		if ( channel_count > 0 )
			return ;

		channel_count = 3;
		setTimeout( channel_update, 5000 );
	}

	/**
	 * @desc Request update of stream information
	 */
	function channel_update()
	{
		var tchannel = [ channel[ 0 ], channel[ 1 ] ];
		if ( !tchannel[ 1 ] )
			return ( setTimeout( channel_update, 500 ) );

		dsettings.querySelectorAll( '[data-user]' ).forEach( ( elem ) => {
			var elem_name = elem.getAttribute( 'data-user' ).trim().toLowerCase();
			if ( user_get( elem_name ) )
				return ;

			delete users[ elem_name ];
			elem.remove();
		} );

		channel_stream( tchannel[ 1 ], ( data ) => {
			stream = data;
			update();
			channel_next();
		} );

		channel_viewers( channel[ 0 ], ( data ) => {
			if ( typeof( data ) === 'object' && typeof( data.data ) === 'object' )
				viewers[ 0 ] = data.data;

			data = viewers[ 0 ];
			var stringify = JSON.stringify( data );
			if ( stringify != viewers[ 1 ] )
			{
				viewers[ 1 ] = stringify;
				data.filter = dviewers.querySelector( 'input[name=filter]' ).value.trim().toLowerCase();
				data.keys = [ 'broadcaster', 'admins', 'global_mods', 'moderators', 'vips', 'staff', 'viewers' ];
				dviewers.querySelector( '.viewers-list' ).innerHTML = templates.viewers( Object.assign( { data: data }, language[ 2 ] ) );
			}
			title_set( dviewers.querySelector( '.viewers-list' ) );
			dviewers.querySelector( 'input[name=filter]' ).dispatchEvent( html_input );

			update();
			channel_next();
		} );

		channel_followers( tchannel[ 1 ], ( data ) => {
			if ( channel[ 1 ] != tchannel[ 1 ] )
				return ( channel_next() );

			var current = {};
			data.follows.forEach( ( item ) => { current[ item.user._id ] = item.user.display_name; } );

			if ( followers[ 1 ] )
			{
				var arrivals = [];
				Object.keys( current ).forEach( ( user_id ) => {
					if ( typeof( followers[ 1 ][ user_id ] ) !== 'string' )
					{
						var user_name = current[ user_id ];
						followers[ 1 ][ user_id ] = user_name;
						arrivals.push( user_name );
					}
				} );

				followers[ 0 ] = data._total;
				if ( arrivals.length )
				{
					if ( localStorage.getItem( 'debug' ) )
						console.log( 'onFollow:', arrivals );

					var usernames = arrivals.join( ', ' );
					var [ chat_enabled, speech_enabled, template ] = sentence( 0b100, 'follow' );
					if ( chat_enabled )
						chat( `New follower(s): ${usernames}` );
					if ( speech_enabled )
						speech( template.replace( /\$usernames\$/g, usernames ) );
				}
			}
			else
				followers = [ data._total, current ];

			update();
			channel_next();
		} );
	}

	/**
	 * @desc Get information about the Twitch channel
	 * @param	{string}			channel_id			Twitch Channel ID
	 * @param	{function}			callback			Returns the object resulting from the request
	 */
	function channel_infos( channel_id, callback )
	{
		if ( !channel_id )
			return ;

		request( `https://api.twitch.tv/kraken/channels/${channel_id}` )
			.then( ( data ) => { callback( data ); } )
			.catch( ( error ) => {
				console.error( 'infos:', error );
				disconnect();
			} );
	}

	/**
	 * @desc Get information related to the current Stream
	 * @param	{string}			channel_id			Twitch Channel ID
	 * @param	{function}			callback			Returns the object resulting from the request
	 */
	function channel_stream( channel_id, callback )
	{
		if ( !channel_id )
			return ;

		request( `https://api.twitch.tv/kraken/streams?channel=${channel_id}` )
			.then( ( data ) => {
				try
				{
					callback( data.streams[ 0 ] );
				} catch ( e ) {}
			} )
			.catch( ( error ) => {
				console.error( 'stream:', error );
				stream = null;
				update();
			} );
	}

	/**
	 * @desc Get the latest Twitch channel viewers
	 * @param	{string}			channel_name		Twitch Channel name
	 * @param	{function}			callback			Returns the object resulting from the request
	 */
	function channel_viewers( channel_name, callback )
	{
		if ( !channel_name )
			return ;

		channel_name = channel_name.toLowerCase();
		jrequest( `https://tmi.twitch.tv/group/user/${channel_name}/chatters` )
			.then( ( data ) => { callback( data ); } )
			.catch( ( error ) => { console.error( 'viewers:', error ); } );
	}

	/**
	 * @desc Get the last followers of the Twitch channel
	 * @param	{string}			channel_id			Twitch Channel ID
	 * @param	{function}			callback			Returns the object resulting from the request
	 */
	function channel_followers( channel_id, callback, cursor )
	{
		if ( !channel_id )
			return ;

		cursor = ( cursor ? `&cursor=${cursor}` : '' );
		request( `https://api.twitch.tv/kraken/channels/${channel_id}/follows?limit=100&direction=desc${cursor}` )
			.then( ( data ) => { callback( data ); } )
			.catch( ( error ) => { console.error( 'followers:', error ); } );
	}

	/**
	 * @desc Get the last followers of the Twitch channel
	 * @param	{string}			channel_id			Twitch Channel ID
	 * @param	{function}			callback			Returns the object resulting from the request
	 * @param	{object}			[data]				Data of last request
	 */
	function channel_all_followers( channel_id, callback, data )
	{
		if ( !channel_id )
			return ;

		var cursor = false;
		if ( data )
		{
			cursor = data._cursor;
			data._cursor = false;
		}

		channel_followers( channel[ 1 ], ( tdata ) => {
			if ( tdata )
			{
				if ( data )
				{
					data._cursor = tdata._cursor;
					for ( var i = 0; i < tdata.follows.length; ++i )
						data.follows.unshift( tdata.follows[ i ] );
				}
				else
					data = tdata;
			}

			var end = ( !data || !tdata || typeof( data._cursor ) !== 'string' || !data._cursor );
			if ( data && end )
				delete data._cursor;

			callback( data, end );
			if ( !end )
				setTimeout( () => { channel_all_followers( channel_id, callback, data ); }, 250 );
		}, cursor );
	}

	/**
	 * @desc Returns the requested user if it exists
	 * @param	{string}			user_name			User name to add
	 * @return	{(false|Object)}						User object
	 */
	function user_get( user_name )
	{
		if ( user_name )
			user_name = user_name.trim().toLowerCase();

		return ( ( user_name && typeof( users[ user_name ] ) !== 'undefined' ) ? users[ user_name ] : false );
	}

	/**
	 * @desc Allows you to manage the settings of a particular user
	 * @param	{string}			user_name			User name to add
	 * @param	{bool}				[force]				Allows you to initialize the interface with existing users
	 * @return	{(false|Object)}						User object
	 */
	function user_add( user_name, force )
	{
		iuser.focus();
		user_name = ( ( typeof( user_name ) === 'string' ) ? user_name : iuser.value ).trim().toLowerCase();
		if ( !user_name )
			return ( false );

		var tuser = user_get( user_name );
		if ( force !== true )
		{
			if ( tuser )
				return ( tuser );

			users[ user_name ] = { name: user_name };
		}
		else if ( !tuser || typeof( tuser.name ) === 'undefined' || !tuser.name )
			return ( false );

		ksettings.forEach( ( key ) => {
			if ( typeof( users[ user_name ][ key ] ) === 'undefined' )
				users[ user_name ][ key ] = undefined;
		} );

		var dest = null;
		var dusers = dsettings.querySelector( '.users' );
		dusers.querySelectorAll( '[data-user]' ).forEach( ( elem ) => {
			if ( !dest && elem.getAttribute( 'data-user' ) > user_name )
				dest = elem;
		} );

		var li = html( templates.user( Object.assign( { data: users[ user_name ] }, language[ 2 ] ) ), true );
		if ( dest )
			dest.parentNode.insertBefore( li, dest );
		else
			dusers.appendChild( li );

		var manage = function( data ) {
			if ( !data || data instanceof Event )
			{
				data = {};
				ksettings.forEach( ( key ) => {
					data[ key ] = users[ user_name ][ key ];
				} );
			}

			var voice_user = [ -1, null ];
			var imodal = modal( {
				title:			language[ 2 ].users.manage.title.replace( '%s', user_name ),
				html:			templates.user_settings( Object.assign( { data: data }, language[ 2 ] ) ),
				footer: {
					input:		false,
					close:		true,
					confirm:	( elem, cobj ) => {
						var body = elem.querySelector( '.modal-body' );
						body.querySelectorAll( '.value input' ).forEach( ( elem ) => {
							var input_name = elem.getAttribute( 'name' );
							var input_checked = body.querySelector( 'input[name=%s][type=checkbox]'.replace( '%s', input_name ) ).checked;
							users[ user_name ][ input_name ] = ( input_checked ? elem[ elem.matches( '[type=checkbox]' ) ? 'checked' : 'value' ] : undefined );
						} );

						users[ user_name ].voice = ( ( body.querySelector( '.title input[name=voice][type=checkbox]' ).checked && voice_user && voice_user[ 1 ] ) ? ( voice_user[ 1 ].lang + '|' + voice_user[ 1 ].name ) : undefined );
						users[ user_name ].sentences = ( body.querySelector( '.title input[name=sentences][type=checkbox]' ).checked ? data.sentences : undefined );
						users[ user_name ].words = ( body.querySelector( '.title input[name=words][type=checkbox]' ).checked ? data.words : undefined );
					}
				}
			} );

			var body = imodal.querySelector( '.modal-body' );
			body.querySelectorAll( '.title input[type=checkbox]' ).forEach( ( elem ) => {
				var elem_name = elem.getAttribute( 'name' );
				var elem_change = () => {
					elem.parentNode.parentNode.parentNode.querySelectorAll( '.value .fas, .value input, .value button' ).forEach( ( ielem ) => {
						if ( ielem.classList.contains( 'fas' ) )
							ielem.classList.toggle( 'disabled', !elem.checked );
						else
							ielem.disabled = !elem.checked;
					} );
				};

				elem.addEventListener( 'click', elem_change );
				elem_change();
			} );

			var usvoice = body.querySelector( '.value div[name=voice]' );
			var smenu = usvoice.querySelector( '.dropdown-menu' );

			var check_voice = false;
			voices.forEach( ( item, index ) => { check_voice = ( check_voice || ( `${item.lang}|${item.name}` == localStorage.getItem( 'voice' ) ) ); } );

			voices.forEach( ( item, index ) => {
				var text = `[${item.lang}] ${item.name}`;
				if ( ( check_voice && `${item.lang}|${item.name}` == data.voice ) || ( !check_voice && item.default ) )
				{
					voice_user = [ index, item ];
					usvoice.querySelector( ':scope > button' ).innerText = text;

					var span = document.createElement( 'span' );
					span.textContent = text;
					usvoice.setAttribute( title_attr( usvoice ), span.innerHTML );
				}

				var option = document.createElement( 'a' );
				option.href = '#';
				option.className = 'dropdown-item';
				option.innerText = text;

				smenu.appendChild( option );
			} );

			var dvoice = fixed_dropdown( usvoice );
			usvoice.parentNode.addEventListener( 'click', ( event ) => {
				if ( !event.target.classList.contains( 'dropdown-item' ) )
					return ;

				var index = Array.prototype.indexOf.call( event.target.parentNode.children, event.target );
				var tvoice = voices[ index ];
				var text = `[${tvoice.lang}] ${tvoice.name}`;

				voice_user = [ index, tvoice ];
				usvoice.querySelector( ':scope > button' ).innerText = text;

				var span = document.createElement( 'span' );
				span.textContent = text;
				usvoice.setAttribute( title_attr( usvoice ), span.innerHTML );
			} );

			body.querySelector( 'button[name=sentences]' ).addEventListener( 'click', function() {
				body.querySelectorAll( '.value input' ).forEach( ( elem ) => {
					var input_name = elem.getAttribute( 'name' );
					var input_checked = body.querySelector( 'input[name=%s][type=checkbox]'.replace( '%s', input_name ) ).checked;

					var value = undefined;
					if ( input_name == 'voice' )
						value = ( voice_user ? ( voice_user[ 1 ].lang + '|' + voice_user[ 1 ].name ) : undefined );
					else
						value = ( input_checked ? elem.value : undefined );

					data[ input_name ] = value;
				} );

				sentences_button( this, ( data.sentences || {} ), ( imodal, all, confirm ) => {
					if ( confirm )
					{
						if ( typeof( data.sentences ) === 'undefined' )
							data.sentences = {};

						Object.keys( all ).forEach( ( key ) => {
							var original = sentence( 0b100, key, data.sentences );
							var value = all[ key ][ 2 ].value.trim();
							var text = ( ( !value || value == original[ 2 ] ) ? '' : value );
							var chat_enabled = ( all[ key ][ 0 ].getAttribute( 'data-enabled' ) == 'true' );
							var speech_enabled = ( all[ key ][ 1 ].getAttribute( 'data-enabled' ) == 'true' );

							var sentences_enabled = ( text || chat_enabled != original[ 0 ] || speech_enabled != original[ 1 ] );
							data.sentences[ key ] = ( sentences_enabled ? [ text, chat_enabled, speech_enabled ] : undefined );
						} );
					}

					manage( data );
				}, ( imodal ) => {
					imodal.Modal.hide();

					data.sentences = {};
					this.dispatchEvent( mouse_click );
				} );
			} );

			body.querySelector( 'button[name=words]' ).addEventListener( 'click', function() {
				words_button( this, ( data.words || {} ), ( imodal, obj, confirm ) => {
					data.words = obj;
					manage( data );
				}, ( imodal, obj, value ) => {
					data.words = obj;
				} );
			} );
			body.querySelector( 'button[name=words]' ).innerText = language[ 2 ].manage.variable.replace( '%s', Object.keys( data.words || {} ).length );

			var uivolume = body.querySelector( '.value input[name=volume]' );
			var uilusername = body.querySelector( '.value input[name=lusername]' );
			var uilmessage = body.querySelector( '.value input[name=lmessage]' );
			var uirepeat = body.querySelector( '.value input[name=repeat]' );
			var uiflooding = body.querySelector( '.value input[name=flooding]' );

			uivolume.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.volume.change.replace( '%d', parseInt( parseFloat( this.value ) * 100 ) ) ); } );
			uilusername.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.limit.usernames.change.replace( '%d', parseInt( this.value ) ) ); } );
			uilmessage.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.limit.messages.change.replace( '%d', parseInt( this.value ) ) ); } );
			uirepeat.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.repeat.change.replace( '%d', parseInt( this.value ) ) ); } );
			uiflooding.addEventListener( 'change', function() { title_update( this, language[ 2 ].voice.flooding.change.replace( '%d', parseInt( this.value ) ) ); } );

			uivolume.parentNode.querySelector( ':scope > .fas' ).addEventListener( 'click', () => { uivolume.value = 0; uivolume.dispatchEvent( html_change ); } );
			uiflooding.parentNode.querySelector( ':scope > .fas' ).addEventListener( 'click', () => { uiflooding.value = 0; uiflooding.dispatchEvent( html_change ); } );

			uivolume.dispatchEvent( html_change );
			uirepeat.dispatchEvent( html_change );
			uilusername.dispatchEvent( html_change );
			uilmessage.dispatchEvent( html_change );
			uiflooding.dispatchEvent( html_change );

			Array.from( body.querySelectorAll( '.custom-toggle' ) ).map( elem => new BSN.Collapse( elem ) );
			Array.from( body.querySelectorAll( 'input[type=checkbox], button' ) ).map( elem => document.addEventListener( 'click', () => { elem.blur(); } ) );

			var reset = document.createElement( 'button' );
			reset.className = 'btn btn-sm btn-danger';
			reset.innerText = language[ 2 ].modals.users.reset.button;
			reset.title = language[ 2 ].modals.users.reset.title;
			reset.addEventListener( 'click', () => {
				imodal.Modal.hide();

				users[ user_name ] = { name: user_name };
				this.dispatchEvent( mouse_click );
			} );
			imodal.querySelector( '.modal-footer' ).prepend( reset );
		};

		var buttons = li.querySelectorAll( 'i' );
		buttons[ 0 ].addEventListener( 'click', manage );
		buttons[ 1 ].addEventListener( 'click', function() {
			user_del( user_name );
			this.Tooltip.dispose();
		} );
		title_set( li );

		iuser.value = '';
		user_search();

		return ( users[ user_name ] );
	}

	/**
	 * @desc Delete a specific user from the manager
	 * @param	{string}			user_name			User name to delete
	 */
	function user_del( user_name )
	{
		delete users[ user_name ];
		var li = document.querySelector( `.users [data-user="${user_name}"]` );
		if ( li )
			li.remove();
	}

	var user_timeout = 0;
	/**
	 * @desc Retrieve information related to the current Stream
	 * @param	{Event}				event				Targeted address
	 */
	function user_search( event )
	{
		if ( user_timeout )
			clearTimeout( user_timeout );

		if ( event )
			return ( user_timeout = setTimeout( user_search, 500 ) );

		var user_name = iuser.value.trim().toLowerCase();
		dsettings.querySelectorAll( '[data-user]' ).forEach( ( elem ) => {
			var elem_name = elem.getAttribute( 'data-user' ).trim().toLowerCase();
			var visible = ( !user_name || elem_name.indexOf( user_name ) >= 0 );
			elem.style.display = ( visible ? 'initial' : 'none' );
		} );
	}

	/**
	 * @desc Returns the phrase and its settings
	 * @param	{binary}			mode				0b001: empty originals, 0b010: empty sentences, 0b100: get sentences (global settings)
	 * @param	{string}			type				Type of sentence searched
	 * @param	{(string|Object)}	more				Username to search or object containing the sentences
	 * @return	{Array}									[ Chat is on, Speech is on, Sentence to speak ]
	 */
	function sentence( mode, type, more )
	{
		var chat_enabled = originals[ type ][ 3 ];
		var speech_enabled = originals[ type ][ 4 ];
		var template = originals[ type ][ 2 ];

		var sentences_enabled = ( sentences && typeof( sentences[ type ] ) !== 'undefined' );
		if ( ( mode & 0b100 ) == 0b100 && sentences_enabled )
		{
			var tmp = sentences[ type ];
			chat_enabled = ( ( typeof( tmp[ 1 ] ) !== 'undefined' ) ? tmp[ 1 ] : chat_enabled );
			speech_enabled = ( ( typeof( tmp[ 2 ] ) !== 'undefined' ) ? tmp[ 2 ] : speech_enabled );
			template = ( ( tmp[ 0 ] && tmp[ 0 ].trim() ) ? tmp[ 0 ] : template );
		}

		if ( more && typeof( more ) === 'object' && typeof( more[ type ] ) !== 'undefined' )
		{
			var tmp = more[ type ];
			chat_enabled = ( ( typeof( tmp[ 1 ] ) !== 'undefined' ) ? tmp[ 1 ] : chat_enabled );
			speech_enabled = ( ( typeof( tmp[ 2 ] ) !== 'undefined' ) ? tmp[ 2 ] : speech_enabled );
			template = ( ( tmp[ 0 ] && tmp[ 0 ].trim() ) ? tmp[ 0 ] : template );
		}
		else if ( more && typeof( more ) == 'string' )
		{
			var tuser = user_get( more );
			if ( tuser && typeof( tuser.sentences ) !== 'undefined' && typeof( tuser.sentences[ type ] ) !== 'undefined' )
			{
				var tmp = tuser.sentences[ type ];
				chat_enabled = ( ( typeof( tmp[ 1 ] ) !== 'undefined' ) ? tmp[ 1 ] : chat_enabled );
				speech_enabled = ( ( typeof( tmp[ 2 ] ) !== 'undefined' ) ? tmp[ 2 ] : speech_enabled );
				template = ( ( tmp[ 0 ] && tmp[ 0 ].trim() ) ? tmp[ 0 ] : template );
			}
		}

		template = template.trim();
		if ( ( mode & 0b001 ) == 0b001 && template.trim() == originals[ type ][ 2 ].trim() )
			template = '';
		if ( ( mode & 0b010 ) == 0b010 && sentences_enabled && template.trim() == sentences[ type ][ 2 ].trim() )
			template = '';

		return ( [ chat_enabled, speech_enabled, template ] );
	}

	/**
	 * @desc Open the modal allowing to manage the sentences
	 * @param	{HTMLElement}		button				Button that called this function
	 * @param	{Object}			obj					Object containing the sentences
	 * @param	{function}			[confirm_callback]	Call this function when the confirm or close button is pressed
	 * @param	{function}			[reset_callback]	Call this function when the reset button is pressed
	 */
	function sentences_button( button, obj, confirm_callback, reset_callback )
	{
		var issentences = !obj;
		obj = ( obj ? obj : sentences );

		var all = {};
		var data = {};
		Object.keys( originals ).forEach( ( subkey, index ) => {
			var sdata = sentence( ( issentences ? 0b000 : 0b100 ), subkey, obj );
			var key = ( ( subkey.indexOf( '_' ) > 0 ) ? subkey.slice( 0, subkey.indexOf( '_' ) ) : subkey );

			if ( key == subkey )
				data[ key ] = { key: key, name: originals[ key ][ 0 ], list: [] };

			data[ key ].list.push( {
				subkey:				subkey,
				subname:			originals[ subkey ][ 0 ],
				input: {
					value:			sdata[ 2 ],
					placeholder:	sentence( 0b100, subkey, obj )[ 2 ]
				},
				small:				'<u>%s:</u> '.replace( '%s', language[ 2 ].sentences.variables ) + originals[ subkey ][ 1 ],
				chat:				sdata[ 0 ],
				speech:				sdata[ 1 ]
			} );
		} );

		var imodal = modal( {
			title:			language[ 2 ].voice.sentences.help,
			html:			templates.sentences( { data: Object.values( data ) } ),
			footer: {
				input:		false,
				close:		true,
				confirm:	() => {
					confirm_callback( imodal, all, true );
				}
			}
		} );

		imodal.addEventListener( 'hidden.bs.modal', () => {
			confirm_callback( imodal, all, false );
		}, false );

		var body = imodal.querySelector( '.modal-body' );
		Object.keys( originals ).forEach( ( subkey, index ) => {
			var key = ( ( subkey.indexOf( '_' ) > 0 ) ? subkey.slice( 0, subkey.indexOf( '_' ) ) : subkey );

			var input = body.querySelectorAll( 'input' )[ index ];
			var chat_enabled = body.querySelectorAll( 'i.chat' )[ index ];
			var speech_enabled = body.querySelectorAll( 'i.speech' )[ index ];

			var switch_button = ( selem, on, off, force ) => {
				var bool = [ 'false', 'true' ];
				var value = ( selem.getAttribute( 'data-enabled' ) == 'true' );

				value = ( force ? value : !value );
				selem.setAttribute( 'data-enabled', bool[ value ? 1 : 0 ] );

				selem.classList.toggle( on, value );
				selem.classList.toggle( off, !value );
			};

			all[ subkey ] = [ chat_enabled, speech_enabled, input ];
			chat_enabled.addEventListener( 'click', function() { switch_button( this, 'fa-comment-dots', 'fa-comment-slash' ); } );
			speech_enabled.addEventListener( 'click', function() { switch_button( this, 'fa-volume-up', 'fa-volume-off' ); } );

			switch_button( chat_enabled, 'fa-comment-dots', 'fa-comment-slash', true );
			switch_button( speech_enabled, 'fa-volume-up', 'fa-volume-off', true );
		} );

		if ( reset_callback )
		{
			var reset = document.createElement( 'button' );
			reset.className = 'btn btn-sm btn-danger';
			reset.innerText = language[ 2 ].modals.sentences.reset.button;
			reset.title = language[ 2 ].modals.sentences.reset.title;
			reset.addEventListener( 'click', () => {
				reset_callback( imodal )
			} );
		}

		imodal.querySelector( '.modal-footer' ).prepend( reset );
		title_set( reset );

		Array.from( imodal.querySelectorAll( '.modal-body .nav-link' ) ).map( item => new BSN.Tab( item, { height: true } ) );
	}

	/**
	 * @desc Open the modal allowing to manage the words
	 * @param	{HTMLElement}		button				Button that called this function
	 * @param	{Object}			obj					Object containing the words
	 * @param	{function}			[confirm_callback]	Call this function when the confirm or close button is pressed
	 * @param	{function}			[input_callback]	Call this function when the add button is pressed
	 */
	function words_button( button, obj, confirm_callback, input_callback )
	{
		var get_data = () => {
			var data = { data: [] };
			Object.keys( obj ).forEach( ( word ) => {
				var value = obj[ word ];
				var mode = ( value[ 0 ] >>> 0 ).toString( 2 ).padStart( 3, '0' );
				mode = mode.split( '' ).reverse().join( '' );

				data.data.push( { error: false, word: word, replacement: value[ 1 ], mode: mode } );
			} );

			return ( Object.assign( data, language[ 2 ] ) );
		};
		var set_actions = ( imodal ) => {
			imodal.querySelectorAll( 'tbody > tr' ).forEach( ( elem ) => {
				var key = elem.querySelector( 'th' ).innerText;
				var mode = () => {
					var user = elem.querySelector( '.fa-user' ).classList.contains( 'enabled' );
					var message = elem.querySelector( '.fa-comment-dots' ).classList.contains( 'enabled' );
					var inside = elem.querySelector( '.fa-shapes' ).classList.contains( 'enabled' );

					var tmp = '';
					[ user, message, inside ].reverse().forEach( ( item ) => {
						tmp += ( item ? '1' : '0' );
					} );

					return ( parseInt( tmp, 2 ) );
				};

				elem.querySelectorAll( '.fa-user, .fa-comment-dots, .fa-shapes' ).forEach( ( selem ) => {
					selem.addEventListener( 'click', function() {
						this.classList.toggle( 'enabled' );
						obj[ key ][ 0 ] = mode();
					} );
				} );

				elem.querySelector( '.fa-trash-alt' ).addEventListener( 'click', function() {
					delete obj[ key ];
					elem.remove();
					update_button();
				} );

				elem.querySelector( 'input' ).addEventListener( 'change', function() {
					obj[ key ] = [ mode(), this.value ];
				} );
			} );
		};
		var update_button = () => {
			button.innerText = language[ 2 ].manage.variable.replace( '%s', Object.keys( obj ).length );
		};

		var imodal = modal( {
			title:			language[ 2 ].voice.words.help,
			html:			templates.words( get_data() ),
			footer: {
				input: {
					icon:			'clone',
					value:			'',
					placeholder:	language[ 2 ].modals.words.input,
					click:			( elem, cobj ) => {
						var item = elem.value.trim().toLowerCase();
						Object.keys( obj ).forEach( ( key ) => {
							if ( item == key )
								item = '';
						} );
						if ( !item )
							return ;

						obj[ item ] = [ 2, '' ];
						imodal.querySelector( '.modal-body' ).innerHTML = templates.words( get_data() );
						set_actions( imodal );

						update_button();
						if ( input_callback )
							input_callback( imodal, obj, item );

						elem.value = '';
					}
				},
				close:		true,
				confirm:	false
			}
		}, true );

		imodal.addEventListener( 'hidden.bs.modal', () => {
			confirm_callback( imodal, obj, false );
		}, false );

		set_actions( imodal );
	}

	/**
	 * @desc Add a prefix to the message
	 * @param	{string}			prefix				Targeted address
	 * @param	{(string|Array)}	split_msg			Original message
	 * @param	{string}			[separator]			Separator put after the prefix
	 * @return	{(string|Object)}						Message with prefix
	 */
	function prechat( prefix, split_msg, separator )
	{
		if ( split_msg )
		{
			prefix += ( separator ? separator : ' ' );
			if ( Array.isArray( split_msg ) )
				split_msg.unshift( document.createTextNode( prefix ) );
			else
				split_msg = prefix + split_msg;
		}
		else
			split_msg = prefix;

		return ( split_msg );
	}

	/**
	 * @desc Create an item to display in the chat
	 * @param	{string}			user				Twitch username
	 * @param	{string}			[message]			Message to display and say
	 * @param	{Object}			[flags]				User-related flags
	 * @param	{Object}			[extra]				Other information about the user and the process
	 * @param	{bool}				[special]			If the message is not from a user
	 * @param	{string}			[respeech]			Store the phrase to repeat
	 * @return	{HTMLElement}							Item to add to a list
	 */
	function chat( user, message, flags, extra, special, respeech )
	{
		var dclass = [];
		var timestamp = new Date( parseInt( extra ? extra.timestamp : Date.now() ) );

		var action = ( extra && typeof( extra.messageType ) === 'string' && extra.messageType == 'action' );
		if ( flags && typeof( flags.notime ) === 'boolean' && flags.notime )
			dclass.push( 'notime' );
		if ( flags && typeof( flags.highlighted ) === 'boolean' && flags.highlighted )
			dclass.push( 'highlighted' );
		if ( flags && typeof( flags.connected ) === 'boolean' && flags.connected )
			dclass.push( 'connected' );
		if ( flags && typeof( flags.disconnected ) === 'boolean' && flags.disconnected )
			dclass.push( 'disconnected' );
		if ( action )
			dclass.push( 'action' );

		if ( message && flags && extra )
		{
			var random = ( '#' + ( '00000' + ( Math.random() * 16777216 << 0 ).toString( 16 ) ).substr( -6 ) );
			colors[ extra.userId ] = ( extra.userColor ? extra.userColor : ( ( typeof( colors[ extra.userId ] ) !== 'undefined' ) ? colors[ extra.userId ] : random ) );
		}
		else
			special = true;

		message = ( ( special && typeof( message ) === 'undefined' ) ? user : message );
		var dmessage = document.createElement( 'span' );
		if ( Array.isArray( message ) )
		{
			message.forEach( ( item ) => {
				dmessage.appendChild( item );
				if ( item instanceof HTMLLinkElement && dclass.indexOf( 'links' ) < 0 )
					dclass.push( 'links' );
				if ( item instanceof HTMLImageElement && dclass.indexOf( 'emotes' ) < 0 )
					dclass.push( 'emotes' );
			} );
		}
		else
			dmessage.innerText = message;

		var obj = {
			channel: {
				name:	( ( extra && typeof( extra.channel ) === 'string' ) ? extra.channel : '' ),
				image:	( ( extra && typeof( extra.roomId ) === 'string' && typeof( logos[ extra.roomId ] ) !== 'undefined' && logos[ extra.roomId ][ 1 ] ) ? logos[ extra.roomId ][ 1 ] : './images/default.png' )
			},
			user:		user,
			class:		dclass.join( ' ' ),
			extra:		extra,
			flags:		flags,
			time:		( '0' + timestamp.getHours() ).slice( -2 ) + ':' + ( '0' + timestamp.getMinutes() ).slice( -2 ),
			color:		( extra ? colors[ extra.userId ] : 'initial' ),
			accept:		[ 'broadcaster', 'mod', 'founder', 'vip', 'subscriber', 'premium', 'partner' ],
			message:	dmessage.innerHTML,
			repeat:		btoa( respeech ),
			special:	special,
			timestamp:	timestamp.getTime()
		};

		onscroll[ 0 ] = true;
		var li = html( templates.message( Object.assign( {}, { data: obj }, language[ 2 ] ) ), true );
		dchat.appendChild( li );
		title_set( li, undefined, '.username, .user' );

		var users = li.querySelectorAll( '.username[data-original-id], .user[data-original-id]' );
		if ( users )
		{
			users.forEach( ( elem ) => {
				var user_name = elem.innerText.trim().toLowerCase();
				elem.addEventListener( 'shown.bs.tooltip', ( event ) => {
					var id = elem.getAttribute( 'data-original-id' );
					var tips = [ ...document.querySelectorAll( `.tooltip[data-original-id="${id}"] .tooltip-inner` ) ];
					if ( id && tips.length )
					{
						var tip = tips.slice( -1 )[  0 ];
						if ( !tip.querySelector( 'div' ) )
						{
							var obj = { user: user_get( user_name ) };
							var options = html( templates.user_options( Object.assign( { data: obj }, language[ 2 ] ) ), true );
							tip.appendChild( options );

							var get_trash = () => {
								return ( options.querySelector( '.fa-trash-alt' ) );
							};

							options.querySelector( '.fa-redo-alt' ).addEventListener( 'click', ( event ) => {
								var text = elem.parentElement.getAttribute( 'repeat' );
								text = ( text && atob( text ) );
								speech( text, true );
							} );
							options.querySelector( '.fa-check' ).addEventListener( 'click', ( event ) => {
								get_trash().style.display = 'initial';
								var tuser = user_add( user_name );
								if ( tuser )
									tuser.volume = undefined;
							} );
							options.querySelector( '.fa-ban' ).addEventListener( 'click', ( event ) => {
								get_trash().style.display = 'initial';
								var tuser = user_add( user_name );
								if ( tuser )
									tuser.volume = '0';
							} );
							get_trash().addEventListener( 'click', ( event ) => {
								get_trash().style.display = 'none';
								user_del( user_name );
							} );
						}
					}
				} );
			} );
		}

		var dchat_parent = dchat.parentNode;
		if ( iautoscroll.checked && onscroll[ 1 ] )
			dchat_parent.scrollTop = dchat_parent.scrollHeight;
		setTimeout( () => { onscroll[ 0 ] = false; }, 100 );

		return ( li );
	}

	/**
	 * @desc Sends a message to the system to say it
	 * @param	{string}			text				Message to read
	 * @param	{Object}			[force]				Force the message to be read
	 * @param	{string}			[user]				Twitch username
	 * @param	{Object}			[flags]				User-related flags
	 * @param	{Object}			[extra]				User-related extra
	 * @param	{string}			[message]			Message only
	 */
	function speech( text, force, user, flags, extra, message )
	{
		if ( !force )
			return ( line.push( [ text, user, flags, extra, message ] ) );
		if ( !msg || !text )
			return ;

		inchat = true;
		var data = {
			rate:		parseFloat( irate.value ),
			pitch:		parseFloat( ipitch.value ),
			volume:		parseFloat( ivolume.value ),
			voice:		voice,
			ascii:		iascii.checked,
			flooding:	parseInt( iflooding.value )
		}

		var tuser = user_get( user );
		if ( tuser )
		{
			Object.keys( data ).forEach( ( key ) => {
				var type = typeof( tuser[ key ] );
				if ( type === 'string' )
				{
					if ( key == 'voice' )
					{
						voices.forEach( ( item, index ) => {
							if ( tuser.voice == `${item.lang}|${item.name}` )
								data.voice = [ index, item ];
						} );
					}
					else if ( !isNaN( parseFloat( tuser[ key ] ) ) )
						data[ key ] = parseFloat( tuser[ key ] );
					else if ( !isNaN( parseInt( tuser[ key ] ) ) )
						data[ key ] = parseInt( tuser[ key ] );
				}
				else if ( type !== 'undefined' )
					data[ key ] = tuser[ key ];
			} );
		}

		msg.rate = ( parseInt( data.rate * 100 ) / 100 );
		msg.pitch = ( parseInt( data.pitch * 100 ) / 100 );
		msg.volume = ( parseInt( data.volume * 100 ) / 100 );
		msg.voice = data.voice[ 1 ];

		if ( data.ascii )
			text = text.replace( /[^\040-\176\200-\377]/gi, '' );

		var flooding = ( 100 - data.flooding );
		if ( !msg.volume || ( user && flooding < 100 && FloodDetector.evaluate( text, flooding ) ) )
			return ( inchat = false );

		if ( extra !== true )
		{
			var repeat_value = parseInt( irepeat.value );
			if ( tuser && typeof( tuser.repeat ) !== 'undefined' )
				repeat_value = parseInt( tuser.repeat );

			if ( extra && repeat[ 0 ] > 0 && repeat[ 1 ] == extra.userId && message )
			{
				if ( repeat[ 0 ] > repeat_value )
					repeat[ 0 ] = repeat_value;

				--repeat[ 0 ];
				text = message;
			}
			else
				repeat = [ repeat_value, ( extra ? extra.userId : '' ) ];
		}

		msg.text = text;

		window.speechSynthesis.speak( msg );
	}

	/**
	 * @desc Enables/Disables a chat option
	 * @param	{string}			name				Name of the option
	 */
	function toggle( name )
	{
		var elem = dsettings.querySelector( `[name=${name}]` );
		dchat.parentNode.classList.toggle( name, elem.checked );
	}

	/**
	 * @desc Cuts a text if it exceeds the setting
	 * @param	{string}			type				Type of text to process
	 * @param	{string}			value				Text
	 * @param	{string}			user_name			Twitch username
	 * @return	{string}								Cut out text
	 */
	function limit( type, value, user_name )
	{
		var data = {
			lusername:	ilusernames.value,
			lmessage:	ilmessages.value
		};

		var tuser = user_get( user_name );
		if ( tuser )
		{
			data.lusername	= ( ( typeof( tuser.lusername ) !== 'undefined' ) ? tuser.lusername : data.lusername ),
			data.lmessage	= ( ( typeof( tuser.lmessage ) !== 'undefined' ) ? tuser.lmessage : data.lmessage )
		}

		var max = 0;
		if ( type == 'username' )
			max = parseInt( data.lusername );
		else if ( type == 'message' )
			max = parseInt( data.lmessage );

		return ( ( max > 0 ) ? value.substr( 0, max ) : value );
	}

	/**
	 * @desc Finds the position of one text in another
	 * @param	{string}			text				Text in which to search
	 * @param	{string}			search				Search text
	 * @param	{bool}				[all]				Forward all positions
	 * @param	{bool}				[sensitive]			Case sensitive
	 * @return	{Array}									Start and end position of the text
	 */
	function position( text, search, all, sensitive )
	{
		if ( !sensitive )
		{
			text = text.toLowerCase();
			search = search.toLowerCase();
		}

		var index = -1;
		var indexes = [];
		while ( true )
		{
			index = text.indexOf( search, ( ( index >= 0 ) ? ( index + search.length ) : false ) );
			if ( index < 0 )
				break ;

			indexes.push( [ index, ( index + search.length ) ] );
			if ( !all )
				return ( indexes.pop() );
		}

		return ( all ? indexes : [ -1, -1 ] )
	}

	/**
	 * @desc Replace words according to settings
	 * @param	{string}			[user]				Twitch username
	 * @param	{string}			[message]			Message
	 * @return	{(string|Array)}						Processed items
	 */
	function replace( user, message )
	{
		var step = function( text, word, replace, spaces ) {
			var pos = position( text, word, true ).reverse();
			pos.forEach( ( index ) => {
				var before = ( [ '@', '#' ].indexOf( text[ index[ 0 ] - 1 ] ) >= 0 );
				var start = ( !index[ 0 ] || text[ index[ 0 ] - 1 ] == ' ' || ( index[ 0 ] == 1 && before ) || ( index[ 0 ] >= 2 && before && text[ index[ 0 ] - 2 ] == ' ' ) );
				var end = ( index[ 1 ] == text.length || text[ index[ 1 ] ] == ' ' );
				if ( !spaces || ( start && end ) )
					text = ( text.substr( 0, index[ 0 ] ) + replace + text.substr( index[ 1 ] ) );
			} );

			return ( text );
		};

		var uuser = ( typeof( user ) !== 'undefined' );
		var umessage = ( typeof( message ) !== 'undefined' );

		user = ( uuser ? user.toLowerCase() : user );
		message = ( umessage ? message.toLowerCase() : message );

		var tuser = user_get( user );
		var uwords = ( tuser && typeof( tuser.words ) !== 'undefined' );
		var twords = ( ( !uwords && words ) || ( uwords && tuser.words ) );
		Object.keys( twords ).forEach( ( word ) => {
			var [ mode, replacement ] = twords[ word ];
			mode = ( mode >>> 0 ).toString( 2 ).padStart( 3, '0' );
			mode = mode.split( '' ).reverse().join( '' );

			var inside = !( mode[ 2 ] == '1' );
			if ( mode[ 0 ] == '1' && uuser )
				user = step( user, word, replacement, false );
			if ( mode[ 1 ] == '1' && umessage )
				message = step( message, word, replacement, inside );
		} );

		return ( ( uuser && umessage ) ? [ user, message ] : ( umessage ? message : user ) );
	}

	/**
	 * @desc Processes the special elements present in a message
	 * @param	{string}			type				Type of sentence searched
	 * @param	{string}			user				Twitch username
	 * @param	{string}			[message]			Message to display and say
	 * @param	{Object}			[flags]				User-related flags
	 * @param	{Object}			[extra]				Other information about the user and the process
	 * @return	{Array}									[ Template, User-related flags, Chat is on, split_msg, Speech is on, Sentence to speak ]
	 */
	function convert( type, user, message, flags, extra )
	{
		var cut = [];
		var tuser = user_get( user );
		var [ chat_enabled, speech_enabled, template ] = ( type ? sentence( 0b100, type, user ) : [ true, true, type ] );

		try
		{
			[ ...message.matchAll( /\@[A-Za-zÀ-ÖØ-öø-ÿ0-9_]*/g ) ].forEach( ( item ) => {
				try
				{
					if ( item[ 0 ].length > 1 )
					{
						var pos = message.indexOf( item[ 0 ] );
						if ( pos >= 0 && ( !pos || message[ pos - 1 ] == ' ' ) )
							cut.push( [ 'user', item[ 0 ].substr( 1 ), pos, ( pos + item[ 0 ].length ) ] );
					}
				} catch ( e ) {}
			} );
		} catch ( e ) {}

		try
		{
			anchorme.list( message ).forEach( ( item ) => {
				cut.push( [ 'link', item.string, item.start, item.end ] );
			} );
		} catch ( e ) {}

		if ( extra )
		{
			Object.keys( extra.messageEmotes || {} ).forEach( ( key ) => {
				extra.messageEmotes[ key ].forEach( ( value ) => {
					var pos = value.split( '-' );
					cut.push( [ 'emote', key, parseInt( pos[ 0 ] ), parseInt( pos[ 1 ] ) + 1 ] );
				} );
			} );
		}

		// Sort
		cut.sort( ( a, b ) => { return ( b[ 2 ] - a[ 2 ] ); } );

		var last = ( message || '' );
		var split_msg = [];
		var speech_msg = ( message || '' );
		cut.forEach( ( item ) => {
			var elem = null;
			var text = last.slice( item[ 2 ], item[ 3 ] );

			if ( item[ 0 ] == 'user' )
			{
				elem = document.createElement( 'span' );
				elem.title = text.substr( 1 );
				elem.innerText = text.substr( 1 );

				speech_msg = speech_msg.slice( 0, item[ 2 ] ) + text.substr( 1 ) + speech_msg.slice( item[ 3 ] );
			}
			else if ( item[ 0 ] == 'link' )
			{
				elem = document.createElement( 'a' );
				elem.href = text;
				elem.innerText = text;

				var ulinks = ( tuser && typeof( tuser.links ) !== 'undefined' );
				if ( ( !ulinks && !ilinks.checked ) || ( ulinks && !tuser.links ) )
					speech_msg = speech_msg.slice( 0, item[ 2 ] ) + speech_msg.slice( item[ 3 ] );
			}
			else if ( item[ 0 ] == 'emote' )
			{
				elem = document.createElement( 'img' );
				elem.src = `https://static-cdn.jtvnw.net/emoticons/v1/${item[ 1 ]}/3.0`;
				elem.alt = text;
				elem.title = text;

				var uemotes = ( tuser && typeof( tuser.emotes ) !== 'undefined' );
				if ( ( !uemotes && !iemotes.checked ) || ( uemotes && !tuser.emotes ) )
					speech_msg = speech_msg.slice( 0, item[ 2 ] ) + speech_msg.slice( item[ 3 ] );
			}

			if ( elem )
			{
				elem.className = item[ 0 ];

				split_msg.unshift( document.createTextNode( last.slice( item[ 3 ] ) ) );
				split_msg.unshift( elem );

				last = last.slice( 0, item[ 2 ] );
			}
		} );
		split_msg.unshift( document.createTextNode( last ) );

		if ( flags && extra )
		{
			flags.partner = ( ( extra.userBadges && typeof( extra.userBadges.partner ) !== 'undefined' && extra.userBadges.partner ) == '1' );
			flags.premium = ( ( extra.userBadges && typeof( extra.userBadges.premium ) !== 'undefined' && extra.userBadges.premium ) == '1' );
		}

		return ( [ template, flags, chat_enabled, split_msg, speech_enabled, speech_msg.trim() ] );
	}

	// ComfyJS
	ComfyJS.onCommand = ( user, command, message, flags, extra ) => { // Responds to "!" commands
		var prefix = `!${command}`;
		if ( command.substr( 0, 13 ) == 'Sound Alert: ' )
			return ;
		else if ( !command )
			return ( ComfyJS.onChat( user, `${prefix} ${message}`, flags, false, extra ) );

		if ( extra.messageEmotes )
		{
			Object.keys( extra.messageEmotes ).forEach( ( key ) => {
				extra.messageEmotes[ key ].forEach( ( value, index ) => {
					var pos = value.split( '-' );
					pos.forEach( ( value, sindex ) => {
						pos[ sindex ] = ( parseInt( value ) - ( prefix.length + 1 ) ).toString();
					} );

					extra.messageEmotes[ key ][ index ] = pos.join( '-' );
				} );
			} );
		}

		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onCommand:', user, command, message, flags, extra );

		var [ template, flags, chat_enabled, split_msg, speech_enabled, speech_msg ] = convert( false, user, message, flags, extra );

		if ( chat_enabled )
			chat( user, prechat( prefix, split_msg ), flags, extra, true );
	};

	ComfyJS.onChat = ( user, message, flags, self, extra ) => { // Responds to user chatting
		if ( self )
			return ;

		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onChat:', user, message, flags, extra );

		var callback = ( user, message, flags, extra, reward, only_return, force_repeat ) => {
			var [ template, flags, chat_enabled, split_msg, speech_enabled, speech_msg ] = convert( 'chat', user, message, flags, extra );

			flags.notime = reward;
			flags.highlighted = ( flags.highlighted || reward );

			var action = ( extra && typeof( extra.messageType ) === 'string' && extra.messageType == 'action' );
			if ( action )
				template = '$username$ $message$';

			var ret = '';
			var respeech = '';
			if ( speech_enabled && speech_msg )
			{
				var [ luser, lmessage ] = replace( user, speech_msg );
				var tmessage = limit( 'message', lmessage, user );
				var text = template
					.replace( /\$username\$/g, limit( 'username', luser, user ) )
					.replace( /\$message\$/g, tmessage );

				if ( text && !reward && !only_return )
					speech( text, false, user, flags, extra, ( action ? text : tmessage ) );

				ret = tmessage;
				respeech = template
					.replace( /\$username\$/g, user )
					.replace( /\$message\$/g, lmessage );
			}

			if ( chat_enabled && !only_return )
				chat( user, split_msg, flags, extra, undefined, ( force_repeat || respeech ) );

			return ( ret );
		};

		var args = [ user, message, flags, extra ];
		if ( flags.customReward && extra.customRewardId )
		{
			var timeout = 0;
			var tcallback = ( only_return, force_repeat ) => {
				if ( timeout )
					clearTimeout( timeout );

				if ( typeof( rcallbacks[ user ] ) !== 'undefined' )
				{
					var text = callback( ...rcallbacks[ user ].args, true, only_return, force_repeat );
					if ( !only_return )
						delete rcallbacks[ user ];

					return ( text );
				}
			};

			timeout = setTimeout( tcallback, 1000 );
			rcallbacks[ user ] = { callback: tcallback, args };
		}
		else
			callback( ...args, false );
	}

	ComfyJS.onMessageDeleted = ( id, extra ) => { // Responds to chat message deleted
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onMessageDeleted:', id, extra );
	};

	// customRewardId
	ComfyJS.onReward = ( user, reward, cost, extra ) => {
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onReward:', user, reward, cost, extra );

		if ( typeof( extra ) === 'object' && extra.rewardFulfilled )
			return ;

		var reward_callback = ( ( typeof( rcallbacks[ user ] ) !== 'undefined' ) ? rcallbacks[ user ].callback : () => {} );
		var [ template, flags, chat_enabled, split_msg, speech_enabled, speech_msg ] = convert( 'reward', user, reward, null, extra );

		var luser = replace( user );
		var text = reward_callback( true );
		text = template
			.replace( /\$username\$/g, limit( 'username', luser, user ) )
			.replace( /\$reward\$/g, reward )
			.replace( /\$cost\$/g, cost ) + ( text ? ( ' : ' + text ) : '' );

		if ( speech_enabled && speech_msg )
			speech( text, false, user, null );

		if ( chat_enabled )
			chat( prechat( language[ 2 ].chat.reward
				.replace( /\$username\$/g, user )
				.replace( /\$reward\$/g, reward )
				.replace( /\$cost\$/g, cost ), split_msg, ' : ' ), undefined, { highlighted: true }, undefined, undefined, text );

		reward_callback( false, text );
	};

	ComfyJS.onJoin = ( user, self, extra ) => { // Responds to user joining the chat
		if ( self )
			return ;

		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onJoin:', user, extra );

		chat( language[ 2 ].chat.join.replace( /\$username\$/g, user ) );
	};

	ComfyJS.onPart = ( user, self, extra ) => { // Responds to user leaving the chat
		if ( self )
			return ;

		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onPart:', user, extra );

		chat( language[ 2 ].chat.part.replace( /\$username\$/g, user ) );
	};

	ComfyJS.onHosted = ( user, viewers, autohost, extra ) => { // Responds to channel being hosted (requires being authorized as the broadcaster)
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onHosted:', user, viewers, autohost, extra );

		var [ chat_enabled, speech_enabled, template ] = sentence( 0b100, 'hosted', user );

		if ( chat_enabled )
		{
			chat( language[ 2 ].chat.host
				.replace( /\$username\$/g, user )
				.replace( /\$viewers\$/g, viewers ) );
		}

		if ( speech_enabled )
		{
			var luser = replace( user );
			speech( template
				.replace( /\$username\$/g, limit( 'username', luser, user ) )
				.replace( /\$viewers\$/g, viewers ) );
		}
	};

	ComfyJS.onRaid = ( user, viewers, extra ) => { // Responds to raid event
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onRaid:', user, viewers, extra );

		var [ chat_enabled, speech_enabled, template ] = sentence( 0b100, 'raid', user );

		if ( chat_enabled )
		{
			chat( language[ 2 ].chat.raid
				.replace( /\$username\$/g, user )
				.replace( /\$viewers\$/g, viewers ) );
		}

		if ( speech_enabled )
		{
			var luser = replace( user );
			speech( template
				.replace( /\$username\$/g, limit( 'username', luser, user ) )
				.replace( /\$viewers\$/g, viewers ) );
		}
	};

	ComfyJS.onCheer = ( user, message, bits, flags, extra ) => { // Responds to user cheering
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onCheer:', user, message, bits, flags, extra );

		var [ template, flags, chat_enabled, split_msg, speech_enabled, speech_msg ] = convert( 'cheer' + ( ( message && message.trim() ) ? '_msg' : '' ), user, message, flags, extra );

		if ( chat_enabled )
		{
			chat( prechat( language[ 2 ].chat.cheer
				.replace( /\$username\$/g, user )
				.replace( /\$bits\$/g, bits ), split_msg, ' : ' ) );
		}

		if ( speech_enabled && speech_msg )
		{
			var [ luser, lmessage ] = replace( user, speech_msg );
			speech( template
				.replace( /\$username\$/g, limit( 'username', luser, user ) )
				.replace( /\$message\$/g, limit( 'message', lmessage, user ) )
				.replace( /\$bits\$/g, bits ), false, user, flags );
		}
	};

	ComfyJS.onSub = ( user, message, subTierInfo, extra ) => { // Responds to user channel subscription
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onSub:', user, message, subTierInfo, extra );

		var [ template, flags, chat_enabled, split_msg, speech_enabled, speech_msg ] = convert( 'sub' + ( ( message && message.trim() ) ? '_msg' : '' ), user, message, flags, extra );

		if ( chat_enabled )
			chat( prechat( language[ 2 ].chat.substribe.replace( /\$username\$/g, user ), split_msg, ' : ' ) );

		if ( speech_enabled && speech_msg )
		{
			var [ luser, lmessage ] = replace( user, speech_msg );
			speech( template
				.replace( /\$username\$/g, limit( 'username', luser, user ) )
				.replace( /\$message\$/g, limit( 'message', lmessage, user ) ) );
		}
	};

	ComfyJS.onResub = ( user, message, streamMonths, cumulativeMonths, subTierInfo, extra ) => { // Responds to user channel subscription anniversary
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onResub:', user, message, streamMonths, cumulativeMonths, subTierInfo, extra );

		var [ template, flags, chat_enabled, split_msg, speech_enabled, speech_msg ] = convert( 'resub' + ( ( message && message.trim() ) ? '_msg' : '' ), user, message, null, extra );

		if ( chat_enabled )
			chat( prechat( language[ 2 ].chat.resubstribe.replace( /\$username\$/g, user ), split_msg, ' : ' ) );

		if ( speech_enabled && speech_msg )
		{
			var [ luser, lmessage ] = replace( user, speech_msg );
			speech( template
				.replace( /\$username\$/g, limit( 'username', luser, user ) )
				.replace( /\$message\$/g, limit( 'message', lmessage, user ) ) );
		}
	};

	ComfyJS.onSubGift = ( gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra ) => { // Responds to user gift subscription
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onSubGift:', gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra );

		var [ chat_enabled, speech_enabled, template ] = sentence( 0b100, 'gift', gifterUser );

		if ( chat_enabled )
		{
			chat( language[ 2 ].chat.gift
				.replace( /\$gifter\$/g, gifterUser )
				.replace( /\$recipient\$/g, recipientUser )
				.replace( /\$cumul\$/g, streakMonths )
				.replace( /\$count\$/g, senderCount ) );
		}

		if ( speech_enabled )
		{
			var lgifter = replace( gifterUser );
			var lrecipient = replace( recipientUser );
			speech( template
				.replace( /\$gifter\$/g, limit( 'username', lgifter, gifterUser ) )
				.replace( /\$recipient\$/g, limit( 'username', lrecipient, recipientUser ) )
				.replace( /\$cumul\$/g, streakMonths )
				.replace( /\$count\$/g, senderCount ) );
		}
	};

	ComfyJS.onSubMysteryGift = ( gifterUser, numbOfSubs, senderCount, subTierInfo, extra ) => { // Responds to user sending gift subscriptions
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onSubMysteryGift:', gifterUser, numbOfSubs, senderCount, subTierInfo, extra );

		var [ chat_enabled, speech_enabled, template ] = sentence( 0b100, 'gift_myst', user );

		if ( chat_enabled )
		{
			chat( language[ 2 ].chat.gift_myst
				.replace( /\$gifter\$/g, gifterUser )
				.replace( /\$subs\$/g, numbOfSubs )
				.replace( /\$count\$/g, senderCount ) );
		}

		if ( speech_enabled )
		{
			var luser = replace( gifterUser );
			speech( template
				.replace( /\$gifter\$/g, limit( 'username', luser, gifterUser ) )
				.replace( /\$subs\$/g, numbOfSubs )
				.replace( /\$count\$/g, senderCount ) );
		}
	};

	ComfyJS.onGiftSubContinue = ( user, sender, extra ) => { // Responds to user continuing gift subscription
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onGiftSubContinue:', user, sender, extra );

		var [ chat_enabled, speech_enabled, template ] = sentence( 0b100, 'gift_renew', user );

		if ( chat_enabled )
		{
			chat( language[ 2 ].chat.gift_renew
				.replace( /\$gifter\$/g, sender )
				.replace( /\$recipient\$/g, user ) );
		}

		if ( speech_enabled )
		{
			var lsender = replace( sender );
			var luser = replace( user );
			speech( template
				.replace( /\$gifter\$/g, limit( 'username', lsender, sender ) )
				.replace( /\$recipient\$/g, limit( 'username', luser, user ) ) );
		}
	};

	ComfyJS.onConnected = ( address, port, isFirstConnect ) => { // Responds when connecting to the Twitch chat.
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onConnected:', address, port, isFirstConnect );

		bdisconnect.disabled = false;

		var channel_all = [ channel[ 0 ] ].concat( channels ).join( ', ' );
		chat( language[ 2 ].chat.connected.replace( /\$channel_name\$/g, channel_all ), undefined, { connected: true } );
		update();

		var tchannel = [ channel[ 0 ], channel[ 1 ] ];
		if ( tchannel[ 0 ] )
		{
			var channel_name = encodeURIComponent( tchannel[ 0 ] );
			if ( !tchannel[ 1 ] )
			{
				request( `https://api.twitch.tv/kraken/users?login=${channel_name}` )
					.then( ( data ) => {
						try
						{
							if ( channel[ 0 ] && channel[ 0 ] == tchannel[ 0 ] )
							{
								channel[ 1 ] = data.users[ 0 ]._id;
								channel_infos( channel[ 1 ], ( data ) => {
									if ( channel[ 0 ] && channel[ 0 ] == tchannel[ 0 ] )
									{
										infos = data;
										update();
									}
								} );
							}
						} catch ( e ) {
							disconnect( 'Channel $channel$ not found !' );
						}
					} )
					.catch( ( error ) => {
						console.error( 'connect:', error );
						disconnect();
					} );
			}

			channels.forEach( ( channel_name ) => {
				channel_name = encodeURIComponent( channel_name );
				request( `https://api.twitch.tv/kraken/users?login=${channel_name}` )
					.then( ( data ) => {
						try
						{
							var channel_id = data.users[ 0 ]._id;
							if ( typeof( logos[ channel_id ] ) === 'undefined' || !logos[ channel_id ][ 1 ] )
							{
								channel_infos( channel_id, ( data ) => {
									channel_logo( data._id, data, ( channel_id, data, logo ) => {
										// change chat logos
									} );
								} );
							}
						} catch ( e ) {}
					} );
			} );
		}
	};

	ComfyJS.onReconnect = ( reconnectCount ) => { // Responds when attempting to reconnect to the Twitch chat.
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onReconnect:', reconnectCount );

		chat( language[ 2 ].chat.reconnection );
	};

	ComfyJS.onError = ( error ) => { // Hook for Errors
		var message = '';
		if ( typeof( error ) === 'string' && ( error.indexOf( 'Login authentication failed' ) >= 0 || error.indexOf( 'Invalid NICK' ) >= 0 ) )
			message = language[ 2 ].errors.twitch.auth;

		if ( message )
		{
			modal( {
				title:			language[ 2 ].errors.twitch.title,
				body:			message,
				footer: {
					input:		false,
					close:		true,
					confirm:	false
				}
			} );
		}

		console.error( error );
	};

	// Handlebars
	var set_values = {};
	var date_null = [ null, '', '0000-00-00', '0000-00-00 00:00:00' ];
	Array.prototype.forEach.call( [
		[ 'log',			function() { console.log( ...Array.prototype.slice.call( arguments, 0, -1 ) ); } ],
		[ 'concat',			function() { return ( Array.prototype.slice.call( arguments, 0, -1 ).join( '' ) ); } ],
		[ 'upper',			function() { return ( arguments[ 0 ].toUpperCase() ); } ],
		[ 'lower',			function() { return ( arguments[ 0 ].toLowerCase() ); } ],
		[ 'capitalize',		function() { return ( arguments[ 0 ].slice( 0, 1 ).toUpperCase() + arguments[ 0 ].slice( 1 ) ); } ],
		[ 'replace',		function() { return ( arguments[ 0 ].replace( arguments[ 1 ], arguments[ 2 ] ) ); } ],
		[ 'eq',				function() { return ( arguments[ 0 ] === arguments[ 1 ] ); } ],
		[ 'not-eq',			function() { return ( arguments[ 0 ] !== arguments[ 1 ] ); } ],
		[ 'not',			function() { return ( !arguments[ 0 ] ); } ],
		[ 'and',			function() { return ( arguments[ 0 ] && arguments[ 1 ] ); } ],
		[ 'or',				function() { return ( arguments[ 0 ] || arguments[ 1 ] ); } ],
		[ 'xor',			function() { return ( ( arguments[ 0 ] && !arguments[ 1 ] || !arguments[ 0 ] && arguments[ 1 ] ) ); } ],
		[ 'gt',				function() { return ( arguments[ 0 ] > arguments[ 1 ] ); } ],
		[ 'gte',			function() { return ( arguments[ 0 ] >= arguments[ 1 ] ); } ],
		[ 'lt',				function() { return ( arguments[ 0 ] < arguments[ 1 ] ); } ],
		[ 'lte',			function() { return ( arguments[ 0 ] <= arguments[ 1 ] ); } ],
		[ 'in',				function() { return ( arguments[ 1 ].indexOf( arguments[ 0 ] ) >= 0 ); } ],
		[ 'not-in',			function() { return ( arguments[ 1 ].indexOf( arguments[ 0 ] ) < 0 ); } ],
		[ 'type',			function() { return ( typeof( arguments[ 0 ] ) ); } ],
		[ 'count',			function() { return ( ( typeof( arguments[ 0 ] ) === 'object' ) ? ( Array.isArray( arguments[ 0 ] ) ? arguments[ 0 ].length : Object.keys( arguments[ 0 ] ).length ) : 0 ); } ],
		[ 'is-array',		function() { return ( Array.isArray( arguments[ 0 ] ) ); } ],
		[ 'date-null',		function() { return ( date_null.indexOf( arguments[ 0 ] ) >= 0 ); } ],
		[ 'join',			function() { return ( arguments[ 0 ].join( arguments[ 1 ] ) ); } ],
		[ 'split',			function() { return ( arguments[ 0 ].split( arguments[ 1 ] ) ); } ],
		[ 'slice',			function() { return ( arguments[ 0 ].slice( arguments[ 1 ], ( ( arguments.length > 3 ) ? arguments[ 2 ] : undefined ) ) ); } ],
		[ 'array',			function() { return ( Array.prototype.slice.call( arguments, 0, -1 ) ); } ],
		[ 'array-get',		function() { return ( arguments[ 1 ][ arguments[ 0 ] ] ); } ],
		[ 'array-add',		function() { return ( arguments[ 0 ].concat( Array.prototype.slice.call( arguments, 1, -1 ) ) ); } ],
		[ 'array-concat',	function() { return ( arguments[ 0 ].concat( arguments[ 1 ] ) ); } ],
		[ 'atob',			function() { return ( atob( arguments[ 0 ] ) ); } ],
		[ 'btoa',			function() { return ( btoa( arguments[ 0 ] ) ); } ],
		[ 'encode',			function() { return ( unescape( encodeURIComponent( arguments[ 0 ] ) ) ); } ],
		[ 'decode',			function() {
			var val = arguments[ 0 ];
			try { val = decodeURIComponent( escape( val ) ); } catch ( e ) {}
			return ( val );
		} ],
		[ 'json-parse',		function() { return ( JSON.parse( arguments[ 0 ] ) ); } ],
		[ 'json-string',	function() { return ( JSON.stringify( arguments[ 0 ] ) ); } ],
		[ 'keys',			function() { return ( Object.keys( arguments[ 0 ] ) ); } ],
		[ 'get',			function() {
			var obj = set_values;
			var keys = Array.prototype.slice.call( arguments, 0, -1 );
			if ( typeof( arguments[ 0 ] ) === 'object' )
			{
				keys.shift();
				obj = arguments[ 0 ];
			}

			Array.prototype.forEach.call(
				keys,
				( key ) => { obj = obj[ key ]; }
			);

			return ( obj );
		} ],
		[ 'set',			function() {
			if ( typeof( arguments[ 1 ] ) === 'object' && arguments[ 1 ].hash )
				arguments[ 1 ] = arguments[ 1 ].hash;
			else if ( arguments[ 2 ] === 'json' )
				arguments[ 1 ] = JSON.parse( arguments[ 1 ] );

			set_values[ arguments[ 0 ] ] = arguments[ 1 ];
		} ],
		[ 'merge',			function() {
			var obj = {};
			arguments[ 0 ] = ( arguments[ 0 ] || {} );
			if ( typeof( arguments[ 0 ] ) === 'string' )
				arguments[ 0 ] = JSON.parse( arguments[ 0 ] );
			arguments[ 1 ] = ( arguments[ 1 ] || {} );
			if ( typeof( arguments[ 1 ] ) === 'string' )
				arguments[ 1 ] = JSON.parse( arguments[ 1 ] );

			Array.prototype.forEach.call(
				Object.keys( arguments[ 0 ] ),
				( key ) => { obj[ key ] = arguments[ 0 ][ key ]; }
			);
			Array.prototype.forEach.call(
				Object.keys( arguments[ 1 ] ),
				( key ) => { obj[ key ] = arguments[ 1 ][ key ]; }
			);

			return ( obj );
		} ],
	], ( item ) => {
		var index, item = item;
		Handlebars.registerHelper( item[ 0 ], function() {
			try
			{
				return ( item[ 1 ]( ...arguments ) );
			}
			catch ( e )
			{
				console.error( item[ 0 ], arguments, e );
			}

			return ( '' );
		} );
	} );

	Handlebars.registerHelper( 'tag', function( name ) {
		var output = '';
		Array.prototype.forEach.call(
			Array.prototype.slice.call( arguments, 1, -1 ),
			( attrs ) => {
				if ( !attrs || typeof( attrs ) !== 'object' )
					return ;
				else if ( attrs.hash )
					attrs = attrs.hash;

				Array.prototype.forEach.call(
					Object.keys( attrs ),
					( attr ) => {
						output += ' ' + attr + '=';
						if ( attrs[ attr ].indexOf( '"' ) >= 0 )
							output += '\'' + attrs[ attr ] + '\'';
						else
							output += '"' + attrs[ attr ] + '"';
					}
				);
			}
		);

		return new Handlebars.SafeString( '<' + name + output + '>' );
	} );

	// Main
	audios = [ new Audio( 'sounds/connect.mp3' ), new Audio( 'sounds/disconnect.mp3' ) ];
	audios[ 0 ].volume = .2;
	audios[ 1 ].volume = .2;

	nosleep = new NoSleep();

	var observer = new MutationObserver( ( mutations ) => {
		mutations.forEach( ( mutation ) => {
			var elem = mutation.target;
			if ( elem.getAttribute( 'data-original-show' ) == '1' && typeof( elem.Tooltip ) !== 'undefined' )
			{
				elem.Tooltip.hide();
				setTimeout( () => { elem.Tooltip.show(); }, 500 );
			}
		} );
	} );

	init();
} );
