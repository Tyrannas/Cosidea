
/**
 * tmpId - gives a new unique tmp id (negative number) to avoid collision with backend api
 */

function __tmpId() {
    let id = 0;
    return function() {
        return - ( id++ );
    };
}

export let tmpId = __tmpId();

export function isRegisted( data ) {
    return data.id >= 0;
}

export function corailChanged( c1, c2 ) {
    let name = (c1.name !== c2.name);
    let desc = (c1.description !== c2.description);

    return name || desc;
}