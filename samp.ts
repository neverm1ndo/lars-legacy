import * as dgram from 'dgram';

interface ServerGameMode {
  name: string;
  mode: string;
  lang: string;
  players: {
    online: number;
    max: number;
  },
  private: boolean;
}
interface ServerProp {
  [property: string]: string
}
interface ServerPlayer {

}

class Samp {
    debounce: number = 1000;
    constructor(debounce: number) {
      this.debounce = debounce;
    }

    async getServerInfo(ip: string, port: number) {
        return await Promise.all(
            ["i", "r", "d"].map(async (res) => await this.request(ip, port, res))
        );
    }

    request(ip: string, port: number, opcode: string): Promise<ServerGameMode | ServerProp[] | ServerPlayer[]> {
        return new Promise((resolve, reject) => {
            const socket = dgram.createSocket("udp4");
            let packet: Buffer = Buffer.alloc(10 + opcode.length);

            packet.write('SAMP');
            packet[4] = Number(ip.split('.')[0]);
            packet[5] = Number(ip.split('.')[1]);
            packet[6] = Number(ip.split('.')[2]);
            packet[7] = Number(ip.split('.')[3]);
            packet[8] = port & 0xFF;
            packet[9] = port >> 8 & 0xFF;
            packet[10] = opcode.charCodeAt(0);

            socket.send(packet, 0, packet.length, port, ip, (err: Error) => {
              reject(err);
            });

            let controller: NodeJS.Timeout = setTimeout(() => {
                socket.close();
                reject(new Error(`Server ${ip}:${port} is unavalible`));
            }, this.debounce);

            socket.on('message', (message: Buffer) => {
                if (controller) clearTimeout(controller);
                if (message.length < 11) {
                    reject(`[error] invalid socket on message - ${message}`)
                }
                else {
                    socket.close();
                    message = message.slice(11);
                    let offset = 0;
                    if (opcode === 'i') {
                        const gameModeInfo: ServerGameMode = {
                          name: String(message.slice(offset += 4, offset += message.readUInt16LE(offset += 2))),
                          mode: String(message.slice(offset += 4, offset += message.readUInt16LE(offset))),
                          lang: String(message.slice(offset += 4, offset += message.readUInt16LE(offset))),
                          players: {
                            online: message.readUInt16LE(offset += 1),
                            max:  message.readUInt16LE(offset += 2),
                          },
                          private: !!message.readUInt8(offset)
                        }

                        resolve(gameModeInfo);
                    }
                    else if (opcode === 'r') {
                        offset += 2;

                        const object: ServerProp[] = [
                          ...new Array(message.readUInt16LE(offset - 2)).fill({})
                        ].map(() => {
                            const property = String(message.slice(++offset, offset += message.readUInt8(offset)));
                            const propertyvalue = String(message.slice(++offset, offset += message.readUInt8(offset)));
                            return { [property]: propertyvalue }
                        })
                        resolve(object);
                    }
                    else if (opcode === 'd') {
                        offset += 2;
                        const object: ServerPlayer[] = [
                            ...new Array(Math.floor(message.readUInt16LE(offset - 2)))
                                .fill({})
                        ].map(() => {
                            const id = message.readUInt8(offset);
                            const name = String(message.slice(++offset, offset += message.readUInt8(++offset)));
                            const score = message.readUInt16LE(offset);
                            const ping = message.readUInt16LE(offset += 4);
                            offset += 4;
                            return { id, name, score, ping };
                        });
                        resolve(object);
                    }
                }
            });
        })
    }
}

export default Samp;
