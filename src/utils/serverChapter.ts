import { EpisodeServer } from "@/types/type"


interface ServerChapter {
    data1: EpisodeServer,
    data2: EpisodeServer
}


const deepMergeServerChapter = async ({data1, data2}: ServerChapter) => {
    let o ;
    let k ;
    if(data1){
        o = {
            server_name: data1.server_name,
            server_data: data1.server_data
        }
    }
    if(data2){
        k = {
            server_name: data2.server_name,
            server_data: data2.server_data
        }
    }
    return {o,k}
}
