export const ACCEPT_CONFIG = {
    video: ['.mp4', '.mp3'],
    document: ['.pdf'],
    getAll(){
        return [...this.video, ...this.document]
    },
};