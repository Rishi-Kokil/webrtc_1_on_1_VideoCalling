class PeerService {
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: ['stun:stun.l.google.com:19302'],
                    },
                ],// iceservers array of objects
            });//this.peer
        }
    }
    async setLocalDescription(ans){
        if(this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }

    async getAnswer(offer){
        if(this.peer){
            await this.peer.setRemoteDescription(offer);
            const ans = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(ans));
            return ans;
        }
    }

    async getOffer(){
        if(this.peer){
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        }
    }
}

// returning an instance of PeerService by default so that there is no need to use new again and again
export default new PeerService();