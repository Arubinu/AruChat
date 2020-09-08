window.addEventListener( 'load', () => {
	var html_change = document.createEvent( 'HTMLEvents' );
	html_change.initEvent( 'change', true, false );

	var mouse_click = document.createEvent( 'MouseEvents' );
	mouse_click.initEvent( 'click', true, false );

	var	msg			= null,
		url			= '',
		line		= [],
		logo		= null,
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
		excludes	= [],
		language	= null;
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
		};

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

		// obsolete
		try
		{
			var tmp = localStorage.getItem( 'excludes' );
			localStorage.removeItem( 'excludes' );

			tmp = JSON.parse( tmp );
			if ( Array.isArray( tmp ) )
				tmp.forEach( ( user_name ) => { users[ user_name ] = { volume: 0 }; } );
		} catch ( e ) {}

		try
		{
			var tmp = JSON.parse( localStorage.getItem( 'users' ) );
			if ( typeof( tmp ) === 'object' )
			{
				Object.keys( tmp ).forEach( ( user_name ) => {
					var tuser = tmp[ user_name ];
					users[ user_name ] = { name: tuser.name };
					ksettings.forEach( ( key ) => {
						users[ user_name ][ key ] = ( ( typeof( tuser[ key ] ) !== 'undefined' ) ? tuser[ key ] : undefined );
					} );
				} );
			}
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

		Object.keys( users ).forEach( ( user_name ) => { users_add( user_name, true ); } );
		bwords.innerText = language[ 2 ].manage.variable.replace( '%s', Object.keys( words ).length );

		toggle( 'timestamp' );
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
			localStorage.setItem( 'autoscroll', ( data ? data.autoscroll : iautoscroll.checked.toString() ) );

			localStorage.setItem( 'mod', ( data ? data.mod : umod.checked ) );
			localStorage.setItem( 'normal', ( data ? data.normal : unormal.checked ) );
			localStorage.setItem( 'subscriber', ( data ? data.subscriber : usubscriber.checked ) );
			localStorage.setItem( 'broadcaster', ( data ? data.broadcaster : ubroadcaster.checked ) );

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
						return ( reject() );
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
	 * @desc Get the last followers of the Twitch channel
	 * @param	{string}			channel_id			Twitch Channel ID
	 * @param	{function}			callback			Returns the object resulting from the request
	 */
	function channel_followers( channel_id, callback )
	{
		if ( !channel_id )
			return ;

		request( `https://api.twitch.tv/kraken/channels/${channel_id}/follows?limit=100` )
			.then( ( data ) => { callback( data ); } )
			.catch( ( error ) => { console.error( 'followers:', error ); } );
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

		Array.from( elem.querySelectorAll( '[title]' ) ).map( elem => new BSN.Tooltip( elem, { placement: ( elem.classList.contains( 'tip-left' ) ? 'left' : 'top' ), delay: 250 } ) );

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

		new BSN.Modal( elem ).show();
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
		elem.parentNode.addEventListener( 'show.bs.dropdown', function( event ) {
			var next = elem.querySelector( '.dropdown-toggle' );
			var menu = elem.querySelector( '.dropdown-menu' );

			var pos = { x: 0, y: 0 };
			while ( next.offsetParent )
			{
				next = next.offsetParent;
				pos.x += next.offsetLeft;
				pos.y += next.offsetTop;
			}

			menu.style.position = 'fixed';
			menu.style.top = `${pos.y}px`;
			menu.style.right = `${document.body.offsetWidth - pos.x}px`;
		}, false );

		return ( dropdown );
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

			request( './languages.json', null, true )
				.then( ( data ) => {
					var list = [];
					Object.keys( data ).forEach( ( item, index ) => {
						list[ data[ item ][ 0 ] ] = item;
					} );

					var lang = ( localStorage.getItem( 'language' ) || 'en-US' );
					language = [ lang, list, data[ lang ][ 1 ] ];
					language[ 2 ].site = {
						name: 'AruChat',
						version: document.querySelector( 'script:last-child' ).src.split( '?' ).slice( -1 )[ 0 ]
					};
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
							document.body.appendChild( html( templates.settings( language[ 2 ] ), true ) );

							dchat = dbase.querySelector( '#chat > ul' );
							dsettings = dbase.querySelector( '#settings' );
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

							tlanguages.title = Object.keys( language[ 1 ] )[ Object.values( language[ 1 ] ).indexOf( language[ 0 ] ) ];
							tlanguages.addEventListener( 'click', () => {
								localStorage.setItem( 'language', ( localStorage.getItem( 'language' ) == 'fr-FR' ) ? 'en-US' : 'fr-FR' );
								window.location.reload( true );
							} );
							tchangelog.addEventListener( 'click', () => {
								request( './changelog.md', { responseType: 'text' }, true, true )
									.then( ( data ) => {
										var changelog = data.response.replace( /^(v[0-9]+:)$/gm, '<u>\$1</u>' ).replace( /\'(.*)\'/gm, '\'<i>\$1</i>\'' );
										modal( {
											title:			( tchangelog.getAttribute( 'data-original-title' ) || tchangelog.title ),
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

							[ ...html( templates.toast( {
								title:	language[ 2 ].toasts.connection.title,
								body:	language[ 2 ].toasts.connection.body
							} ) ) ].forEach( ( item ) => {
								dchat.parentNode.appendChild( item );
							} );

							dtoast = dbase.querySelector( '.toast' );
							zbase = dbase.querySelector( '.infos' );
							zlogo = zbase.querySelector( '.infos-icon > img' );
							zname = zbase.querySelector( '.infos-name' );
							zstatus = zbase.querySelector( '.infos-status' );
							zgame = zbase.querySelector( '.infos-game' );

							var loading = document.querySelector( '#loading' );
							loading.querySelector( '.fas' ).className = 'fas fa-mouse';
							loading.querySelector( 'span' ).innerText = language[ 2 ].loading;
							loading.addEventListener( 'click', () => {
								init( 1 );

								new BSN.Toast( '.toast' );
								if ( !ichannel.value )
								{
									dtoast.Toast.show();
									dbase.classList.toggle( 'show-settings', true );
								}
								else
									connect();

								loading.remove();
							} );
						} )
						.catch( ( error ) => {
							console.error( 'templates:', error );
							// changer le chargement par une erreur
						} );
				} )
				.catch( ( error ) => {
					console.error( 'languages:', error );
					// changer le chargement par une erreur
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
				dbase.classList.toggle( 'show-settings' );
			} );
			lateral[ 5 ].addEventListener( 'click', () => {
				dchat.innerText = '';
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

			btest.addEventListener( 'click', () => { speech( language[ 2 ].test.speech ); } );
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

			iuser.addEventListener( 'input', users_search );
			iuser.addEventListener( 'change', users_search );
			iuseradd.addEventListener( 'click', users_add );

			ivolume.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.volume.change.replace( '%d', parseInt( parseFloat( this.value ) * 100 ) ) ); } );
			ilusernames.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.limit.usernames.change.replace( '%d', parseInt( this.value ) ) ); } );
			ilmessages.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.limit.messages.change.replace( '%d', parseInt( this.value ) ) ); } );
			irepeat.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.repeat.change.replace( '%d', parseInt( this.value ) ) ); } );
			iflooding.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.flooding.change.replace( '%d', parseInt( this.value ) ) ); } );
			itimestamp.addEventListener( 'click', function() { toggle( 'timestamp' ); } );

			var more = ichannel.parentNode.querySelector( ':scope > .fas' );
			more.addEventListener( 'click', function() {
				var imodal = modal( {
					title:			( this.getAttribute( 'data-original-title' ) || this.title ),
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
								title:			( this.getAttribute( 'data-original-title' ) || this.title ),
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
			ivolume.parentNode.querySelector( ':scope > .fas' ).addEventListener( 'click', () => { ivolume.value = 0; ivolume.dispatchEvent( html_change ); } );
			iflooding.parentNode.querySelector( ':scope > .fas' ).addEventListener( 'click', () => { iflooding.value = 0; iflooding.dispatchEvent( html_change ); } );

			Array.from( document.querySelectorAll( '.custom-toggle' ) ).map( elem => new BSN.Collapse( elem ) );
			Array.from( document.querySelectorAll( '[title]' ) ).map( elem => new BSN.Tooltip( elem, { placement: ( elem.classList.contains( 'tip-left' ) ? 'left' : 'top' ), delay: 250 } ) );
			Array.from( document.querySelectorAll( 'input[type=checkbox], button' ) ).map( elem => document.addEventListener( 'click', () => { elem.blur(); } ) );

			load();
			setInterval( save, 1000 );
			setInterval( () => {
				if ( inchat || !line.length )
					return ;

				var [ text, user, flags ] = line.shift();
				if ( user && flags )
				{
					var mod = ( flags.mod && !umod.checked );
					var subscriber = ( flags.subscriber && !usubscriber.checked );
					var broadcaster = ( flags.broadcaster && !ubroadcaster.checked );
					var normal = ( !flags.mod && !flags.subscriber && !flags.broadcaster && !unormal.checked );

					if ( mod || subscriber || broadcaster || normal || excludes.indexOf( user.toLowerCase() ) >= 0 )
						return ;
				}

				speech( text, true, user, flags );
			}, 50 );

			var channel_count = 0;
			var channel_next = () => {
				--channel_count;
				if ( channel_count > 0 )
					return ;

				channel_count = 2;
				setTimeout( channel_update, 5000 );
			};

			var channel_update = () => {
				var tchannel = channel[ 1 ];
				if ( !tchannel )
					return ( setTimeout( channel_update, 500 ) );

				dsettings.querySelectorAll( '[data-user]' ).forEach( ( elem ) => {
					var elem_name = elem.getAttribute( 'data-user' ).trim().toLowerCase();
					if ( typeof( users[ elem_name ] ) !== 'undefined' )
						return ;

					delete users[ elem_name ];
					elem.remove();
				} );

				channel_stream( tchannel, ( data ) => {
					stream = data;
					update();
					channel_next();
				} );

				channel_followers( tchannel, ( data ) => {
					if ( channel[ 1 ] != tchannel )
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
			};

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
					svoice.setAttribute( ( svoice.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), span.innerHTML );
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
				svoice.setAttribute( ( svoice.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), span.innerHTML );
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
		followers = [ 0, null ];

		if ( channel[ 0 ] )
			ComfyJS.Init( channel[ 0 ], ( token || null ) );
			//ComfyJS.Init( channel[ 0 ], ( token || null ), [ 'ChannelA', 'ChannelB', 'ChannelC' ] );

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
				chat( ( ( typeof( text ) === 'string' ) ? text : language[ 2 ].chat.disconnected ).replace( /\$channel\$/g, channel[ 0 ] ), undefined, { disconnected: true } );
		} catch ( e ) {}

		url = '';
		line = [];
		infos = null;
		stream = null;
		channel = [ '', '' ];
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

			var dlogo = 'images/default.png';
			var tlogo = ( subdata && subdata.logo );
			if ( tlogo )
			{
				if ( tlogo != logo )
				{
					logo = tlogo;
					request( tlogo, { responseType: 'arraybuffer' }, true, true )
						.then( ( data ) => {
							var blob = new Blob( [ new Uint8Array( data.response ) ], { type: 'image/png' } );
							zlogo.src = ( window.URL || window.webkitURL ).createObjectURL( blob );
						} )
						.catch( ( error ) => {
							console.error( 'logo:', error );
							zlogo.src = dlogo;
						} );
				}
			}
			else
			{
				logo = dlogo;
				zlogo.src = dlogo;
			}
		}

		tviewers.innerText = ( cstream ? stream.viewers.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ' ' ) : '-' );
		tfollowers.innerText = ( ( typeof( followers[ 1 ] ) === 'object' && followers[ 1 ] !== null ) ? followers[ 0 ].toString().replace( /\B(?=(\d{3})+(?!\d))/g, ' ' ) : '-' );
	}

	/**
	 * @desc Allows you to manage the settings of a particular user
	 * @param	{string}			user_name			User name to add
	 * @param	{bool}				[force]				Allows you to initialize the interface with existing users
	 */
	function users_add( user_name, force )
	{
		iuser.focus();
		user_name = ( ( typeof( user_name ) === 'string' ) ? user_name : iuser.value ).trim().toLowerCase();
		if ( force !== true )
		{
			if ( !user_name || typeof( users[ user_name ] ) !== 'undefined' )
				return ;

			users[ user_name ] = { name: user_name };
		}

		ksettings.forEach( ( key ) => {
			if ( typeof( users[ user_name ][ key ] ) === 'undefined' )
				users[ user_name ][ key ] = undefined;
		} );

		var li = html( templates.user( Object.assign( { data: users[ user_name ] }, language[ 2 ] ) ), true );
		dsettings.querySelector( '.users' ).appendChild( li );

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

						users[ user_name ].voice = ( voice_user ? ( voice_user[ 1 ].lang + '|' + voice_user[ 1 ].name ) : undefined );
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
					usvoice.setAttribute( ( usvoice.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), span.innerHTML );
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
				usvoice.setAttribute( ( usvoice.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), span.innerHTML );
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
			body.querySelector( 'button[name=words]' ).innerText = language[ 2 ].manage.variable.replace( '%s', Object.keys( data.words ).length );

			var uivolume = body.querySelector( '.value input[name=volume]' );
			var uilusername = body.querySelector( '.value input[name=lusername]' );
			var uilmessage = body.querySelector( '.value input[name=lmessage]' );
			var uirepeat = body.querySelector( '.value input[name=repeat]' );
			var uiflooding = body.querySelector( '.value input[name=flooding]' );

			uivolume.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.volume.change.replace( '%d', parseInt( parseFloat( this.value ) * 100 ) ) ); } );
			uilusername.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.limit.usernames.change.replace( '%d', parseInt( this.value ) ) ); } );
			uilmessage.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.limit.messages.change.replace( '%d', parseInt( this.value ) ) ); } );
			uirepeat.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.repeat.change.replace( '%d', parseInt( this.value ) ) ); } );
			uiflooding.addEventListener( 'change', function() { this.setAttribute( ( this.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), language[ 2 ].voice.flooding.change.replace( '%d', parseInt( this.value ) ) ); } );

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
			delete users[ user_name ];
			li.remove();

			this.Tooltip.dispose();
		} );

		Array.from( li.querySelectorAll( '[title]' ) ).map( elem => new BSN.Tooltip( elem, { placement: ( elem.classList.contains( 'tip-left' ) ? 'left' : 'top' ), delay: 250 } ) );

		iuser.value = '';
		users_search();
	}

	var users_timeout = 0;
	/**
	 * @desc Retrieve information related to the current Stream
	 * @param	{Event}				event				Targeted address
	 */
	function users_search( event )
	{
		if ( users_timeout )
			clearTimeout( users_timeout );

		if ( event )
		{
			users_timeout = setTimeout( users_search, 500 );
			return ;
		}

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
			var user_name = more.toLowerCase();
			if ( user_name && typeof( users[ user_name ] ) !== 'undefined' )
			{
				var tuser = users[ user_name ];
				if ( typeof( tuser.sentences ) !== 'undefined' && typeof( tuser.sentences[ type ] ) !== 'undefined' )
				{
					var tmp = tuser.sentences[ type ];
					chat_enabled = ( ( typeof( tmp[ 1 ] ) !== 'undefined' ) ? tmp[ 1 ] : chat_enabled );
					speech_enabled = ( ( typeof( tmp[ 2 ] ) !== 'undefined' ) ? tmp[ 2 ] : speech_enabled );
					template = ( ( tmp[ 0 ] && tmp[ 0 ].trim() ) ? tmp[ 0 ] : template );
				}
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
		new BSN.Tooltip( reset, { placement: ( reset.classList.contains( 'tip-left' ) ? 'left' : 'top' ), delay: 250 } );

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
				data.data.push( { error: false, word: word, replace: value[ 1 ], mode: value[ 0 ] } );
			} );

			return ( Object.assign( data, language[ 2 ] ) );
		};
		var set_actions = ( imodal ) => {
			imodal.querySelectorAll( 'tbody > tr' ).forEach( ( elem ) => {
				var key = elem.querySelector( 'th' ).innerText;
				var mode = () => {
					var user = elem.querySelector( '.fa-user' ).classList.contains( 'enabled' );
					var message = elem.querySelector( '.fa-comment-dots' ).classList.contains( 'enabled' );

					return ( ( user && message ) ? 3 : ( message ? 2 : ( user ? 1 : 0 ) ) );
				};

				elem.querySelectorAll( '.fa-user, .fa-comment-dots' ).forEach( ( selem ) => {
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
	 * @return	{HTMLElement}							Item to add to a list
	 */
	function chat( user, message, flags, extra, special )
	{
		var dclass = [];
		var timestamp = new Date( parseInt( extra ? extra.timestamp : Date.now() ) );

		if ( flags && typeof( flags.highlighted ) === 'boolean' && flags.highlighted )
			dclass.push( 'highlighted' );
		if ( flags && typeof( flags.connected ) === 'boolean' && flags.connected )
			dclass.push( 'connected' );
		if ( flags && typeof( flags.disconnected ) === 'boolean' && flags.disconnected )
			dclass.push( 'disconnected' );

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
				if ( item instanceof HTMLLinkElement )
					dclass.push( 'links' );
				if ( item instanceof HTMLImageElement )
					dclass.push( 'emotes' );
			} );
		}
		else
			dmessage.innerText = message;

		var obj = {
			user: user,
			class: dclass,
			extra: extra,
			flags: flags,
			message: dmessage.innerHTML,
			special: special,
			timestamp: timestamp.getTime(),
			color: ( extra ? colors[ extra.userId ] : 'initial' ),
			accept: [ 'broadcaster', 'mod', 'founder', 'vip', 'subscriber', 'premium', 'partner' ],
			time: ( '0' + timestamp.getHours() ).slice( -2 ) + ':' + ( '0' + timestamp.getMinutes() ).slice( -2 ),
		};

		var dchat_parent = dchat.parentNode;
		var dchat_diff = ( dchat.offsetHeight >= ( dchat_parent.offsetHeight - 20 ) );
		var bottom = ( ( dchat_parent.scrollTop + ( dchat_diff ? dchat_parent : dchat ).offsetHeight ) >= ( dchat_parent.scrollHeight - 20 ) );

		var li = html( templates.message( Object.assign( {}, { data: obj }, language[ 2 ] ) ), true );
		dchat.appendChild( li );
		Array.from( li.querySelectorAll( '[title]' ) ).map( tip => new BSN.Tooltip( tip, { placement: 'top', delay: 250 } ) );

		if ( iautoscroll.checked && bottom )
			dchat_parent.scrollTop = dchat_parent.scrollHeight;

		return ( li );
	}

	/**
	 * @desc Sends a message to the system to say it
	 * @param	{string}			text				Message to read
	 * @param	{Object}			[force]				Force the message to be read
	 * @param	{string}			[user]				Twitch username
	 * @param	{Object}			[flags]				User-related flags
	 */
	function speech( text, force, user, flags )
	{
		if ( !force )
			return ( line.push( [ text, user, flags ] ) );
		if ( !msg || !text )
			return ;

		inchat = true;
		if ( iascii.checked )
			text = text.replace( /[^\040-\176\200-\377]/gi, '' );

		var data = {
			rate:		parseFloat( irate.value ),
			pitch:		parseFloat( ipitch.value ),
			volume:		parseFloat( ivolume.value ),
			voice:		voice[ 1 ],
			flooding:	parseInt( iflooding.value )
		}

		var user_name = ( user ? user.trim().toLowerCase() : false );
		if ( user_name && typeof( users[ user_name ] ) !== 'undefined' )
		{
			var tuser = users[ user_name ];
			Object.keys( data ).forEach( ( key ) => {
				if ( typeof( tuser[ key ] ) === 'string' )
				{
					if ( key == 'voice' )
					{
						voices.forEach( ( item, index ) => {
							var text = `[${item.lang}] ${item.name}`;
							if ( tuser.voice == item.name )
								data.voice = [ index, item ];
						} );
					}
					else if ( !isNaN( parseFloat( tuser[ key ] ) ) )
						data[ key ] = parseFloat( tuser[ key ] );
					else if ( !isNaN( parseInt( tuser[ key ] ) ) )
						data[ key ] = parseInt( tuser[ key ] );
				}
			} );
		}

		msg.rate = ( parseInt( data.rate * 100 ) / 100 );
		msg.pitch = ( parseInt( data.pitch * 100 ) / 100 );
		msg.volume = ( parseInt( data.volume * 100 ) / 100 );
		msg.voice = data.voice;
		msg.text = text;

		var flooding = ( 100 - data.flooding );
		if ( !msg.volume || ( user && flooding < 100 && FloodDetector.evaluate( text, flooding ) ) )
			return ( inchat = false );

		window.speechSynthesis.speak( msg );
	}

	/**
	 * @desc Enables/Disables a chat option
	 * @param	{string}			name				Name of the option
	 */
	function toggle( name )
	{
		var elem = dsettings.querySelector( `[name=${name}]` );
		dchat.classList.toggle( name, elem.checked );
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

		user_name = ( user_name ? user_name.toLowerCase() : false );
		if ( user_name && typeof( users[ user_name ] ) !== 'undefined' )
		{
			var tuser = users[ user_name ];
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
	 * @desc Replace words according to settings
	 * @param	{string}			[user]				Twitch username
	 * @param	{string}			[message]			Message
	 * @return	{(string|Array)}						Processed items
	 */
	function replace( user, message )
	{
		var uuser = ( typeof( user ) !== 'undefined' );
		var umessage = ( typeof( message ) !== 'undefined' );

		Object.keys( words ).forEach( ( word ) => {
			var [ mode, replacement ] = words[ word ];
			if ( ( mode == 1 || mode == 3 ) && uuser )
				user = user.split( word ).join( replacement );
			if ( ( mode == 2 || mode == 3 ) && umessage )
				message = message.split( word ).join( replacement );
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
				elem.innerText = text.substr( 1 );

				speech_msg = speech_msg.slice( 0, item[ 2 ] ) + text.substr( 1 ) + speech_msg.slice( item[ 3 ] );
			}
			else if ( item[ 0 ] == 'link' )
			{
				elem = document.createElement( 'a' );
				elem.href = text;
				elem.innerText = text;

				if ( !ilinks.checked )
					speech_msg = speech_msg.slice( 0, item[ 2 ] ) + speech_msg.slice( item[ 3 ] );
			}
			else if ( item[ 0 ] == 'emote' )
			{
				elem = document.createElement( 'img' );
				elem.src = `https://static-cdn.jtvnw.net/emoticons/v1/${item[ 1 ]}/3.0`;
				elem.alt = text;
				elem.title = text;

				if ( !iemotes.checked )
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
		if ( !command )
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

		var [ template, flags, chat_enabled, split_msg, speech_enabled, speech_msg ] = convert( 'chat', user, message, flags, extra );

		if ( chat_enabled )
			chat( user, split_msg, flags, extra );

		if ( speech_enabled && speech_msg )
		{
			var [ luser, lmessage ] = replace( user, speech_msg );
			var text = template
				.replace( /\$username\$/g, limit( 'username', luser, user ) )
				.replace( /\$message\$/g, limit( 'message', lmessage, user ) );

			var user_name = user.toLowerCase();
			var repeat_value = parseInt( irepeat.value );
			if ( typeof( users[ user_name ] ) !== 'undefined' && typeof( users[ user_name ].repeat ) !== 'undefined' )
				repeat_value = parseInt( users[ user_name ].repeat );

			if ( repeat[ 0 ] > 0 && repeat[ 1 ] == extra.userId )
			{
				if ( repeat[ 0 ] > repeat_value )
					repeat[ 0 ] = repeat_value;

				--repeat[ 0 ];
				text = limit( 'message', lmessage, user );
			}
			else
				repeat = [ repeat_value, extra.userId ]

			if ( text )
				speech( text, false, user, flags );
		}
	}

	ComfyJS.onMessageDeleted = ( id, extra ) => { // Responds to chat message deleted
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onMessageDeleted:', id, extra );
	};

	// customRewardId
	ComfyJS.onReward = ( user, reward, cost, extra ) => {
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onReward:', user, reward, cost, extra );

		if ( extra.rewardFulfilled )
			return ;

		var [ template, flags, chat_enabled, split_msg, speech_enabled, speech_msg ] = convert( 'reward', user, reward, null, extra );

		if ( chat_enabled )
			chat( prechat( language[ 2 ].chat.reward
				.replace( /\$username\$/g, user )
				.replace( /\$reward\$/g, reward )
				.replace( /\$cost\$/g, cost ), split_msg, ' : ' ), undefined, { highlighted: true } );

		if ( speech_enabled && speech_msg )
		{
			var luser = replace( user );
			speech( template
				.replace( /\$username\$/g, limit( 'username', luser, user ) )
				.replace( /\$reward\$/g, reward )
				.replace( /\$cost\$/g, cost ), false, user, null );
		}
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
				.replace( /\$username\$/g, luser )
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

		chat( language[ 2 ].chat.connected.replace( /\$channel_name\$/g, channel[ 0 ] ), undefined, { connected: true } );
		update();

		if ( channel[ 0 ] && !channel[ 1 ] )
		{
			var tchannel = channel[ 0 ];
			var channel_name = encodeURIComponent( tchannel );
			request( `https://api.twitch.tv/kraken/users?login=${channel_name}` )
				.then( ( data ) => {
					try
					{
						if ( channel[ 0 ] && channel[ 0 ] == tchannel )
						{
							channel[ 1 ] = data.users[ 0 ]._id;
							channel_infos( channel[ 1 ], ( data ) => {
								if ( channel[ 0 ] && channel[ 0 ] == tchannel )
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
	};

	ComfyJS.onReconnect = ( reconnectCount ) => { // Responds when attempting to reconnect to the Twitch chat.
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onReconnect:', reconnectCount );

		chat( language[ 2 ].chat.reconnection );
	};

	ComfyJS.onError = ( error ) => { // Hook for Errors
		var message = '';
		if ( typeof( error ) === 'string' && error.indexOf( 'Login authentication failed' ) >= 0 )
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
		[ 'in',				function() { return ( ( ( typeof( arguments[ 1 ] ) === 'string' ) ? JSON.parse( arguments[ 1 ] ) : arguments[ 1 ] ).indexOf( arguments[ 0 ] ) >= 0 ); } ],
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

	init();
} );
