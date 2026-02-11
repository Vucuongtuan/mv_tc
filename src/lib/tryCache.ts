


export const tryC = async <T>(fn: () => Promise<T>) => {
    try{
        return await fn();
    }catch(err){
        console.log(err)
        throw err;
    }
}
export const tryCache = async <T>(fn: () => Promise<T>):Promise<[T | null, Error | null]> => {
    try{
        const res = await fn();
        return [res,null];
    }catch(err){
        console.log(err)
        return [null,err as Error];
    }
}