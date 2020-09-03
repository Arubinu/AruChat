window.addEventListener( 'load', () => {
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
		words		= {},
		repeat		= [ 0, '' ],
		stream		= null,
		voices		= [],
		channel		= [ '', '' ],
		nosleep		= null,
		excludes	= [],
		language	= null;
		followers	= [ 0, null ],
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

	function load()
	{
		ichannel.value = ( localStorage.getItem( 'channel' ) || '' );
		token = ( localStorage.getItem( 'token' ) || '' );

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

		var event = document.createEvent( 'HTMLEvents' );
		event.initEvent( 'change', true, false );
		ivolume.dispatchEvent( event );
		irepeat.dispatchEvent( event );
		ilusernames.dispatchEvent( event );
		ilmessages.dispatchEvent( event );
		iflooding.dispatchEvent( event );

		try
		{
			var tmp = JSON.parse( localStorage.getItem( 'excludes' ) );
			if ( Array.isArray( tmp ) )
				excludes = tmp;
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

		bexcluded.innerText = language[ 2 ].manage.variable.replace( '%s', excludes.length );
		bwords.innerText = language[ 2 ].manage.variable.replace( '%s', Object.keys( words ).length );

		toggle( 'timestamp' );
	}

	function save( data )
	{
		try
		{
			localStorage.setItem( 'channel', ( data ? data.channel : channel[ 0 ] ) );
			localStorage.setItem( 'token', ( data ? data.token : token ) );

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

			localStorage.setItem( 'excludes', ( data ? data.excludes : JSON.stringify( excludes ) ) );
			localStorage.setItem( 'sentences', ( data ? data.sentences : JSON.stringify( sentences ) ) );
			localStorage.setItem( 'words', ( data ? data.words : JSON.stringify( words ) ) );
		} catch ( e ) {}
	}

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

			var event = document.createEvent( 'MouseEvents' );
			event.initEvent( 'click', true, false );
			input.dispatchEvent( event );
		} );
	}

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

		var event = document.createEvent( 'MouseEvents' );
		event.initEvent( 'click', true, false );
		a.dispatchEvent( event );

		window.URL.revokeObjectURL( url );
	}

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

	function channel_followers( channel_id, callback )
	{
		if ( !channel_id )
			return ;

		request( `https://api.twitch.tv/kraken/channels/${channel_id}/follows?limit=100` )
			.then( ( data ) => { callback( data ); } )
			.catch( ( error ) => { console.error( 'followers:', error ); } );
	}

	function html( template, first )
	{
		var div = document.createElement( 'div' );
		div.innerHTML = template;
		return ( first ? div.children[ 0 ] : div.children );
	}

	function modal( obj, large )
	{
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

	function init( passe )
	{
		if ( !passe )
		{
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
							bwords = dsettings.querySelector( 'button[name=words]' );
							bexport = dsettings.querySelector( 'button[name=export]' );
							bimport = dsettings.querySelector( 'button[name=import]' );
							bconnect = dsettings.querySelector( 'button[name=connect]' );
							bexcluded = dsettings.querySelector( 'button[name=excluded]' );
							bsentences = dsettings.querySelector( 'button[name=sentences]' );
							bdisconnect = dsettings.querySelector( 'button[name=disconnect]' );
							tviewers = dbase.querySelector( '.viewers' );
							tfollowers = dbase.querySelector( '.followers' );
							tchangelog = dbase.querySelector( '.changelog' );
							tlanguages = dbase.querySelector( '.languages' );
							svoice = dsettings.querySelector( 'div[name=voice]' );
							irate = dsettings.querySelector( 'input[name=rate]' );
							iascii = dsettings.querySelector( 'input[name=ascii]' );
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
											large:			true,
											title:			( tchangelog.getAttribute( 'data-original-title' ) || tchangelog.title ),
											html:			'<span style="white-space: pre-wrap;">%s</span>'.replace( '%s', changelog ),
											footer: {
												input:		false,
												close:		false,
												confirm:	false
											}
										} );
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
			bexcluded.addEventListener( 'click', () => {
				var add_user = ( item ) => {
					var user = document.createElement( 'button' );
					user.className = 'btn btn-sm btn-outline-info';
					user.innerText = item;
					user.title = language[ 2 ].users.excluded.delete;

					user.addEventListener( 'click', () => {
						excludes.splice( excludes.indexOf( item ), 1 );
						if ( user.Tooltip )
							user.Tooltip.dispose();
						user.remove();

						bexcluded.innerText = language[ 2 ].manage.variable.replace( '%s', excludes.length );
					} );

					body.appendChild( user );
					new BSN.Tooltip( user, { placement: ( user.classList.contains( 'tip-left' ) ? 'left' : 'top' ), delay: 250 } );
				};

				var imodal = modal( {
					title:					( bexcluded.getAttribute( 'data-original-title' ) || bexcluded.title ),
					body:					'',
					footer: {
						input: {
							icon:			'user-plus',
							value:			'',
							placeholder:	language[ 2 ].modals.excluded.input,
							click:			( elem, obj ) => {
								var item = elem.value.trim().toLowerCase();
								if ( !item || excludes.indexOf( item ) >= 0 )
									return ;

								add_user( item );
								excludes.push( item );

								bexcluded.innerText = language[ 2 ].manage.variable.replace( '%s', excludes.length );
								elem.value = '';
							}
						},
						close:				true,
						confirm:			false
					}
				} );

				var body = imodal.querySelector( '.modal-body' );
				excludes.forEach( add_user );
			} );
			bsentences.addEventListener( 'click', () => {
				var all = {};
				var data = {};
				Object.keys( originals ).forEach( ( subkey, index ) => {
					var sdata = sentence( subkey );
					var key = ( ( subkey.indexOf( '_' ) > 0 ) ? subkey.slice( 0, subkey.indexOf( '_' ) ) : subkey );

					if ( key == subkey )
						data[ key ] = { key: key, name: originals[ key ][ 0 ], list: [] };

					data[ key ].list.push( {
						subkey:				subkey,
						subname:			originals[ subkey ][ 0 ],
						input: {
							value:			sdata[ 2 ],
							placeholder:	sentence( subkey, true )[ 2 ]
						},
						small:				'<u>%s:</u> '.replace( '%s', language[ 2 ].sentences.variables ) + originals[ subkey ][ 1 ],
						chat:				sdata[ 0 ],
						speech:				sdata[ 1 ]
					} );
				} );

				var imodal = modal( {
					title:			( bsentences.getAttribute( 'data-original-title' ) || bsentences.title ),
					html:			templates.sentences( { data: Object.values( data ) } ),
					footer: {
						input:		false,
						close:		true,
						confirm:	( elem, obj ) => {
							Object.keys( all ).forEach( ( key ) => {
								var value = all[ key ][ 2 ].value.trim();
								var text = ( ( !value || value == sentence( key, true )[ 2 ] ) ? '' : value );
								var chat_enabled = ( all[ key ][ 0 ].getAttribute( 'data-enabled' ) == 'true' );
								var speech_enabled = ( all[ key ][ 1 ].getAttribute( 'data-enabled' ) == 'true' );
								sentences[ key ] = [ text, chat_enabled, speech_enabled ];
							} );
						}
					}
				} );

				var body = imodal.querySelector( '.modal-body' );

				Object.keys( originals ).forEach( ( subkey, index ) => {
					var key = ( ( subkey.indexOf( '_' ) > 0 ) ? subkey.slice( 0, subkey.indexOf( '_' ) ) : subkey );

					//var tab = body.querySelector( `#sentences_${key}` );
					var input = body.querySelectorAll( 'input' )[ index ];
					var chat_enabled = body.querySelectorAll( 'i.chat' )[ index ];
					var speech_enabled = body.querySelectorAll( 'i.speech' )[ index ];

					all[ key ] = [ chat_enabled, speech_enabled, input ];
					chat_enabled.addEventListener( 'click', function() { var value = !( this.getAttribute( 'data-enabled' ) == 'true' ); this.setAttribute( 'data-enabled', value ); this.classList.toggle( 'fa-comment-dots', value ); this.classList.toggle( 'fa-comment-slash', !value ); } );
					speech_enabled.addEventListener( 'click', function() { var value = !( this.getAttribute( 'data-enabled' ) == 'true' ); this.setAttribute( 'data-enabled', value ); this.classList.toggle( 'fa-volume-up', value ); this.classList.toggle( 'fa-volume-off', !value ); } );
				} );

				var reset = document.createElement( 'button' );
				reset.className = 'btn btn-sm btn-danger';
				reset.innerText = language[ 2 ].modals.sentences.reset.button;
				reset.title = language[ 2 ].modals.sentences.reset.title;
				reset.addEventListener( 'click', () => {
					imodal.Modal.hide();

					sentences = {};
					var event = document.createEvent( 'MouseEvents' );
					event.initEvent( 'click', true, false );
					bsentences.dispatchEvent( event );
				} );
				imodal.querySelector( '.modal-footer' ).prepend( reset );
				new BSN.Tooltip( reset, { placement: ( reset.classList.contains( 'tip-left' ) ? 'left' : 'top' ), delay: 250 } );

				Array.from( imodal.querySelectorAll( '.modal-body .nav-link' ) ).map( item => new BSN.Tab( item, { height: true } ) );
			} );
			bwords.addEventListener( 'click', () => {
				var get_data = () => {
					var data = { data: [] };
					Object.keys( words ).forEach( ( word ) => {
						var value = words[ word ];
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
								words[ key ][ 0 ] = mode();
							} );
						} );

						elem.querySelector( '.fa-trash-alt' ).addEventListener( 'click', function() {
							delete words[ key ];
							elem.remove();
							update_button();
						} );

						elem.querySelector( 'input' ).addEventListener( 'change', function() {
							words[ key ] = [ mode(), this.value ];
						} );
					} );
				};
				var update_button = () => {
					bwords.innerText = language[ 2 ].manage.variable.replace( '%s', Object.keys( words ).length );
				};

				var imodal = modal( {
					large:			true,
					title:			( bwords.getAttribute( 'data-original-title' ) || bwords.title ),
					html:			templates.words( get_data() ),
					footer: {
						input: {
							icon:			'clone',
							value:			'',
							placeholder:	language[ 2 ].modals.words.input,
							click:			( elem, obj ) => {
								var item = elem.value.trim().toLowerCase();
								Object.keys( words ).forEach( ( key ) => {
									if ( item == key )
										item = '';
								} );
								if ( !item )
									return ;

								words[ item ] = [ 2, '' ];
								imodal.querySelector( '.modal-body' ).innerHTML = templates.words( get_data() );
								set_actions( imodal );

								update_button();
								elem.value = '';
							}
						},
						close:		true,
						confirm:	false
					}
				} );

				set_actions( imodal );
			} );
			bdisconnect.addEventListener( 'click', disconnect );

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
						confirm:	( elem, obj ) => {
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
								large:			true,
								title:			( this.getAttribute( 'data-original-title' ) || this.title ),
								html:			'<img src="%s" style="max-width: 100%;" />'.replace( '%s', image ),
								footer: {
									input:		false,
									close:		false,
									confirm:	false
								}
							} );

							imodal.addEventListener( 'hidden.bs.modal', ( event ) => {
								var event = document.createEvent( 'MouseEvents' );
								event.initEvent( 'click', true, false );
								more.dispatchEvent( event );
							}, false );
						} )
						.catch( ( error ) => {
							console.error( 'token-image:', error );
						} );
				} );
			} );
			ivolume.parentNode.querySelector( ':scope > .fas' ).addEventListener( 'click', () => { ivolume.value = 0; } );
			iflooding.parentNode.querySelector( ':scope > .fas' ).addEventListener( 'click', () => { iflooding.value = 0; } );

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
					return ;

				channel_stream( tchannel, ( data ) => {
					stream = data;
					update();
					channel_next();
				} );

				channel_followers( tchannel, ( data ) => {
					if ( channel[ 1 ] != tchannel )
						return ;

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
							var users = arrivals.join( ', ' );
							var [ chat_enabled, speech_enabled, template ] = sentence( 'follow' );
							if ( chat_enabled )
								chat( `New follower(s): ${users}` );
							if ( speech_enabled )
								speech( template.replace( /\$usernames\$/g, users ) );
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

			voices.sort( ( a, b ) => { return ( ( a.lang < b.lang ) ? -1 : ( a.lang > b.lang ) ); } );
			voices.forEach( ( item, index ) => {
				var text = `[${item.lang}] ${item.name}`;
				if ( item.default )
				{
					voice = [ index, item ];
					svoice.querySelector( ':scope > button' ).innerText = text;

					var span = document.createElement( 'span' );
					span.textContent = text;
					svoice.setAttribute( ( svoice.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), span.innerHTML );
				}

				var option = document.createElement( 'a' );
				option.href = '#';
				//option.selected = voice.default;
				option.className = 'dropdown-item';
				option.innerText = text;

				smenu.appendChild( option );
			} );

			var dvoice = new BSN.Dropdown( svoice );
			svoice.parentNode.addEventListener( 'click', ( event ) => {
				if ( !event.target.classList.contains( 'dropdown-item' ) )
					return ;

				var index = Array.prototype.indexOf.call( event.target.parentNode.children, event.target );
				var tvoice = voices[ index ];
				var text = `[${tvoice.lang}] ${tvoice.name}`;

				tvoice = [ index, tvoice ];
				svoice.querySelector( ':scope > button' ).innerText = text;

				var span = document.createElement( 'span' );
				span.textContent = text;
				svoice.setAttribute( ( svoice.getAttribute( 'data-original-title' ) ? 'data-original-title' : 'title' ), span.innerHTML );
			} );

			var tvoice = localStorage.getItem( 'voice' );
			if ( tvoice )
			{
				var split = tvoice.split( '|' );
				tvoice = { lang: split[ 0 ], name: split.slice( 1 ).join( '|' ) };

				var text = `[${tvoice.lang}] ${tvoice.name}`;
				var item = Array.from( svoice.querySelectorAll( '.dropdown-item' ) ).find( item => { return ( item.textContent === text ); } );
				if ( item )
				{
					var event = document.createEvent( 'MouseEvents' );
					event.initEvent( 'click', true, false );
					item.dispatchEvent( event );
					dvoice.toggle();
				}
			}

			msg = new SpeechSynthesisUtterance();
			msg.onend = () => { inchat = false; };

			speech( ' ' );
		}
		else
			alert( language[ 2 ].unsupported );
	}

	function connect()
	{
		bconnect.blur();
		ichannel.value = ichannel.value.trim();

		line = [];
		channel = [ ichannel.value, '' ];
		followers = [ 0, null ];

		//console.log( 'connect:', channel[ 0 ], ( token || null ) );
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
				if ( audios )
					audios[ cstream ? 0 : 1 ].play();
			} catch ( e ) {}
		}

		zbase.classList.toggle( 'online', !!cstream );
		zbase.classList.toggle( 'show', ( cinfos || cstream ) );
		if ( cinfos || cstream )
		{
			// subdata.mature: +18
			url = ( subdata ? subdata.url : '' ); // onclick
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
							//zlogo.src = 'data:image/png;base64,' + Base64.encode( blob );
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

	function sentence( key, base )
	{
		base = ( base || typeof( sentences[ key ] ) === 'undefined' );
		var chat_enabled = ( base ? originals[ key ][ 3 ] : sentences[ key ][ 1 ] );
		var speech_enabled = ( base ? originals[ key ][ 4 ] : sentences[ key ][ 2 ] );
		var template = ( ( base || !sentences[ key ][ 0 ].trim() ) ? originals[ key ][ 2 ] : sentences[ key ][ 0 ] );
		return ( [ chat_enabled, speech_enabled, template ] );
	}

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

		message = ( ( special && [ 'undefined', 'boolean' ].indexOf( typeof( message ) ) >= 0 ) ? user : message );
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

	function speech( text, force, user, flags )
	{
		if ( !force )
			return ( line.push( [ text, user, flags ] ) );
		if ( !msg || !text )
			return ;

		inchat = true;
		if ( iascii.checked )
			text = text.replace( /[^\040-\176\200-\377]/gi, '' );

		msg.rate = ( parseInt( parseFloat( irate.value ) * 100 ) / 100 );
		msg.pitch = ( parseInt( parseFloat( ipitch.value ) * 100 ) / 100 );
		msg.volume = ( parseInt( parseFloat( ivolume.value ) * 100 ) / 100 );
		msg.voice = voice[ 1 ];
		msg.text = text;

		var flooding = ( 100 - parseInt( iflooding.value ) );
		if ( !msg.volume || ( user && flooding < 100 && FloodDetector.evaluate( text, flooding ) ) )
			return ( inchat = false );

		window.speechSynthesis.speak( msg );
	}

	function toggle( name )
	{
		var elem = dsettings.querySelector( `[name=${name}]` );
		dchat.classList.toggle( name, elem.checked );
	}

	function limit( type, value )
	{
		var max = 0;
		if ( type == 'username' )
			max = parseInt( ilusernames.value );
		else if ( type == 'message' )
			max = parseInt( ilmessages.value );

		return ( ( max > 0 ) ? value.substr( 0, max ) : value );
	}

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

	function convert( type, user, message, flags, extra )
	{
		var cut = [];
		var [ chat_enabled, speech_enabled, template ] = ( type ? sentence( type ) : [ true, true, type ] );

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

		Object.keys( extra.messageEmotes || {} ).forEach( ( key ) => {
			extra.messageEmotes[ key ].forEach( ( value ) => {
				var pos = value.split( '-' );
				cut.push( [ 'emote', key, parseInt( pos[ 0 ] ), parseInt( pos[ 1 ] ) + 1 ] );
			} );
		} );

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

		if ( flags )
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
				.replace( /\$username\$/g, limit( 'username', luser ) )
				.replace( /\$message\$/g, limit( 'message', lmessage ) );

			if ( repeat[ 0 ] > 0 && repeat[ 1 ] == extra.userId )
			{
				--repeat[ 0 ];
				text = limit( 'message', lmessage );
			}
			else
				repeat = [ parseInt( irepeat.value ), extra.userId ]

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
				.replace( /\$username\$/g, limit( 'username', luser ) )
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

		var [ chat_enabled, speech_enabled, template ] = sentence( 'hosted' );

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

		var [ chat_enabled, speech_enabled, template ] = sentence( 'raid' );

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
				.replace( /\$username\$/g, limit( 'username', luser ) )
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
				.replace( /\$username\$/g, limit( 'username', luser ) )
				.replace( /\$message\$/g, limit( 'message', lmessage ) )
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
				.replace( /\$username\$/g, limit( 'username', luser ) )
				.replace( /\$message\$/g, limit( 'message', lmessage ) ) );
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
				.replace( /\$username\$/g, limit( 'username', luser ) )
				.replace( /\$message\$/g, limit( 'message', lmessage ) ) );
		}
	};

	ComfyJS.onSubGift = ( gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra ) => { // Responds to user gift subscription
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onSubGift:', gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra );

		var [ chat_enabled, speech_enabled, template ] = sentence( 'gift' );

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
				.replace( /\$gifter\$/g, limit( 'username', lgifter ) )
				.replace( /\$recipient\$/g, limit( 'username', lrecipient ) )
				.replace( /\$cumul\$/g, streakMonths )
				.replace( /\$count\$/g, senderCount ) );
		}
	};

	ComfyJS.onSubMysteryGift = ( gifterUser, numbOfSubs, senderCount, subTierInfo, extra ) => { // Responds to user sending gift subscriptions
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onSubMysteryGift:', gifterUser, numbOfSubs, senderCount, subTierInfo, extra );

		var [ chat_enabled, speech_enabled, template ] = sentence( 'gift_myst' );

		if ( chat_enabled )
		{
			chat( language[ 2 ].chat.gift_myst
				.replace( /\$gifter\$/g, limit( 'username', gifterUser ) )
				.replace( /\$subs\$/g, numbOfSubs )
				.replace( /\$count\$/g, senderCount ) );
		}

		if ( speech_enabled )
		{
			var luser = replace( gifterUser );
			speech( template
				.replace( /\$gifter\$/g, limit( 'username', luser ) )
				.replace( /\$subs\$/g, numbOfSubs )
				.replace( /\$count\$/g, senderCount ) );
		}
	};

	ComfyJS.onGiftSubContinue = ( user, sender, extra ) => { // Responds to user continuing gift subscription
		if ( localStorage.getItem( 'debug' ) )
			console.log( 'onGiftSubContinue:', user, sender, extra );

		var [ chat_enabled, speech_enabled, template ] = sentence( 'gift_renew' );

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
				.replace( /\$gifter\$/g, lsender )
				.replace( /\$recipient\$/g, luser ) );
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
