const	path				= require( 'path' ),
		{
			app,
			Menu,
			Tray,
			shell,
			nativeImage,
			BrowserWindow
		}					= require( 'electron' ),
		Config				= require( 'electron-config' ),
		config				= new Config();

let		win = null,
		tray = null;

Menu.setApplicationMenu( null );

function createWindow()
{
	const 	appbase		= path.join( __dirname, 'app' ),
			appindex	= path.join( appbase, 'index.html' ),
			appicon		= path.join( appbase, 'images', 'icon.png' );

	// Create window
	let opts = {
		minWidth: 800,
		minHeight: 600,
		icon: appicon,
		//show: false,
		//autoHideMenuBar: true,
		webPreferences: {
			//preload: path.join( __dirname, 'preload.js' ),
			worldSafeExecuteJavaScript: true,
			//nodeIntegration: false,
			//webSecurity: true,
			//allowEval: false,
			//sandbox: true,
		}
	};
	Object.assign( opts, config.get( 'winBounds' ) );

	win = new BrowserWindow( opts );
	win.setMenuBarVisibility( false );
	win.loadFile( appindex );

	// Check if a second instance is launched
	const lock = app.requestSingleInstanceLock();
	if ( !lock )
		return ( app.quit() );

	app.on( 'second-instance', ( event, commandLine, workingDirectory ) => {
		win.show();
		win.focus();
	} );

	// Display Systray
	const contextMenu = Menu.buildFromTemplate( [
		{
			label: 'Show',
			click: () => {
				win.show();
			}
		},
		{
			label: 'Reload',
			selector: 'reload:',
			accelerator: 'CmdOrCtrl+R',
			click: () => {
				win.loadFile( appindex );
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Quit',
			click: () => {
				app.isQuiting = true;
				app.quit();
			}
		}
	] );

	const image = nativeImage.createFromPath( appicon );
	//image.setTemplateImage( true );
	tray = new Tray( image.resize( { width: 16, height: 16 } ) );
	tray.setToolTip( 'AruChat' );
	tray.setContextMenu( contextMenu );
	tray.on( 'double-click', () => {
		win.show();
	} );

	// Open DevTools
	//win.webContents.openDevTools();

	// Restore Fullscreen
	if ( config.get( 'fullscreen' ) )
		win.setFullScreen( true );

	// Enable Clipboard
	win.webContents.on( 'did-finish-load', () => {
		win.webContents.executeJavaScript( `
			window.addEventListener( 'keydown', function( event ) {
				var CmdOrCtrl = ( event.ctrlKey || event.metaKey && event.ctrlKey != event.metaKey );
				if ( event.keyCode === 88 && CmdOrCtrl )
					document.execCommand( 'cut' );
				else if ( event.keyCode === 67 && CmdOrCtrl )
					document.execCommand( 'copy' );
				else if ( event.keyCode === 86 && CmdOrCtrl )
					document.execCommand( 'paste' );
				else if ( event.keyCode === 65 && CmdOrCtrl )
					document.execCommand( 'selectAll' );
				else if ( event.keyCode === 90 && CmdOrCtrl )
					document.execCommand( 'undo' );
				else if ( event.keyCode === 89 && CmdOrCtrl )
					document.execCommand( 'redo' );
				else if ( event.code === 'KeyR' && CmdOrCtrl )
					document.location.reload( true );
			} );
		` );
	} );

	win.webContents.on( 'new-window', ( event, url ) => {
		if ( url.indexOf( '://www.twitch.tv/' ) >= 0 )
		{
			event.preventDefault();
			shell.openExternal( url );
		}
	} );

	// Window closed
	win.on( 'close', ( event ) => {
		config.set( 'fullscreen', win.isFullScreen() );
		config.set( 'winBounds', win.getBounds() );

		if ( !app.isQuiting )
		{
			event.preventDefault();
			win.hide();

			return ( false );
		}

		win = null;
		app.quit();
	} );
}

app.whenReady().then( () => {
	createWindow();

	app.on( 'activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		//if ( BrowserWindow.getAllWindows().length === 0 )
		//	createWindow();

		win.show();
	} );

	win.on( 'minimize', ( event ) => {
		event.preventDefault();
		win.hide();
	} );
} );

app.on( 'before-quit', () => {
	app.isQuiting = true;
} );

app.on( 'window-all-closed', () => {
	app.quit();
} );
