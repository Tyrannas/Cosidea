
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

