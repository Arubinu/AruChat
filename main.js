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

	// Display Systray
	const contextMenu = Menu.buildFromTemplate( [
		{
			label: 'Show',
			click: () => {
				win.show();
			}
		},
		/*{
			label: 'Edit',
			submenu: [
				{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
				{ label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
				{ type: 'separator' },
				{ label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
				{ label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
				{ label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
			]
		},*/
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
				if ( event.keyCode === 88 && event.metaKey )
					document.execCommand( 'cut' );
				else if ( event.keyCode === 67 && event.metaKey )
					document.execCommand( 'copy' );
				else if ( event.keyCode === 86 && event.metaKey )
					document.execCommand( 'paste' );
				else if ( event.keyCode === 65 && event.metaKey )
					document.execCommand( 'selectAll' );
				else if ( event.keyCode === 90 && event.metaKey )
					document.execCommand( 'undo' );
				else if ( event.keyCode === 89 && event.metaKey )
					document.execCommand( 'redo' );
			} );
		` );
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
