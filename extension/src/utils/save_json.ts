export const save_json = (obj:object, filename:string) => {
    try{
        const data = JSON.stringify(obj, null, 2);
        const blob = new Blob( [ data ], {
            type: 'application/json'
        });

        const url = URL.createObjectURL( blob );
        const link = document.createElement( 'a' );
        link.setAttribute( 'href', url );
        link.setAttribute( 'download', filename);
        const event = document.createEvent( 'MouseEvents' );
        event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent( event );

        return true
    }
    catch (err){
        console.log(err)
        return false
    }
}